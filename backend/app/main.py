import os
import time
import json
import asyncio
from datetime import datetime, timezone
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import httpx
import redis.asyncio as redis

from app.pii_engine import pii_engine
from app.policy_engine import evaluate_policy
from app.state_engine import is_killswitch_active, check_and_record_spend, toggle_killswitch
from app.audit_engine import generate_audit_record, verify_audit_chain
from app.hitl_engine import request_human_approval, get_pending_approvals, resolve_approval
from app.report_engine import generate_ciso_audit_pdf
from app.db import init_db, generate_api_key, get_all_keys, validate_api_key
from app.prompt_engine import prompt_guard
from app.gateway_engine import gateway_router
from pydantic import BaseModel
from fastapi import Depends
from app.auth import get_password_hash, verify_password, create_access_token, get_current_tenant
from app.db import AsyncSessionLocal, User
from sqlalchemy.future import select
import uuid

app = FastAPI(title="AegisClaw Proxy Core")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global clients
http_client: httpx.AsyncClient = None
redis_client: redis.Redis = None

@app.on_event("startup")
async def startup_event():
    global http_client, redis_client
    # Initialize SQLite DB
    await init_db()
    
    # Use limits and timeouts optimized for low latency
    limits = httpx.Limits(max_keepalive_connections=100, max_connections=200)
    http_client = httpx.AsyncClient(limits=limits, timeout=10.0)
    
    redis_url = os.getenv("REDIS_URL")
    if redis_url:
        redis_client = redis.from_url(redis_url, decode_responses=True)
    else:
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", 6379))
        redis_client = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)
    
    # Pre-load PII engine to minimize latency overhead during requests
    pii_engine.mask_text("preload")

@app.on_event("shutdown")
async def shutdown_event():
    if http_client:
        await http_client.aclose()
    if redis_client:
        await redis_client.aclose()

async def log_telemetry(agent_id: str, target_host: str, status_code: int, latency_ms: float):
    if not redis_client:
        return
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "agent_id": agent_id,
        "target_host": target_host,
        "status_code": status_code,
        "latency_ms": latency_ms
    }
    try:
        await redis_client.publish("aegisclaw:telemetry", json.dumps(event))
    except Exception as e:
        print(f"Failed to publish telemetry: {e}")

@app.get("/proxy/audit/verify")
async def verify_audit(tenant_id: str = Depends(get_current_tenant)):
    return await verify_audit_chain(redis_client, tenant_id)

class AuthRequest(BaseModel):
    email: str
    password: str

@app.post("/auth/register")
async def register(req: AuthRequest):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == req.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        tenant_id = f"tenant_{uuid.uuid4().hex[:8]}"
        user = User(
            id=str(uuid.uuid4()),
            email=req.email,
            hashed_password=get_password_hash(req.password),
            tenant_id=tenant_id,
            created_at=datetime.utcnow().isoformat()
        )
        session.add(user)
        await session.commit()
        
        # Automatically provision the first API Key
        await generate_api_key("Default Production Key", tenant_id)
        
        return {"message": "User registered", "tenant_id": tenant_id}

