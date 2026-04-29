from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    message: str
    history: Optional[list] = []


class RiskRequest(BaseModel):
    loans: float
    major: str
    year: str


class PlanRequest(BaseModel):
    major: str
    year: str
    loans: float


class Course(BaseModel):
    name: str
    credits: int
    expected_grade: str


class TOPSRequest(BaseModel):
    current_gpa: float
    credits_completed: int
    current_courses: list[Course]
    tops_type: str = "Opportunity"


class ScholarRequest(BaseModel):
    major: str
    year: str
    pell_eligible: bool = False