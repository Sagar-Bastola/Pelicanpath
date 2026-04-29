import logging
from fastapi import APIRouter, HTTPException
from app.models import ChatRequest
from app.services import gemini

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/chat")
async def chat(req: ChatRequest):
    try:
        response = await gemini.chat_response(req.message, req.history or [])
        return {"response": response}
    except Exception as e:
        raise HTTPException(502, str(e))