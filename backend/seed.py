#!/usr/bin/env python3
"""
Database seed script.
Creates sample farmer, farm, fields with real GPS boundaries (Nashik area).
Run: python seed.py
"""
import asyncio
import uuid
from datetime import date

from geoalchemy2.shape import from_shape
from shapely.geometry import Polygon, Point
from sqlalchemy import text

from app.database import engine, async_session, Base
from app.models import Farmer, Farm, Field
from app.services.auth_service import hash_password


async def seed():
    # Create tables
    async with engine.begin() as conn:
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS postgis"))
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        # Check if already seeded
        existing = await db.execute(text("SELECT count(*) FROM farmers"))
        if existing.scalar_one() > 0:
            print("Database already seeded. Skipping.")
            return

        # --- Farmer ---
        farmer = Farmer(
            id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
            name="Rajesh Kumar",
            phone="+919876543210",
            password_hash=hash_password("farmer123"),
            email="rajesh@greenvalleyfarms.com",
            location="Nashik, Maharashtra",
            plan="premium",
        )
        db.add(farmer)

        # --- Farm ---
        farm = Farm(
            id=uuid.UUID("00000000-0000-0000-0000-000000000010"),
            farmer_id=farmer.id,
            name="Green Valley Farms",
            total_area=45.5,
            location_name="Gangapur Road, Nashik",
        )
        db.add(farm)

        # --- Fields (real GPS coordinates around Nashik) ---
        fields_data = [
            {
                "name": "North Block - Wheat",
                "crop": "Wheat",
                "area": 12.5,
                "soil_type": "Black Cotton Soil",
                "sowing_date": date(2025, 11, 15),
                "expected_harvest": date(2026, 4, 20),
                "irrigation_type": "Drip Irrigation",
                "coords": [(73.7900, 20.0070), (73.7920, 20.0070), (73.7920, 20.0055), (73.7900, 20.0055)],
            },
            {
                "name": "South Block - Tomato",
                "crop": "Tomato",
                "area": 8.0,
                "soil_type": "Red Laterite",
                "sowing_date": date(2026, 1, 10),
                "expected_harvest": date(2026, 5, 15),
                "irrigation_type": "Sprinkler",
                "coords": [(73.7885, 20.0050), (73.7905, 20.0050), (73.7905, 20.0035), (73.7885, 20.0035)],
            },
            {
                "name": "East Block - Rice Paddy",
                "crop": "Rice",
                "area": 10.0,
                "soil_type": "Alluvial",
                "sowing_date": date(2026, 2, 1),
                "expected_harvest": date(2026, 6, 30),
                "irrigation_type": "Flood",
                "coords": [(73.7925, 20.0088), (73.7945, 20.0088), (73.7945, 20.0072), (73.7925, 20.0072)],
            },
            {
                "name": "West Orchard - Grapes",
                "crop": "Grapes",
                "area": 6.0,
                "soil_type": "Sandy Loam",
                "sowing_date": date(2025, 8, 1),
                "expected_harvest": date(2026, 3, 15),
                "irrigation_type": "Drip Irrigation",
                "coords": [(73.7860, 20.0065), (73.7880, 20.0065), (73.7880, 20.0050), (73.7860, 20.0050)],
            },
            {
                "name": "Central Block - Onion",
                "crop": "Onion",
                "area": 5.0,
                "soil_type": "Black Cotton Soil",
                "sowing_date": date(2026, 1, 20),
                "expected_harvest": date(2026, 5, 10),
                "irrigation_type": "Furrow",
                "coords": [(73.7905, 20.0065), (73.7915, 20.0065), (73.7915, 20.0055), (73.7905, 20.0055)],
            },
            {
                "name": "Greenhouse - Capsicum",
                "crop": "Capsicum",
                "area": 4.0,
                "soil_type": "Prepared Mix",
                "sowing_date": date(2026, 2, 15),
                "expected_harvest": date(2026, 6, 1),
                "irrigation_type": "Drip Fertigation",
                "coords": [(73.7920, 20.0055), (73.7930, 20.0055), (73.7930, 20.0045), (73.7920, 20.0045)],
            },
        ]

        for i, fd in enumerate(fields_data):
            coords = fd.pop("coords")
            poly = Polygon(coords + [coords[0]])  # close ring
            centroid = poly.centroid

            field = Field(
                id=uuid.UUID(f"00000000-0000-0000-0000-00000000010{i+1}"),
                farm_id=farm.id,
                boundary=from_shape(poly, srid=4326),
                centroid=from_shape(centroid, srid=4326),
                **fd,
            )
            db.add(field)

        await db.commit()
        print(f"Seeded: 1 farmer, 1 farm, {len(fields_data)} fields")
        print(f"Login: phone=+919876543210 password=farmer123")


if __name__ == "__main__":
    asyncio.run(seed())
