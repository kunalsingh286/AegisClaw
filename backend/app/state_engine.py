import time
import uuid
import redis.asyncio as redis
from fastapi import HTTPException
from app.circuit_breaker import redis_cb

async def _is_killswitch_active_internal(redis_client: redis.Redis, tenant_id: str) -> bool:
    if not redis_client:
        return False
    val = await redis_client.get(f"tenant:{tenant_id}:fleet_killswitch")
    return val == "True" or val == "1" or val == "true"

async def is_killswitch_active(redis_client: redis.Redis, tenant_id: str) -> bool:
    return await redis_cb.call(_is_killswitch_active_internal, redis_client, tenant_id)

async def toggle_killswitch(redis_client: redis.Redis, tenant_id: str, enabled: bool):
    if not redis_client:
        return
    await redis_client.set(f"tenant:{tenant_id}:fleet_killswitch", str(enabled))

async def _check_and_record_spend_internal(redis_client: redis.Redis, tenant_id: str, agent_id: str, amount: float) -> bool:
    if not redis_client:
        return False
        
    if amount > 5000:
        if amount <= 25000:
            return True # HITL needed
        else:
            await redis_client.incrbyfloat(f"tenant:{tenant_id}:prevented_spend", amount)
            raise HTTPException(
                status_code=429, 
                detail={"error": "Single Transaction Limit Exceeded: Maximum \u20b95,000 allowed"}
            )

    now = time.time()
    window_start = now - 86400  # 24 hours ago
    zset_key = f"tenant:{tenant_id}:agent:spend:{agent_id}"

    async with redis_client.pipeline(transaction=True) as pipe:
        pipe.zremrangebyscore(zset_key, min="-inf", max=window_start)
        pipe.zrangebyscore(zset_key, min=window_start, max="+inf")
        results = await pipe.execute()
    
    current_members = results[1]
    
    current_total = 0.0
    for member in current_members:
        try:
            amt_str = member.split(":")[0]
            current_total += float(amt_str)
        except Exception:
            pass
            
    if current_total + amount > 50000:
        await redis_client.incrbyfloat(f"tenant:{tenant_id}:prevented_spend", amount)
        raise HTTPException(
            status_code=429, 
            detail={"error": "Daily Aggregate Budget Exceeded: Maximum \u20b950,000 limit reached"}
        )
        
    # Record the new transaction
    new_member = f"{amount}:{uuid.uuid4().hex}"
    await redis_client.zadd(zset_key, {new_member: now})
    
    return False

async def check_and_record_spend(redis_client: redis.Redis, tenant_id: str, agent_id: str, amount: float) -> bool:
    res = await redis_cb.call(_check_and_record_spend_internal, redis_client, tenant_id, agent_id, amount)
    return bool(res)
