import logging
from google.cloud import vision
from google.cloud.vision_v1 import types

logger = logging.getLogger(__name__)
_client = None


def get_client():
    global _client
    if _client is None:
        _client = vision.ImageAnnotatorClient()
    return _client


async def ocr_image(image_bytes: bytes) -> str:
    image = types.Image(content=image_bytes)
    response = get_client().document_text_detection(image=image)
    if response.error.message:
        raise RuntimeError(f"Vision API error: {response.error.message}")
    text = response.full_text_annotation.text
    logger.info(f"Vision OCR: {len(text)} chars extracted")
    return text