@app.post("/auth/login")
async def login(req: AuthRequest):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == req.email))
        user = result.scalar_one_or_none()
        if not user or not verify_password(req.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": user.tenant_id, "email": user.email})
        return {"access_token": access_token, "token_type": "bearer", "tenant_id": user.tenant_id}

@app.post("/admin/killswitch/toggle")
async def toggle_ks(tenant_id: str = Depends(get_current_tenant)):
    current = await is_killswitch_active(redis_client, tenant_id)
    await toggle_killswitch(redis_client, tenant_id, not current)
    return {"killswitch_active": not current}

@app.get("/admin/stats")
async def get_stats(tenant_id: str = Depends(get_current_tenant)):
    ks_active = await is_killswitch_active(redis_client, tenant_id)
    
    pii_count_str = await redis_client.get(f"tenant:{tenant_id}:pii_redactions_count")
    pii_count = int(pii_count_str) if pii_count_str else 0
    
    now = time.time()
    window_start = now - 86400
    
    cursor = 0
    total_spend = 0.0
    active_agents = 0
    while True:
        cursor, keys = await redis_client.scan(cursor, match=f"tenant:{tenant_id}:agent:spend:*", count=100)
        for key in keys:
            members = await redis_client.zrangebyscore(key, min=window_start, max="+inf")
            if members:
                active_agents += 1
                for member in members:
                    try:
                        total_spend += float(member.split(":")[0])
                    except Exception:
                        pass
        if cursor == 0:
            break
            
    # Token usage & Prompt blocks
    cursor = 0
    total_tokens = 0
    while True:
        cursor, keys = await redis_client.scan(cursor, match=f"tenant:{tenant_id}:agent:tokens:*", count=100)
        for key in keys:
            members = await redis_client.zrangebyscore(key, min=window_start, max="+inf")
            for member in members:
                try:
                    total_tokens += int(member.split(":")[0])
                except Exception:
                    pass
        if cursor == 0:
            break
            
    prompt_blocks_str = await redis_client.get(f"tenant:{tenant_id}:prompt_blocks_count")
    prompt_blocks = int(prompt_blocks_str) if prompt_blocks_str else 0
            
    return {
        "killswitch_active": ks_active,
        "total_pii_redactions": pii_count,
        "daily_aggregate_spend": total_spend,
        "active_agent_count": active_agents,
        "total_tokens_used": total_tokens,
        "prompt_injections_blocked": prompt_blocks
    }

class KeyRequest(BaseModel):
    name: str

@app.post("/admin/keys")
async def create_key(req: KeyRequest, tenant_id: str = Depends(get_current_tenant)):
    return await generate_api_key(req.name, tenant_id)

@app.get("/admin/keys")
async def list_keys(tenant_id: str = Depends(get_current_tenant)):
    return await get_all_keys(tenant_id)

@app.get("/admin/reports/pdf")
async def get_pdf(tenant_id: str = Depends(get_current_tenant)):
    buffer = await generate_ciso_audit_pdf(redis_client, tenant_id)
    return StreamingResponse(
        buffer, 
        media_type="application/pdf", 
        headers={"Content-Disposition": "attachment; filename=AegisClaw_CISO_Audit_Report.pdf"}
    )

@app.get("/admin/approvals")
async def get_approvals(tenant_id: str = Depends(get_current_tenant)):
    return await get_pending_approvals(redis_client, tenant_id)

@app.post("/admin/approval/{approval_id}/decision")
async def resolve_app(approval_id: str, request: Request, tenant_id: str = Depends(get_current_tenant)):
    data = await request.json()
    decision = data.get("decision", "REJECTED")
    await resolve_approval(redis_client, tenant_id, approval_id, decision)
    return {"status": "resolved"}

@app.get("/admin/logs")
async def get_logs(tenant_id: str = Depends(get_current_tenant)):
    logs = await redis_client.lrange(f"tenant:{tenant_id}:audit_ledger", -50, -1)
    return [json.loads(log) for log in reversed(logs)]

@app.post("/proxy/{target_host}/{target_path:path}")
async def proxy(
    target_host: str,
    target_path: str,
    request: Request,
    authorization: str = Header(default=None),
    x_agent_id: str = Header(default=None),
    x_agent_role: str = Header(default=None),
    x_requested_amount: str = Header(default=None),
    x_tenant_id: str = Header(default="default_tenant"),
    x_compliance_region: str = Header(default="IN")
):
    start_time = time.perf_counter()

    # STEP 0: Validate API Key
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or Invalid Authorization Header")
    
    api_key = authorization.split(" ")[1]
    key_obj = await validate_api_key(api_key)
    if not key_obj:
        raise HTTPException(status_code=401, detail="Invalid API Key")

    tenant_id = key_obj.tenant_id

    agent_id = x_agent_id or "unknown"
    action = "unknown_action"
    masked_payload = {}
    region = x_compliance_region.upper()
    if region not in ["IN", "US", "EU", "ALL"]:
        region = "IN"
    
    try:
        # Parse request JSON body asynchronously in memory
        try:
            payload = await request.json()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON payload")

        # GATE 2: Layer 1 Prompt Injection & Jailbreak Guard
        if prompt_guard.scan_payload(payload):
            asyncio.create_task(redis_client.incr(f"tenant:{tenant_id}:prompt_blocks_count"))
            raise HTTPException(status_code=403, detail="Layer 1 Prompt Guard: Malicious Injection Detected")

        # GATE 3: Layer 2 Model Routing & Token Budget Check
        estimated_tokens = len(str(payload)) // 4  # basic heuristic
        if not await gateway_router.check_and_record_tokens(redis_client, tenant_id, agent_id, estimated_tokens):
            raise HTTPException(status_code=429, detail="Layer 2 Gateway: Daily Token Budget Exceeded")
            
        target_host, target_path, payload = gateway_router.route_request(payload, f"/{target_path}")

        # Action mapping based on target path
        normalized_path = target_path if target_path.startswith("/") else f"/{target_path}"
        action_map = {
            "/api/v1/payments/refund": "execute_refund",
            "/api/v1/credit/increase": "increase_credit_limit",
            "/api/v1/wire/transfer": "execute_wire_transfer",
            "/v1/chat/completions": "chat_completion",
            "/v1/messages": "chat_completion",
            "/api/v1/db/export": "bulk_user_export",
            "/api/v1/db/delete": "database_deletion"
        }
        action = action_map.get(normalized_path, "unknown_action")
        
        if "patient" in json.dumps(payload).lower() or "phi" in json.dumps(payload).lower():
             action = "phi_egress"

        # GATE 4: Layer 3 Redis Velocity & Killswitch
        if await is_killswitch_active(redis_client, tenant_id):
            raise HTTPException(
                status_code=403, 
                detail={"error": "FLEET EMERGENCY STOP ENGAGED: Execution Halted"}
            )

        # Parse context
        try:
            amount = float(x_requested_amount) if x_requested_amount else 0.0
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid X-Requested-Amount")

        needs_hitl = await check_and_record_spend(redis_client, tenant_id, agent_id, amount)
        if needs_hitl:
            approved = await request_human_approval(redis_client, tenant_id, agent_id, amount, action, payload)
            if not approved:
                await redis_client.incrbyfloat(f"tenant:{tenant_id}:prevented_spend", amount)
                raise HTTPException(status_code=403, detail="HITL Approval Denied or Timed Out")

        # GATE 5: Layer 3 Cedar Policy-as-Code Scope Evaluation
        is_authorized = await evaluate_policy(
            http_client=http_client,
            principal=x_agent_role,
            action=action,
            resource=normalized_path,
            requested_amount=int(amount),
            tenant_id=tenant_id,
            region=region
        )
        
        if not is_authorized:
            raise HTTPException(
                status_code=403, 
                detail={"error": f"{region} Policy Scope Violation: Action Not Authorized"}
            )

        # GATE 6: Layer 3 Presidio DPDP PII Masking
        masked_payload = pii_engine.mask_json_payload(payload, region)
        if json.dumps(payload, sort_keys=True) != json.dumps(masked_payload, sort_keys=True):
            asyncio.create_task(redis_client.incr(f"tenant:{tenant_id}:pii_redactions_count"))

        target_url = f"http://{target_host}{normalized_path}"
        
        # Determine if we should force HTTPS if going external
        if target_host in ["api.openai.com", "api.anthropic.com"]:
            target_url = f"https://{target_host}{normalized_path}"
        
        req = http_client.build_request("POST", target_url, json=masked_payload)

        try:
            response = await http_client.send(req, stream=True)
        except httpx.RequestError as e:
            end_time = time.perf_counter()
            latency_ms = (end_time - start_time) * 1000
            asyncio.create_task(log_telemetry(agent_id, target_host, 502, latency_ms))
            asyncio.create_task(generate_audit_record(redis_client, tenant_id, agent_id, action, "Error", 502, masked_payload, latency_ms))
            raise HTTPException(status_code=502, detail=f"Bad Gateway: {str(e)}")

        async def stream_generator() -> AsyncGenerator[bytes, None]:
            try:
                async for chunk in response.aiter_bytes():
                    yield chunk
            finally:
                await response.aclose()
                end_time = time.perf_counter()
                latency_ms = (end_time - start_time) * 1000
                asyncio.create_task(log_telemetry(agent_id, target_host, response.status_code, latency_ms))
                asyncio.create_task(generate_audit_record(redis_client, tenant_id, agent_id, action, "Allow", response.status_code, masked_payload, latency_ms))

    except HTTPException as e:
        latency = (time.perf_counter() - start_time) * 1000
        decision = "Deny" if e.status_code in [403, 429] else "Error"
        asyncio.create_task(generate_audit_record(redis_client, tenant_id, agent_id, action, decision, e.status_code, masked_payload, latency))
        raise e

    # Forward headers excluding content-length, content-encoding, transfer-encoding since we stream
    excluded_headers = {"content-length", "content-encoding", "transfer-encoding", "connection"}
    headers = {k: v for k, v in response.headers.items() if k.lower() not in excluded_headers}

    return StreamingResponse(
        stream_generator(),
        status_code=response.status_code,
        headers=headers
    )
