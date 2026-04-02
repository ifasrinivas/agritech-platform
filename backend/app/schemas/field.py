import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field, model_validator


class Coordinate(BaseModel):
    """Frontend-compatible coordinate format (matches data/agritech.ts Field.coordinates)."""
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class GeoJSONPolygon(BaseModel):
    """Standard GeoJSON Polygon geometry."""
    type: Literal["Polygon"] = "Polygon"
    coordinates: list[list[list[float]]]  # [[[lon, lat], ...]]


class FieldCreate(BaseModel):
    farm_id: uuid.UUID
    name: str = Field(max_length=255)
    crop: str = Field(max_length=100)
    area: float = Field(gt=0)
    soil_type: str | None = None
    sowing_date: date | None = None
    expected_harvest: date | None = None
    irrigation_type: str | None = None

    # Accept EITHER frontend format OR standard GeoJSON
    coordinates: list[Coordinate] | None = None
    boundary: GeoJSONPolygon | None = None

    @model_validator(mode="after")
    def require_boundary(self) -> "FieldCreate":
        if not self.coordinates and not self.boundary:
            raise ValueError("Either 'coordinates' or 'boundary' must be provided")
        return self

    def to_geojson_polygon(self) -> dict:
        """Convert whichever input format was provided to GeoJSON dict."""
        if self.boundary:
            return self.boundary.model_dump()

        # Convert frontend {latitude, longitude}[] to GeoJSON [lon, lat][]
        ring = [[c.longitude, c.latitude] for c in self.coordinates]  # type: ignore[union-attr]
        # Close the ring if not already closed
        if ring[0] != ring[-1]:
            ring.append(ring[0])
        return {"type": "Polygon", "coordinates": [ring]}


class FieldUpdate(BaseModel):
    name: str | None = None
    crop: str | None = None
    area: float | None = None
    soil_type: str | None = None
    sowing_date: date | None = None
    expected_harvest: date | None = None
    irrigation_type: str | None = None
    coordinates: list[Coordinate] | None = None
    boundary: GeoJSONPolygon | None = None


class FieldResponse(BaseModel):
    id: uuid.UUID
    farm_id: uuid.UUID
    name: str
    crop: str
    area: float
    soil_type: str | None
    sowing_date: date | None
    expected_harvest: date | None
    irrigation_type: str | None
    boundary: GeoJSONPolygon | None = None
    centroid: Coordinate | None = None
    latest_ndvi: float | None = None
    health_status: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
