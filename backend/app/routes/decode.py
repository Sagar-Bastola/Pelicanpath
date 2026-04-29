import logging
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services import vision, gemini

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED = {"image/jpeg", "image/png", "image/heic", "image/webp", "image/gif"}


@router.post("/decode")
async def decode(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED:
        raise HTTPException(415, f"Unsupported file type: {file.content_type}")

    image_bytes = await file.read()
    if len(image_bytes) > 10 * 1024 * 1024:
        raise HTTPException(413, "File exceeds 10 MB.")

    try:
        ocr_text = await vision.ocr_image(image_bytes)
    except Exception as e:
        raise HTTPException(502, f"OCR failed: {e}")

    if not ocr_text.strip():
        raise HTTPException(422, "No text detected — upload a clearer photo.")

    try:
        parsed      = await gemini.parse_document(ocr_text)
        explanation = await gemini.explain_document(parsed)
    except Exception as e:
        raise HTTPException(502, f"Parse error: {e}")

    return {
        "document_type":         parsed.get("document_type", "unknown"),
        "student_name":          parsed.get("student_name"),
        "academic_year":         parsed.get("academic_year", ""),
        "line_items":            parsed.get("line_items", []),
        "totals":                parsed.get("totals", {}),
        "deadlines":             parsed.get("deadlines", []),
        "plain_english_summary": explanation,
    }