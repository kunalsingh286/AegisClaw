import pytest
import json
from app.pii_engine import pii_engine
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock
from httpx import Response
from app.main import app

def test_mask_aadhaar():
    payload = {"id_number": "My aadhaar is 2234 5678 9012 and another is 323456789012"}
    masked = pii_engine.mask_json_payload(payload)
    assert masked["id_number"] == "My aadhaar is [REDACTED_AADHAAR] and another is [REDACTED_AADHAAR]"

def test_mask_pan():
    payload = {"pan_card": "My PAN is ABCDE1234F."}
    masked = pii_engine.mask_json_payload(payload)
    assert masked["pan_card"] == "My PAN is [REDACTED_PAN]."

def test_mask_upi():
    payload = {"payment": {"vpa": "john.doe@okicici or maybe jane-doe123@sbi"}}
    masked = pii_engine.mask_json_payload(payload)
    assert masked["payment"]["vpa"] == "[REDACTED_UPI] or maybe [REDACTED_UPI]"

def test_mask_phone():
    payload = [
        {"contact": "+919876543210"},
        {"contact": "09876543210"},
        {"contact": "9876543210"}
    ]
    masked = pii_engine.mask_json_payload(payload)
    assert masked[0]["contact"] == "[REDACTED_PHONE]"
    assert masked[1]["contact"] == "[REDACTED_PHONE]"
    assert masked[2]["contact"] == "[REDACTED_PHONE]"

def test_complex_json():
    payload = {
        "user": {
            "name": "Ravi",
            "ids": ["ABCDE1234F", "2234 5678 9012"],
            "contacts": {
                "phone": "+919999999999",
                "upi": "ravi@ybl"
            },
            "age": 30
        }
    }
    masked = pii_engine.mask_json_payload(payload)
    assert masked["user"]["name"] == "Ravi"
    assert masked["user"]["ids"][0] == "[REDACTED_PAN]"
    assert masked["user"]["ids"][1] == "[REDACTED_AADHAAR]"
    assert masked["user"]["contacts"]["phone"] == "[REDACTED_PHONE]"
    assert masked["user"]["contacts"]["upi"] == "[REDACTED_UPI]"
    assert masked["user"]["age"] == 30

@patch("app.main.generate_audit_record", new_callable=AsyncMock)
@patch("app.main.evaluate_policy", new_callable=AsyncMock)
@patch("httpx.AsyncClient.send", new_callable=AsyncMock)
@patch("redis.asyncio.Redis.publish", new_callable=AsyncMock)
def test_proxy_with_pii(mock_publish, mock_send, mock_eval, mock_audit):
    mock_eval.return_value = True
    mock_send.return_value = Response(200, content=b"ok")
    
    payload = {
        "user_details": "My PAN is ABCDE1234F and phone is +919876543210"
    }
    
    with TestClient(app) as client:
        response = client.post("/proxy/example.com/api", json=payload)
    
    assert response.status_code == 200
    
    call_args, call_kwargs = mock_send.call_args
    req = call_args[0]
    
    body = json.loads(req.read().decode('utf-8'))
    assert body["user_details"] == "My PAN is [REDACTED_PAN] and phone is [REDACTED_PHONE]"
