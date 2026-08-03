import json
import hashlib
import asyncio
from typing import Dict, Any
import redis.asyncio as redis
from datetime import datetime, timezone

audit_lock = asyncio.Lock()
GENESIS_HASH = "0" * 64

async def get_last_hash(redis_client: redis.Redis, tenant_id: str) -> str:
    val = await redis_client.get(f"tenant:{tenant_id}:last_audit_hash")
    if not val:
        return GENESIS_HASH
    # Decode if needed (for some redis clients it returns bytes)
    if isinstance(val, bytes):
        return val.decode("utf-8")
    return val

async def generate_audit_record(
    redis_client: redis.Redis,
    tenant_id: str,
    agent_id: str,
    action: str,
    decision: str,
    status_code: int,
    sanitized_payload: Dict[str, Any],
    latency_ms: float
):
    if not redis_client:
        return

    timestamp = datetime.now(timezone.utc).isoformat()
    
    async with audit_lock:
        previous_hash = await get_last_hash(redis_client, tenant_id)
        
        record = {
            "timestamp": timestamp,
            "tenant_id": tenant_id,
            "agent_id": agent_id,
            "action": action,
            "decision": decision,
            "status_code": status_code,
            "redacted_payload_snippet": sanitized_payload,
            "latency_ms": latency_ms,
            "previous_hash": previous_hash
        }
        
        json_str = json.dumps(record, sort_keys=True)
        current_hash = hashlib.sha256((json_str + previous_hash).encode('utf-8')).hexdigest()
        
        record["current_hash"] = current_hash
        final_record_json = json.dumps(record)
        
        async with redis_client.pipeline(transaction=True) as pipe:
            pipe.set(f"tenant:{tenant_id}:last_audit_hash", current_hash)
            pipe.rpush(f"tenant:{tenant_id}:audit_ledger", final_record_json)
            pipe.publish(f"tenant:{tenant_id}:audit_stream", final_record_json)
            await pipe.execute()

async def verify_audit_chain(redis_client: redis.Redis, tenant_id: str) -> Dict[str, Any]:
    if not redis_client:
        return {"chain_valid": False, "error": "Redis not available"}
        
    records_json = await redis_client.lrange(f"tenant:{tenant_id}:audit_ledger", 0, -1)
    if not records_json:
        return {"chain_valid": True, "total_records": 0}
        
    expected_previous = GENESIS_HASH
    
    for idx, r_json in enumerate(records_json):
        if isinstance(r_json, bytes):
            r_json = r_json.decode("utf-8")
        
        record = json.loads(r_json)
        current_hash = record.pop("current_hash", None)
        
        if record["previous_hash"] != expected_previous:
            return {"chain_valid": False, "tampered_at": idx}
            
        json_str = json.dumps(record, sort_keys=True)
        computed_hash = hashlib.sha256((json_str + expected_previous).encode('utf-8')).hexdigest()
        
        if computed_hash != current_hash:
            return {"chain_valid": False, "tampered_at": idx}
            
        expected_previous = current_hash
        
    return {"chain_valid": True, "total_records": len(records_json)}
