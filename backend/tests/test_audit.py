import pytest
import json
from app.audit_engine import generate_audit_record, verify_audit_chain, GENESIS_HASH

class MockRedisAudit:
    def __init__(self):
        self.data = {}
        self.list = []
        
    async def get(self, key):
        return self.data.get(key)
        
    async def set(self, key, val):
        self.data[key] = val
        
    async def rpush(self, key, val):
        self.list.append(val)
        
    async def publish(self, channel, val):
        pass
        
    async def lrange(self, key, start, end):
        return self.list

    class Pipe:
        def __init__(self, m):
            self.m = m
            
        async def __aenter__(self):
            return self
            
        async def __aexit__(self, exc_type, exc, tb):
            pass
            
        def set(self, k, v):
            self.m.data[k] = v
            
        def rpush(self, k, v):
            self.m.list.append(v)
            
        def publish(self, c, v):
            pass
            
        async def execute(self):
            pass
            
    def pipeline(self, transaction=True):
        return self.Pipe(self)

@pytest.mark.asyncio
async def test_sequential_hash_chaining_and_tampering():
    redis_mock = MockRedisAudit()
    
    # Generate 3 records
    await generate_audit_record(redis_mock, "agent_1", "execute_refund", "Allow", 200, {"masked": "data"}, 10.5)
    await generate_audit_record(redis_mock, "agent_2", "execute_wire_transfer", "Deny", 403, {}, 2.1)
    await generate_audit_record(redis_mock, "agent_3", "increase_credit_limit", "Deny", 429, {}, 1.5)
    
    assert len(redis_mock.list) == 3
    
    # 1. Verify clean chain
    result = await verify_audit_chain(redis_mock)
    assert result["chain_valid"] is True
    assert result["total_records"] == 3
    
    # 2. Tamper with the middle record (agent_2)
    tampered_json = json.loads(redis_mock.list[1])
    tampered_json["status_code"] = 200  # Hack attempt to make it look approved
    # Inject it back keeping the old hash
    tampered_json["current_hash"] = tampered_json["current_hash"]
    redis_mock.list[1] = json.dumps(tampered_json)
    
    # 3. Verify tampered chain
    result2 = await verify_audit_chain(redis_mock)
    assert result2["chain_valid"] is False
    assert result2["tampered_at"] == 1
