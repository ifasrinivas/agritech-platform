"""
Integration tests for API endpoints.
Tests the full request->response cycle using FastAPI TestClient.
Requires: pip install httpx pytest-asyncio
Note: These tests use the app directly (no database).
"""
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


class TestHealthCheck:
    def test_health_endpoint_exists(self):
        resp = client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert "status" in data
        assert "version" in data
        assert "gee_configured" in data

    def test_health_returns_version(self):
        resp = client.get("/health")
        assert resp.json()["version"] == "0.1.0"


class TestAuthEndpoints:
    def test_signup_requires_fields(self):
        resp = client.post("/api/v1/auth/signup", json={})
        assert resp.status_code == 422

    def test_signup_validates_password_length(self):
        resp = client.post("/api/v1/auth/signup", json={
            "name": "Test",
            "phone": "+91111",
            "password": "12345",  # too short (min 6)
        })
        assert resp.status_code == 422

    def test_login_requires_fields(self):
        resp = client.post("/api/v1/auth/login", json={})
        assert resp.status_code == 422

    def test_login_invalid_credentials(self):
        # Will fail because no DB, but should return 401 or 500, not crash
        resp = client.post("/api/v1/auth/login", json={
            "phone": "+910000000000",
            "password": "wrongpass",
        })
        assert resp.status_code in (401, 500)


class TestFieldEndpoints:
    def test_create_field_requires_boundary(self):
        resp = client.post("/api/v1/fields", json={
            "farm_id": "00000000-0000-0000-0000-000000000010",
            "name": "Test",
            "crop": "Wheat",
            "area": 10,
            # No coordinates or boundary
        })
        assert resp.status_code == 422

    def test_create_field_validates_area(self):
        resp = client.post("/api/v1/fields", json={
            "farm_id": "00000000-0000-0000-0000-000000000010",
            "name": "Test",
            "crop": "Wheat",
            "area": -5,
            "coordinates": [
                {"latitude": 20.007, "longitude": 73.790},
                {"latitude": 20.007, "longitude": 73.792},
                {"latitude": 20.005, "longitude": 73.792},
            ],
        })
        assert resp.status_code == 422

    def test_ndvi_analyze_validates_boundary(self):
        resp = client.post("/api/v1/ndvi/analyze", json={
            "crop": "Wheat",
        })
        assert resp.status_code == 422


class TestNDVIAnalyze:
    def test_analyze_polygon_accepts_geojson(self):
        # This will attempt to fetch real satellite data
        # In CI without network, it will use the seasonal estimate fallback
        resp = client.post("/api/v1/ndvi/analyze", json={
            "boundary": {
                "type": "Polygon",
                "coordinates": [
                    [[73.790, 20.007], [73.792, 20.007], [73.792, 20.005], [73.790, 20.005], [73.790, 20.007]]
                ],
            },
            "crop": "Wheat",
            "sowing_date": "2025-11-15",
        })
        # Should succeed (uses fallback if no network)
        assert resp.status_code == 200
        data = resp.json()
        assert "ndvi_mean" in data
        assert "health_score" in data
        assert "health_status" in data
        assert data["health_status"] in ("excellent", "good", "moderate", "poor", "critical")
        assert 0 <= data["ndvi_mean"] <= 1
        assert 0 <= data["health_score"] <= 100
        assert data["crop"] == "Wheat"

    def test_analyze_returns_growth_stage(self):
        resp = client.post("/api/v1/ndvi/analyze", json={
            "boundary": {
                "type": "Polygon",
                "coordinates": [
                    [[73.790, 20.007], [73.792, 20.007], [73.792, 20.005], [73.790, 20.005], [73.790, 20.007]]
                ],
            },
            "crop": "Tomato",
            "sowing_date": "2026-01-10",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data["growth_stage"] is not None
        assert data["days_after_sowing"] is not None


class TestOpenAPISchema:
    def test_openapi_json_available(self):
        resp = client.get("/openapi.json")
        assert resp.status_code == 200
        schema = resp.json()
        assert schema["info"]["title"] == "AgriTech Backend"
        assert "/api/v1/auth/signup" in schema["paths"]
        assert "/api/v1/fields" in schema["paths"]
        assert "/api/v1/ndvi/analyze" in schema["paths"]

    def test_docs_page_available(self):
        resp = client.get("/docs")
        assert resp.status_code == 200
