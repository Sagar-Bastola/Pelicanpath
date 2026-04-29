import logging
from fastapi import APIRouter, HTTPException
from app.models import ScholarRequest
from app.services import gemini

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/scholarships")
async def scholarships(req: ScholarRequest):
    try:
        result = await gemini.scholarship_matches(
            req.major, req.year, req.pell_eligible
        )
        return {"matches": result}
    except Exception as e:
        raise HTTPException(502, str(e))