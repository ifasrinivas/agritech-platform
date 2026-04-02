"""Unit tests for health_score service."""
import pytest
from app.services.health_score import compute, get_growth_stage, get_expected_range, get_deviation


class TestCompute:
    def test_excellent_at_peak(self):
        score, status = compute(0.85, "Wheat", 80)
        assert score >= 85
        assert status == "excellent"

    def test_good_at_active_growth(self):
        score, status = compute(0.65, "Wheat", 60)
        assert 70 <= score < 100
        assert status in ("good", "excellent")

    def test_poor_when_below_expected(self):
        score, status = compute(0.15, "Wheat", 60)
        assert score < 50
        assert status in ("poor", "critical")

    def test_critical_very_low_ndvi(self):
        score, status = compute(0.05, "Wheat", 80)
        assert score < 30
        assert status == "critical"

    def test_moderate_at_boundary(self):
        score, status = compute(0.50, "Wheat", 60)
        assert 50 <= score < 85
        assert status in ("moderate", "good")

    def test_no_sowing_date_absolute_scoring(self):
        score, status = compute(0.75, "Wheat", None)
        assert score > 70
        assert status in ("good", "excellent")

    def test_no_sowing_date_low_ndvi(self):
        score, status = compute(0.10, "Wheat", None)
        assert score < 30
        assert status in ("poor", "critical")

    def test_score_clamped_0_100(self):
        score, _ = compute(0.0, "Wheat", 80)
        assert 0 <= score <= 100
        score, _ = compute(1.0, "Wheat", 80)
        assert 0 <= score <= 100

    def test_germination_stage(self):
        score, status = compute(0.20, "Wheat", 10)
        assert score >= 60
        assert status in ("moderate", "good", "excellent")

    def test_senescence_stage(self):
        score, status = compute(0.35, "Wheat", 140)
        assert score >= 50
        assert status in ("moderate", "good")


class TestGrowthStage:
    def test_germination(self):
        assert get_growth_stage(5) == "Germination"

    def test_vegetative(self):
        assert get_growth_stage(30) == "Vegetative"

    def test_active_growth(self):
        assert get_growth_stage(60) == "Active Growth"

    def test_peak(self):
        assert get_growth_stage(85) == "Peak/Flowering"

    def test_maturity(self):
        assert get_growth_stage(115) == "Maturity"

    def test_senescence(self):
        assert get_growth_stage(145) == "Senescence"

    def test_none_for_no_date(self):
        assert get_growth_stage(None) is None


class TestExpectedRange:
    def test_returns_range_string(self):
        result = get_expected_range(60)
        assert result is not None
        assert "-" in result

    def test_none_for_no_date(self):
        assert get_expected_range(None) is None


class TestDeviation:
    def test_within_range(self):
        result = get_deviation(0.65, 60)
        assert "Within expected" in result

    def test_below_range(self):
        result = get_deviation(0.20, 60)
        assert "below" in result

    def test_above_range(self):
        result = get_deviation(0.95, 60)
        assert "above" in result

    def test_no_sowing_date(self):
        result = get_deviation(0.50, None)
        assert "not available" in result
