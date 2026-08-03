import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(autouse=True)
def mock_auth():
    with patch("app.main.validate_api_key", return_value=True):
        yield

# Monkeypatch TestClient.post to inject Authorization header
original_post = TestClient.post

def custom_post(self, url, *args, **kwargs):
    headers = kwargs.get("headers", {})
    if headers is None:
        headers = {}
    headers["Authorization"] = "Bearer test_key"
    kwargs["headers"] = headers
    return original_post(self, url, *args, **kwargs)

TestClient.post = custom_post
