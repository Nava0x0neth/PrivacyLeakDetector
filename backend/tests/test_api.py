import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Privacy Leak Detector API is running"}

def test_analyze_invalid_file():
    # Test uploading a file that doesn't end with .apk
    files = {"file": ("test.txt", b"dummy content", "text/plain")}
    response = client.post("/api/analyze", files=files)
    
    assert response.status_code == 400
    assert "Only .apk files are allowed" in response.json()["detail"]
