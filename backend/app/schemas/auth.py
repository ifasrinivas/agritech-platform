from pydantic import BaseModel, Field


class SignupRequest(BaseModel):
    name: str = Field(max_length=255)
    phone: str = Field(max_length=20)
    password: str = Field(min_length=6)
    email: str | None = None
    location: str | None = None


class LoginRequest(BaseModel):
    phone: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    farmer_id: str
    farmer_name: str


class RefreshRequest(BaseModel):
    refresh_token: str
