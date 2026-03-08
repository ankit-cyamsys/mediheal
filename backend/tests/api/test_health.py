from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Shunya" in response.json().get("message", "") or "API" in response.json().get("message", "")

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json().get("status") == "healthy"
