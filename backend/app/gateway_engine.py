import redis.asyncio as redis
import time
from typing import Dict, Any, Tuple

class GatewayRouter:
    def __init__(self):
        # Maps generic model names to actual upstream endpoints and models
        self.model_registry = {
            "aegis-gpt-4": {
                "host": "api.openai.com",
                "path": "/v1/chat/completions",
                "real_model": "gpt-4",
                "cost_per_1k_tokens": 0.03
            },
            "aegis-claude-3": {
                "host": "api.anthropic.com",
                "path": "/v1/messages",
                "real_model": "claude-3-opus-20240229",
                "cost_per_1k_tokens": 0.015
            }
        }

    def route_request(self, payload: Dict[str, Any], target_path: str) -> Tuple[str, str, Dict[str, Any]]:
        """
        Intersects the payload to find the requested model.
        Returns (target_host, target_path, modified_payload)
        """
        model = payload.get("model", "")
        
        # If it's a known Aegis gateway model, route it
        if model in self.model_registry:
            route_info = self.model_registry[model]
            payload["model"] = route_info["real_model"]
            return route_info["host"], route_info["path"], payload
            
        # Otherwise, pass through to default/provided path
        # Assuming target_host needs to be parsed from the original request context if not in registry
        # But for proxying, if it's a generic /proxy/v1/chat call, we default to openai if no model specified
        return "api.openai.com", target_path, payload

    async def check_and_record_tokens(self, redis_client: redis.Redis, tenant_id: str, agent_id: str, estimated_tokens: int) -> bool:
        """
        Tracks token usage in Redis. Returns True if within budget, False if budget exceeded.
        Token Budget: 100,000 tokens per day.
        """
        if not redis_client:
            return True
            
        now = time.time()
        window_start = now - 86400
        zset_key = f"tenant:{tenant_id}:agent:tokens:{agent_id}"

        async with redis_client.pipeline(transaction=True) as pipe:
            pipe.zremrangebyscore(zset_key, min="-inf", max=window_start)
            pipe.zrangebyscore(zset_key, min=window_start, max="+inf")
            results = await pipe.execute()
        
        current_members = results[1]
        
        current_total = 0
        for member in current_members:
            try:
                tokens = int(member.split(":")[0])
                current_total += tokens
            except Exception:
                pass
                
        if current_total + estimated_tokens > 100000:
            return False # Budget exceeded
            
        # Record usage
        new_member = f"{estimated_tokens}:{now}"
        await redis_client.zadd(zset_key, {new_member: now})
        
        return True

gateway_router = GatewayRouter()
