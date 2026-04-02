from pydantic import BaseModel


class HealthCheckResponse(BaseModel):
    status: str
    database: str
    gee_configured: bool
    version: str
