"""Unit tests for auth_service (password hashing + JWT)."""
import pytest
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class TestPasswordHashing:
    def test_hash_and_verify(self):
        password = "test_password_123"
        hashed = hash_password(password)
        assert hashed != password
        assert verify_password(password, hashed)

    def test_wrong_password_fails(self):
        hashed = hash_password("correct_password")
        assert not verify_password("wrong_password", hashed)

    def test_different_hashes_for_same_password(self):
        h1 = hash_password("same_password")
        h2 = hash_password("same_password")
        assert h1 != h2  # bcrypt uses random salt


class TestJWT:
    def test_create_and_decode_access_token(self):
        token = create_access_token("test-farmer-id")
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "test-farmer-id"
        assert payload["type"] == "access"

    def test_create_and_decode_refresh_token(self):
        token = create_refresh_token("test-farmer-id")
        payload = decode_token(token)
        assert payload is not None
        assert payload["sub"] == "test-farmer-id"
        assert payload["type"] == "refresh"

    def test_invalid_token_returns_none(self):
        assert decode_token("invalid.jwt.token") is None

    def test_access_token_has_expiry(self):
        token = create_access_token("farmer-1")
        payload = decode_token(token)
        assert "exp" in payload

    def test_extra_data_in_token(self):
        token = create_access_token("farmer-1", extra={"role": "admin"})
        payload = decode_token(token)
        assert payload["role"] == "admin"
