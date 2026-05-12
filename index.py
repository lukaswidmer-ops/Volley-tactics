"""
ASGI-App für Uvicorn: statische Dateien aus dem Projektroot.
Aufruf:  python -m uvicorn index:app --reload --host 127.0.0.1 --port 8000
Keine Extra-Pakete nötig (nur uvicorn).
"""
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent

MIME = {
    ".html": b"text/html; charset=utf-8",
    ".js": b"application/javascript; charset=utf-8",
    ".mjs": b"application/javascript; charset=utf-8",
    ".css": b"text/css; charset=utf-8",
    ".json": b"application/json",
    ".png": b"image/png",
    ".jpg": b"image/jpeg",
    ".jpeg": b"image/jpeg",
    ".gif": b"image/gif",
    ".webp": b"image/webp",
    ".svg": b"image/svg+xml",
    ".ico": b"image/x-icon",
    ".woff2": b"font/woff2",
    ".woff": b"font/woff",
    ".pdf": b"application/pdf",
    ".map": b"application/json",
    ".txt": b"text/plain; charset=utf-8",
}


def _safe_path(rel: str) -> Optional[Path]:
    if not rel or rel.startswith("/") or ".." in rel.split("/"):
        return None
    full = (ROOT / rel).resolve()
    try:
        full.relative_to(ROOT)
    except ValueError:
        return None
    return full if full.is_file() else None


async def app(scope, receive, send):
    if scope["type"] != "http":
        return

    raw_path = scope.get("path", "/")
    path = raw_path.split("?", 1)[0].lstrip("/")
    if path == "" or path == "/":
        path = "game.html"

    full = _safe_path(path)
    if full is None:
        await send(
            {
                "type": "http.response.start",
                "status": 404,
                "headers": [(b"content-type", b"text/plain; charset=utf-8")],
            }
        )
        await send({"type": "http.response.body", "body": b"Not found"})
        return

    ctype = MIME.get(full.suffix.lower(), b"application/octet-stream")
    body = full.read_bytes()
    await send(
        {
            "type": "http.response.start",
            "status": 200,
            "headers": [(b"content-type", ctype)],
        }
    )
    await send({"type": "http.response.body", "body": body})
