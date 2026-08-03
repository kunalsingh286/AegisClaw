import pytest
import io
import asyncio
from fastapi.testclient import TestClient
from app.main import app
from app.report_engine import generate_ciso_audit_pdf
from app.hitl_engine import request_human_approval, get_pending_approvals, resolve_approval
from unittest.mock import patch, AsyncMock

client = TestClient(app)

@pytest.mark.asyncio
async def test_pdf_generation():
    mock_redis = AsyncMock()
    mock_redis.get.return_value = "5"
    mock_redis.llen.return_value = 10
    
    with patch("app.audit_engine.verify_audit_chain", new_callable=AsyncMock) as mock_verify:
        mock_verify.return_value = {"chain_valid": True}
        
        pdf_buffer = await generate_ciso_audit_pdf(mock_redis)
        
        assert isinstance(pdf_buffer, io.BytesIO)
        content = pdf_buffer.getvalue()
        assert content.startswith(b"%PDF-1.")

@pytest.mark.asyncio
async def test_hitl_approval_flow():
    mock_redis = AsyncMock()
    
    mock_pubsub = AsyncMock()
    from unittest.mock import MagicMock
    mock_redis.pubsub = MagicMock(return_value=mock_pubsub)
    
    mock_pubsub.get_message.side_effect = [
        None, 
        {"type": "message", "data": b"APPROVED"}
    ]
    
    # We patch time to avoid actually waiting 60s if the loop iterates.
    with patch("asyncio.get_event_loop") as mock_loop:
        mock_loop.return_value.time.side_effect = [0, 1, 2] # advance time
        result = await request_human_approval(mock_redis, "agent_1", 10000, "refund", {"k": "v"})
        assert result == True
    
    # Test Rejection
    mock_pubsub.get_message.side_effect = [
        {"type": "message", "data": b"REJECTED"}
    ]
    with patch("asyncio.get_event_loop") as mock_loop:
        mock_loop.return_value.time.side_effect = [0, 1]
        result2 = await request_human_approval(mock_redis, "agent_1", 10000, "refund", {"k": "v"})
        assert result2 == False

    # Test Timeout
    mock_pubsub.get_message.return_value = None
    with patch("asyncio.get_event_loop") as mock_loop:
        mock_loop.return_value.time.side_effect = [0, 61]
        result3 = await request_human_approval(mock_redis, "agent_1", 10000, "refund", {"k": "v"})
        assert result3 == False

def test_pdf_endpoint():
    with patch("app.main.redis_client", new_callable=AsyncMock) as mock_redis:
        mock_redis.get.return_value = "1"
        with patch("app.main.generate_ciso_audit_pdf", new_callable=AsyncMock) as mock_gen:
            mock_gen.return_value = io.BytesIO(b"%PDF-1.4 fake")
            response = client.get("/admin/reports/pdf")
            assert response.status_code == 200
            assert response.headers["content-type"] == "application/pdf"
