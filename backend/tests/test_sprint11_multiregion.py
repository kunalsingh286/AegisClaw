import pytest
from app.pii_engine import pii_engine
from httpx import Response
from unittest.mock import patch, AsyncMock

def test_pii_engine_in_region():
    payload = {"aadhaar": "2234 5678 9012", "pan": "ABCDE1234F"}
    masked = pii_engine.mask_json_payload(payload, region="IN")
    assert masked["aadhaar"] == "[REDACTED_AADHAAR]"
    assert masked["pan"] == "[REDACTED_PAN]"

def test_pii_engine_us_region():
    payload = {"ssn": "123-45-6789", "cc": "4111222233334444", "patient": "medical record: John"}
    masked = pii_engine.mask_json_payload(payload, region="US")
    assert masked["ssn"] == "[REDACTED_US_SSN]"
    assert masked["cc"] == "[REDACTED_CREDIT_CARD]"
    assert masked["patient"] == "[REDACTED_PHI]"

def test_pii_engine_eu_region():
    payload = {"iban": "DE89370400440532013000", "ip": "192.168.1.1"}
    masked = pii_engine.mask_json_payload(payload, region="EU")
    assert masked["iban"] == "[REDACTED_IBAN]"
    assert masked["ip"] == "[REDACTED_IP_ADDRESS]"

@pytest.mark.asyncio
@patch("httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_cedar_policy_us_hipaa_nist(mock_post):
    from app.policy_engine import _evaluate_policy_internal
    import httpx
    
    dummy_req = httpx.Request("POST", "http://test")
    # DB Export should be denied for analytics_bot
    mock_post.return_value = Response(200, json={"decision": "Deny"}, request=dummy_req)
    async with httpx.AsyncClient() as client:
        allowed = await _evaluate_policy_internal(
            client, 
            principal="analytics_bot", 
            action="database_deletion", 
            resource="/api/v1/db/delete", 
            requested_amount=0, 
            tenant_id="test_tenant", 
            region="US"
        )
        assert not allowed

    # DB Export should be allowed for admin
    mock_post.return_value = Response(200, json={"decision": "Allow"}, request=dummy_req)
    async with httpx.AsyncClient() as client:
        allowed_admin = await _evaluate_policy_internal(
            client, 
            principal="admin", 
            action="database_deletion", 
            resource="/api/v1/db/delete", 
            requested_amount=0, 
            tenant_id="test_tenant", 
            region="US"
        )
        assert allowed_admin

@pytest.mark.asyncio
@patch("httpx.AsyncClient.post", new_callable=AsyncMock)
async def test_cedar_policy_eu_ai_act(mock_post):
    from app.policy_engine import _evaluate_policy_internal
    import httpx
    
    dummy_req = httpx.Request("POST", "http://test")
    # > 10000 should be denied (force HITL)
    mock_post.return_value = Response(200, json={"decision": "Deny"}, request=dummy_req)
    async with httpx.AsyncClient() as client:
        allowed = await _evaluate_policy_internal(
            client, 
            principal="finance_bot", 
            action="execute_wire_transfer", 
            resource="/api/v1/wire/transfer", 
            requested_amount=15000, 
            tenant_id="test_tenant", 
            region="EU"
        )
        assert not allowed

    # <= 10000 should be allowed
    mock_post.return_value = Response(200, json={"decision": "Allow"}, request=dummy_req)
    async with httpx.AsyncClient() as client:
        allowed_small = await _evaluate_policy_internal(
            client, 
            principal="finance_bot", 
            action="execute_wire_transfer", 
            resource="/api/v1/wire/transfer", 
            requested_amount=5000, 
            tenant_id="test_tenant", 
            region="EU"
        )
        assert allowed_small
