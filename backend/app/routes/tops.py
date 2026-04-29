import logging
from fastapi import APIRouter, HTTPException
from app.models import TOPSRequest
from app.services import gemini

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/tops")
async def tops(req: TOPSRequest):
    try:
        result = await gemini.tops_scenarios(
            req.current_gpa,
            req.credits_completed,
            [c.model_dump() for c in req.current_courses],
            req.tops_type,
        )
        return result
    except Exception as e:
        raise HTTPException(502, str(e))