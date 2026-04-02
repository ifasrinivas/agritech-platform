"""
Prometheus-style metrics endpoint for monitoring.
Lightweight implementation without external dependencies.
"""
import time
from collections import defaultdict
from datetime import datetime

from fastapi import APIRouter, Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

router = APIRouter()

# In-memory counters (for production: use prometheus_client library)
_metrics = {
    "requests_total": defaultdict(int),
    "request_duration_seconds": defaultdict(list),
    "ndvi_analyses_total": 0,
    "ndvi_analyses_errors": 0,
    "active_websockets": 0,
    "startup_time": datetime.utcnow().isoformat(),
}


def increment_ndvi_analyses():
    _metrics["ndvi_analyses_total"] += 1


def increment_ndvi_errors():
    _metrics["ndvi_analyses_errors"] += 1


class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.time()
        response = await call_next(request)
        duration = time.time() - start

        method = request.method
        path = request.url.path
        status = response.status_code

        key = f"{method}_{path}_{status}"
        _metrics["requests_total"][key] += 1
        _metrics["request_duration_seconds"][path].append(duration)

        # Keep only last 1000 durations per path
        if len(_metrics["request_duration_seconds"][path]) > 1000:
            _metrics["request_duration_seconds"][path] = _metrics["request_duration_seconds"][path][-1000:]

        return response


@router.get("/metrics", tags=["Monitoring"])
async def get_metrics():
    """Prometheus-compatible metrics endpoint."""
    # Compute average durations
    avg_durations = {}
    for path, durations in _metrics["request_duration_seconds"].items():
        if durations:
            avg_durations[path] = {
                "avg_ms": round(sum(durations) / len(durations) * 1000, 2),
                "p99_ms": round(sorted(durations)[int(len(durations) * 0.99)] * 1000, 2) if len(durations) > 1 else 0,
                "count": len(durations),
            }

    # Top endpoints by request count
    top_endpoints = sorted(
        _metrics["requests_total"].items(),
        key=lambda x: x[1],
        reverse=True,
    )[:20]

    return {
        "startup_time": _metrics["startup_time"],
        "total_requests": sum(_metrics["requests_total"].values()),
        "ndvi_analyses_total": _metrics["ndvi_analyses_total"],
        "ndvi_analyses_errors": _metrics["ndvi_analyses_errors"],
        "top_endpoints": dict(top_endpoints),
        "latency": avg_durations,
    }


@router.get("/metrics/prometheus", tags=["Monitoring"])
async def prometheus_format():
    """Metrics in Prometheus text format."""
    lines = [
        f'# HELP agritech_requests_total Total HTTP requests',
        f'# TYPE agritech_requests_total counter',
        f'agritech_requests_total {sum(_metrics["requests_total"].values())}',
        f'# HELP agritech_ndvi_total Total NDVI analyses',
        f'# TYPE agritech_ndvi_total counter',
        f'agritech_ndvi_total {_metrics["ndvi_analyses_total"]}',
        f'agritech_ndvi_errors {_metrics["ndvi_analyses_errors"]}',
    ]
    return Response(content="\n".join(lines), media_type="text/plain")
