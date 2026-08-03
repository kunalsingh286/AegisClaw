import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from httpx import Response
from app.main import app

client = TestClient(app)

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.check_and_record_spend", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
@patch("httpx.AsyncClient.send", new_callable=AsyncMock)
@patch("redis.asyncio.Redis.publish", new_callable=AsyncMock)
def test_valid_refund_under_5000(mock_publish, mock_send, mock_eval, mock_spend, mock_audit):
    # Mock evaluate_policy instead of http client for cleaner tests
    mock_eval.return_value = True
    mock_send.return_value = Response(200, content=b"refund successful")
    mock_spend.return_value = False

    headers = {
        "X-Agent-Role": "customer_servicing_bot",
        "X-Requested-Amount": "4000"
    }
    
    with TestClient(app) as c:
        response = c.post("/proxy/example.com/api/v1/payments/refund", json={}, headers=headers)
        
    assert response.status_code == 200
    assert response.text == "refund successful"

    # Verify evaluate_policy arguments
    mock_eval.assert_called_once()
    kwargs = mock_eval.call_args.kwargs
    assert kwargs["principal"] == "customer_servicing_bot"
    assert kwargs["requested_amount"] == 4000
    assert kwargs["action"] == "execute_refund"

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.check_and_record_spend", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
def test_over_budget_refund_above_5000(mock_eval, mock_spend, mock_audit):
    mock_eval.return_value = False
    mock_spend.return_value = False

    headers = {
        "X-Agent-Role": "customer_servicing_bot",
        "X-Requested-Amount": "6000"
    }
    
    with TestClient(app) as c:
        response = c.post("/proxy/example.com/api/v1/payments/refund", json={}, headers=headers)
        
    assert response.status_code == 403
    assert response.json()["detail"]["error"] == "RBI Policy Scope Violation: Action Not Authorized"

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.check_and_record_spend", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
def test_unauthorized_endpoint_call(mock_eval, mock_spend, mock_audit):
    mock_eval.return_value = False
    mock_spend.return_value = False

    headers = {
        "X-Agent-Role": "customer_servicing_bot",
        "X-Requested-Amount": "1000"
    }
    
    with TestClient(app) as c:
        response = c.post("/proxy/example.com/api/v1/wire/transfer", json={}, headers=headers)
        
    assert response.status_code == 403
    assert response.json()["detail"]["error"] == "RBI Policy Scope Violation: Action Not Authorized"

# Also test the actual policy_engine directly
@patch("httpx.AsyncClient.post", new_callable=AsyncMock)
@pytest.mark.asyncio
async def test_policy_engine_allow(mock_post):
    mock_post.return_value = Response(200, json={"decision": "Allow"})
    from app.policy_engine import evaluate_policy
    import httpx
    async with httpx.AsyncClient() as c:
        res = await evaluate_policy(c, "customer_servicing_bot", "execute_refund", "/api/v1/payments/refund", 4000)
        assert res is True
        
        # Verify Cedar payload
        call_args, call_kwargs = mock_post.call_args
        assert call_kwargs["json"]["context"]["requested_amount"] == 4000
        assert call_kwargs["json"]["action"] == 'Action::"execute_refund"'
