"""Initial schema - farmers, farms, fields (PostGIS), ndvi_readings, irrigation_alerts

Revision ID: 001
Revises:
Create Date: 2026-04-02
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import geoalchemy2

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS postgis")

    op.create_table(
        "farmers",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(20), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=True),
        sa.Column("email", sa.String(255), nullable=True),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("plan", sa.String(50), server_default="free"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_farmers_phone", "farmers", ["phone"])

    op.create_table(
        "farms",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("farmer_id", sa.Uuid(), sa.ForeignKey("farmers.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("total_area", sa.Float(), nullable=True),
        sa.Column("location_name", sa.String(255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_farms_farmer_id", "farms", ["farmer_id"])

    op.create_table(
        "fields",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("farm_id", sa.Uuid(), sa.ForeignKey("farms.id"), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("crop", sa.String(100), nullable=False),
        sa.Column("area", sa.Float(), nullable=False),
        sa.Column("soil_type", sa.String(100), nullable=True),
        sa.Column("sowing_date", sa.Date(), nullable=True),
        sa.Column("expected_harvest", sa.Date(), nullable=True),
        sa.Column("irrigation_type", sa.String(100), nullable=True),
        sa.Column("boundary", geoalchemy2.Geometry("POLYGON", srid=4326), nullable=False),
        sa.Column("centroid", geoalchemy2.Geometry("POINT", srid=4326), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_fields_farm_id", "fields", ["farm_id"])
    op.create_index("ix_fields_boundary", "fields", ["boundary"], postgresql_using="gist")

    op.create_table(
        "ndvi_readings",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("field_id", sa.Uuid(), sa.ForeignKey("fields.id"), nullable=False),
        sa.Column("ndvi_mean", sa.Float(), nullable=False),
        sa.Column("ndvi_min", sa.Float(), nullable=True),
        sa.Column("ndvi_max", sa.Float(), nullable=True),
        sa.Column("ndvi_std", sa.Float(), nullable=True),
        sa.Column("health_score", sa.Float(), nullable=False),
        sa.Column("health_status", sa.String(20), nullable=False),
        sa.Column("source", sa.String(20), nullable=False),
        sa.Column("satellite_date", sa.Date(), nullable=False),
        sa.Column("cloud_cover", sa.Float(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_ndvi_readings_field_id", "ndvi_readings", ["field_id"])

    op.create_table(
        "irrigation_alerts",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column("field_id", sa.Uuid(), sa.ForeignKey("fields.id"), nullable=False),
        sa.Column("alert_type", sa.String(50), nullable=False),
        sa.Column("severity", sa.String(20), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("action_required", sa.Text(), nullable=False),
        sa.Column("soil_moisture", sa.Float(), nullable=True),
        sa.Column("optimal_moisture", sa.Float(), nullable=True),
        sa.Column("water_required_liters", sa.Float(), nullable=True),
        sa.Column("is_resolved", sa.Boolean(), server_default="false"),
        sa.Column("resolved_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_irrigation_alerts_field_id", "irrigation_alerts", ["field_id"])


def downgrade() -> None:
    op.drop_table("irrigation_alerts")
    op.drop_table("ndvi_readings")
    op.drop_table("fields")
    op.drop_table("farms")
    op.drop_table("farmers")
