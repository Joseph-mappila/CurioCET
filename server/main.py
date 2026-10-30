import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.concurrency import run_in_threadpool

load_dotenv(Path(__file__).resolve().parent / ".env")
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

from services.ai_service import (  # noqa: E402
    MOCK_MODE,
    MODEL_NAME,
    AIServiceError,
    generate_description,
)

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO").upper(),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
LOGGER = logging.getLogger("curiocet.api")

MAX_IMAGE_BYTES = 10 * 1024 * 1024
MAX_BRAND_LENGTH = 80

DEFAULT_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]


class GenerateResponse(BaseModel):
    title: str = Field(..., description="Short product title")
    description: str = Field(..., description="Two-paragraph product description")
    benefits: list[str] = Field(..., description="Three to five grounded benefit bullets")


app = FastAPI(
    title="CurioCET Product Description API",
    version="1.0.0",
    description="Turns a product photo and brand name into grounded e-commerce copy.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


def detect_image_mime(data: bytes) -> str | None:
    if data.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if len(data) >= 12 and data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


@app.get("/api/health")
async def health() -> dict:
    return {
        "status": "ok",
        "model": "mock" if MOCK_MODE else MODEL_NAME,
        "mock": MOCK_MODE,
    }


@app.post("/api/generate-description", response_model=GenerateResponse)
async def generate(
    image: UploadFile = File(...),
    brand: str = Form(""),
) -> GenerateResponse:
    brand_clean = " ".join((brand or "").split())
    if not brand_clean:
        raise HTTPException(status_code=422, detail="Enter your brand name to continue.")
    if len(brand_clean) > MAX_BRAND_LENGTH:
        raise HTTPException(
            status_code=422,
            detail=f"Brand name must be {MAX_BRAND_LENGTH} characters or fewer.",
        )

    try:
        data = await image.read(MAX_IMAGE_BYTES + 1)
    finally:
        await image.close()

    if not data:
        raise HTTPException(status_code=400, detail="The uploaded image is empty.")
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=413, detail="Image must be 10 MB or smaller.")

    mime_type = detect_image_mime(data)
    if mime_type is None:
        raise HTTPException(
            status_code=415,
            detail="Unsupported image format. Please upload a JPG, PNG, or WEBP file.",
        )

    LOGGER.info(
        "Generating copy brand=%r mime=%s bytes=%d", brand_clean, mime_type, len(data)
    )

    try:
        result = await run_in_threadpool(
            generate_description, data, mime_type, brand_clean
        )
    except AIServiceError as exc:
        if exc.unavailable:
            status_code = 503
        elif exc.timeout:
            status_code = 504
        else:
            status_code = 502
        LOGGER.warning("AI generation failed (%s): %s", status_code, exc)
        raise HTTPException(status_code=status_code, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 - last-resort guard for the API boundary
        LOGGER.exception("Unexpected error while generating copy")
        raise HTTPException(
            status_code=500,
            detail="Unexpected server error while generating copy. Please try again.",
        ) from exc

    return GenerateResponse(**result)
