import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Academic Performance Assessment Platform API"}

def test_get_students():
    response = client.get("/students?limit=1")
    assert response.status_code == 200
    # Assuming there's at least one student or it returns empty list
    assert isinstance(response.json(), list)

def test_get_courses():
    response = client.get("/courses?limit=1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
