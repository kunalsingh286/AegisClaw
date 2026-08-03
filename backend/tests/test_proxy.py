import pytest
import json
import asyncio
from fastapi.testclient import TestClient
from httpx import Response
from unittest.mock import patch, AsyncMock

from app.main import app

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
@patch("httpx.AsyncClient.send", new_callable=AsyncMock)
@patch("redis.asyncio.Redis.publish", new_callable=AsyncMock)
def test_proxy_forwarding(mock_publish, mock_send, mock_eval, mock_audit):
    mock_eval.return_value = True
    # Mock target response
    mock_response = Response(200, content=b"streamed_response_chunk")
    mock_send.return_value = mock_response

    headers = {
        "X-Agent-ID": "agent-456",
        "X-Agent-Role": "validator",
        "X-Requested-Amount": "50"
    }
    payload = {"data": "test_payload"}

    with TestClient(app) as client:
        # Perform the request to our proxy endpoint
        response = client.post("/proxy/example.com/api/v1/resource", json=payload, headers=headers)
    
    # Verify proxy response
    assert response.status_code == 200
    assert response.text == "streamed_response_chunk"
    
    # Verify proxy forwarding call
    mock_send.assert_called_once()
    call_args, call_kwargs = mock_send.call_args
    req = call_args[0]
    
    assert str(req.url) == "http://example.com/api/v1/resource"
    assert req.method == "POST"
    
    body = req.read().decode('utf-8')
    assert json.loads(body) == payload

    # Verify telemetry
    mock_publish.assert_called_once()
    pub_args, pub_kwargs = mock_publish.call_args
    assert pub_args[0] == "aegisclaw:telemetry"
    event = json.loads(pub_args[1])
    assert event["agent_id"] == "agent-456"
    assert event["target_host"] == "example.com"
    assert event["status_code"] == 200
    assert "latency_ms" in event
    assert mock_publish.call_count >= 1

@patch("app.main.evaluate_policy", new_callable=AsyncMock)
def test_proxy_invalid_json(mock_eval):
    mock_eval.return_value = True
    with TestClient(app) as client:
        response = client.post("/proxy/example.com/api", content="not-json")
    
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid JSON payload"

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
@patch("httpx.AsyncClient.send", new_callable=AsyncMock)
@patch("redis.asyncio.Redis.publish", new_callable=AsyncMock)
def test_proxy_bad_gateway(mock_publish, mock_send, mock_eval, mock_audit):
    mock_eval.return_value = True
    import httpx
    # Simulate a network error when forwarding
    mock_send.side_effect = httpx.RequestError("Connection failed")

    headers = {"X-Agent-ID": "agent-fail"}
    payload = {"data": "test_payload"}

    with TestClient(app) as client:
        response = client.post("/proxy/down-host.com/api", json=payload, headers=headers)
    
    assert response.status_code == 502
    assert "Bad Gateway" in response.text
    assert mock_publish.call_count >= 1
    pub_args, pub_kwargs = mock_publish.call_args
    event = json.loads(pub_args[1])
    assert event["agent_id"] == "agent-fail"
    assert event["target_host"] == "down-host.com"
    assert event["status_code"] == 502
