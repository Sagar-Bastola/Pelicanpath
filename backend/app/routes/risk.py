import logging
from fastapi import APIRouter, HTTPException
from app.models import RiskRequest
from app.services import gemini
from app.data.policy_context import get_salary, monthly_payment, dti

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/risk")
async def risk(req: RiskRequest):
    salary  = get_salary(req.major)
    payment = monthly_payment(req.loans)
    dti_pct = dti(payment, salary)
    try:
        result = await gemini.risk_score(
            req.loans, req.major, salary, payment, dti_pct
        )
        return {
            **result,
            "monthly_payment": payment,
            "dti":             dti_pct,
            "salary":          salary,
        }
    except Exception as e:
        raise HTTPException(502, str(e))