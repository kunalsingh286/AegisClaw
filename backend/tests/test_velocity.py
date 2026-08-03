import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from app.main import app
from fastapi import HTTPException
from app.state_engine import check_and_record_spend, is_killswitch_active, toggle_killswitch

client = TestClient(app)

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.is_killswitch_active", new_callable=AsyncMock)
def test_killswitch_active(mock_killswitch, mock_audit):
    mock_killswitch.return_value = True
    
    with TestClient(app) as c:
        response = c.post("/proxy/example.com/api", json={})
        
    assert response.status_code == 403
    assert response.json()["detail"]["error"] == "FLEET EMERGENCY STOP ENGAGED: Execution Halted"

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.is_killswitch_active", new_callable=AsyncMock)
@patch("app.main.check_and_record_spend", new_callable=AsyncMock)
def test_velocity_single_transaction_limit(mock_check_spend, mock_killswitch, mock_audit):
    mock_killswitch.return_value = False
    mock_check_spend.side_effect = HTTPException(
        status_code=429, 
        detail={"error": "Single Transaction Limit Exceeded: Maximum \u20b95,000 allowed"}
    )
    
    headers = {"X-Requested-Amount": "6000", "X-Agent-ID": "agent1"}
    with TestClient(app) as c:
        response = c.post("/proxy/example.com/api", json={}, headers=headers)
        
    assert response.status_code == 429
    assert response.json()["detail"]["error"] == "Single Transaction Limit Exceeded: Maximum \u20b95,000 allowed"

@pytest.mark.asyncio
async def test_state_engine_killswitch():
    mock_redis = AsyncMock()
    mock_redis.get.return_value = "True"
    assert await is_killswitch_active(mock_redis) is True

    mock_redis.get.return_value = "False"
    assert await is_killswitch_active(mock_redis) is False

    await toggle_killswitch(mock_redis, True)
    mock_redis.set.assert_called_with("fleet_killswitch", "True")

@pytest.mark.asyncio
async def test_state_engine_spend():
    from unittest.mock import MagicMock
    mock_redis = AsyncMock()
    mock_pipe = AsyncMock()
    mock_pipe.__aenter__.return_value = mock_pipe
    mock_pipe.__aexit__.return_value = None
    mock_redis.pipeline = MagicMock(return_value=mock_pipe)

    # Single limit > 25000
    with pytest.raises(HTTPException) as excinfo:
        await check_and_record_spend(mock_redis, "agent_1", 25001.0)
    assert excinfo.value.status_code == 429

    # Sliding window < 50000
    mock_pipe.execute.return_value = [None, ["45000:some_uuid"]]
    await check_and_record_spend(mock_redis, "agent_1", 4000.0)
    mock_redis.zadd.assert_called_once()
    assert mock_pipe.zremrangebyscore.called
    assert mock_pipe.zrangebyscore.called

    # Sliding window > 50000
    mock_pipe.execute.return_value = [None, ["48000:uuid1"]]
    with pytest.raises(HTTPException) as excinfo:
        await check_and_record_spend(mock_redis, "agent_1", 3000.0)
    assert excinfo.value.status_code == 429
    assert "Daily Aggregate Budget Exceeded" in str(excinfo.value.detail)
