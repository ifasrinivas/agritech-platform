"""Unit tests for Pydantic schemas (validation, coordinate conversion)."""
import pytest
from pydantic import ValidationError
from app.schemas.field import FieldCreate, Coordinate, GeoJSONPolygon


class TestFieldCreate:
    def test_valid_with_coordinates(self):
        field = FieldCreate(
            farm_id="00000000-0000-0000-0000-000000000001",
            name="Test Field",
            crop="Wheat",
            area=10.5,
            coordinates=[
                Coordinate(latitude=20.007, longitude=73.790),
                Coordinate(latitude=20.007, longitude=73.792),
                Coordinate(latitude=20.005, longitude=73.792),
                Coordinate(latitude=20.005, longitude=73.790),
            ],
        )
        assert field.name == "Test Field"

    def test_valid_with_geojson_boundary(self):
        field = FieldCreate(
            farm_id="00000000-0000-0000-0000-000000000001",
            name="Test Field",
            crop="Wheat",
            area=10.5,
            boundary=GeoJSONPolygon(
                type="Polygon",
                coordinates=[[[73.790, 20.007], [73.792, 20.007], [73.792, 20.005], [73.790, 20.005], [73.790, 20.007]]],
            ),
        )
        assert field.boundary is not None

    def test_fails_without_coordinates_or_boundary(self):
        with pytest.raises(ValidationError):
            FieldCreate(
                farm_id="00000000-0000-0000-0000-000000000001",
                name="Test",
                crop="Wheat",
                area=10,
            )

    def test_to_geojson_from_coordinates(self):
        field = FieldCreate(
            farm_id="00000000-0000-0000-0000-000000000001",
            name="Test",
            crop="Wheat",
            area=10,
            coordinates=[
                Coordinate(latitude=20.007, longitude=73.790),
                Coordinate(latitude=20.007, longitude=73.792),
                Coordinate(latitude=20.005, longitude=73.792),
                Coordinate(latitude=20.005, longitude=73.790),
            ],
        )
        geojson = field.to_geojson_polygon()
        assert geojson["type"] == "Polygon"
        coords = geojson["coordinates"][0]
        assert len(coords) == 5  # 4 points + closed ring
        assert coords[0] == coords[-1]  # ring is closed
        # GeoJSON uses [lon, lat] order
        assert coords[0] == [73.790, 20.007]

    def test_to_geojson_from_boundary(self):
        boundary = GeoJSONPolygon(
            type="Polygon",
            coordinates=[[[73.79, 20.00], [73.80, 20.00], [73.80, 20.01], [73.79, 20.01], [73.79, 20.00]]],
        )
        field = FieldCreate(
            farm_id="00000000-0000-0000-0000-000000000001",
            name="Test",
            crop="Wheat",
            area=10,
            boundary=boundary,
        )
        geojson = field.to_geojson_polygon()
        assert geojson == boundary.model_dump()

    def test_area_must_be_positive(self):
        with pytest.raises(ValidationError):
            FieldCreate(
                farm_id="00000000-0000-0000-0000-000000000001",
                name="Test",
                crop="Wheat",
                area=-5,
                coordinates=[Coordinate(latitude=20, longitude=73)],
            )


class TestCoordinate:
    def test_valid_coordinate(self):
        c = Coordinate(latitude=20.007, longitude=73.790)
        assert c.latitude == 20.007

    def test_latitude_out_of_range(self):
        with pytest.raises(ValidationError):
            Coordinate(latitude=91, longitude=73)

    def test_longitude_out_of_range(self):
        with pytest.raises(ValidationError):
            Coordinate(latitude=20, longitude=181)
