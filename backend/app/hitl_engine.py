import uuid
import json
import asyncio
import redis.asyncio as redis

async def request_human_approval(redis_client: redis.Redis, tenant_id: str, agent_id: str, amount: float, action: str, payload: dict) -> bool:
    if not redis_client:
        return False
        
    approval_id = str(uuid.uuid4())
    data = {
        "approval_id": approval_id,
        "tenant_id": tenant_id,
        "agent_id": agent_id,
        "amount": amount,
        "action": action,
        "payload": payload,
        "status": "PENDING"
    }
    
    # Store pending request with 1 hr TTL
    await redis_client.setex(f"tenant:{tenant_id}:pending_approvals:{approval_id}", 3600, json.dumps(data))
    
    pubsub = redis_client.pubsub()
    await pubsub.subscribe(f"tenant:{tenant_id}:approval_stream:{approval_id}")
    
    try:
        # Wait up to 60 seconds for a response
        timeout = 60
        start_time = asyncio.get_event_loop().time()
        
        while (asyncio.get_event_loop().time() - start_time) < timeout:
            message = await pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
            if message and message['type'] == 'message':
                decision = message['data'].decode('utf-8')
                return decision == "APPROVED"
                
        return False # Timeout -> reject
    finally:
        await pubsub.unsubscribe(f"tenant:{tenant_id}:approval_stream:{approval_id}")
        await redis_client.delete(f"tenant:{tenant_id}:pending_approvals:{approval_id}")

async def get_pending_approvals(redis_client: redis.Redis, tenant_id: str) -> list:
    cursor = 0
    approvals = []
    while True:
        cursor, keys = await redis_client.scan(cursor, match=f"tenant:{tenant_id}:pending_approvals:*", count=100)
        for key in keys:
            data = await redis_client.get(key)
            if data:
                approvals.append(json.loads(data))
        if cursor == 0:
            break
    return approvals

async def resolve_approval(redis_client: redis.Redis, tenant_id: str, approval_id: str, decision: str):
    # Publish decision to unblock the waiting request
    await redis_client.publish(f"tenant:{tenant_id}:approval_stream:{approval_id}", decision)
    # The waiting coroutine will delete the key, but we can also delete it here just in case
    await redis_client.delete(f"tenant:{tenant_id}:pending_approvals:{approval_id}")
