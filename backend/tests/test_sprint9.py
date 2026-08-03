import pytest
from httpx import AsyncClient
import os
from unittest.mock import patch, AsyncMock
from app.main import app
from app.circuit_breaker import CircuitBreaker, cedar_cb

@pytest.mark.asyncio
async def test_db_init_and_key_generation():
    # Verify the local db fallback works
    from app.db import init_db, generate_api_key, validate_api_key
    await init_db()
    
    key_info = await generate_api_key("Test Key")
    assert "api_key" in key_info
    
    is_valid = await validate_api_key(key_info["api_key"])
    assert is_valid is True

@pytest.mark.asyncio
async def test_multi_tenant_policy_resolution():
    from app.policy_engine import _evaluate_policy_internal
    import httpx
    
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {"decision": "Allow"}
        
        # Test default tenant fallback
        res = await _evaluate_policy_internal(httpx.AsyncClient(), "customer_servicing_bot", "execute_refund", "/api/v1/payments/refund", 1000, "non_existent_tenant")
        
        # Verify the payload sent to Cedar contains the policy content
        args, kwargs = mock_post.call_args
        assert "policies" in kwargs["json"]
        # default_tenant.cedar should forbid increase_credit_limit
        assert "increase_credit_limit" in kwargs["json"]["policies"]
        assert res is True

@pytest.mark.asyncio
async def test_circuit_breaker_fail_closed():
    # Reset circuit breaker
    cedar_cb.failure_count = 0
    cedar_cb.is_open = False
    
    async def failing_func():
        raise Exception("Cedar is down!")
        
    for _ in range(cedar_cb.failure_threshold):
        res = await cedar_cb.call(failing_func)
        assert res is False
        
    assert cedar_cb.is_open is True
    
    # Next call should fail fast and return False (since FAIL_CLOSED by default)
    res = await cedar_cb.call(failing_func)
    assert res is False
