import logging
from fastapi import APIRouter, HTTPException
from app.models import PlanRequest
from app.services import gemini

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/plan")
async def plan(req: PlanRequest):
    try:
        result = await gemini.action_plan(req.major, req.year, req.loans)
        return result
    except Exception as e:
        raise HTTPException(502, str(e))