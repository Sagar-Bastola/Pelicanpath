import json
import re
import logging
import google.generativeai as genai
from app.config import get_settings
from app.data.policy_context import SELU_POLICY

logger = logging.getLogger(__name__)
genai.configure(api_key=get_settings().gemini_api_key)

PRO   = "gemini-1.5-pro-latest"
FLASH = "gemini-1.5-flash-latest"


def clean(text: str) -> str:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    return text.strip()


async def parse_document(ocr_text: str) -> dict:
    model = genai.GenerativeModel(PRO)
    prompt = f"""You are a financial document parser. Extract ALL data from this OCR text into valid JSON.
Return ONLY valid JSON, no prose, no markdown fences.

Schema:
{{
  "document_type": "award_letter|loan_statement|tops_notice|other",
  "student_name": "string or null",
  "academic_year": "string",
  "line_items": [
    {{
      "label": "exact text from document",
      "category": "grant|scholarship|loan_subsidized|loan_unsubsidized|work_study|tops|fee|other",
      "amount_usd": number,
      "period": "semester|annual|one_time",
      "notes": "string or null"
    }}
  ],
  "totals": {{
    "cost_of_attendance": number or null,
    "total_aid": number or null,
    "expected_family_contribution": number or null,
    "net_cost": number or null
  }},
  "deadlines": [{{"date": "string or null", "action": "string"}}]
}}

OCR TEXT:
---
{ocr_text}
---"""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", temperature=0.0
        ),
    )
    return json.loads(clean(resp.text))


async def explain_document(parsed: dict) -> str:
    model = genai.GenerativeModel(FLASH)
    prompt = f"""You are PelicanPath, a warm financial guide for SELU first-generation students.

SELU Policy Context:
{SELU_POLICY}

Parsed document:
{json.dumps(parsed, indent=2)}

Write a 3-4 sentence plain-English summary of this document.
Flag any loans with a warning emoji.
End with one concrete action the student should take today.
Define any financial jargon like EFC, COA, or unsubsidized if they appear."""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(temperature=0.3),
    )
    return resp.text


async def chat_response(message: str, history: list) -> str:
    model = genai.GenerativeModel(
        FLASH,
        system_instruction=f"""You are PelicanPath, a financial literacy mentor for SELU students.
Speak like a knowledgeable older sibling — warm, direct, never like a government pamphlet.

SELU and Louisiana policy context:
{SELU_POLICY}

Rules:
1. Ground every policy answer in the context above.
2. If not covered, say: call SELU Financial Aid at 985-549-2244.
3. Define jargon — EFC, COA, SAP, TOPS, subsidized, unsubsidized.
4. Cite specific offices and phone numbers when relevant.
5. End complex answers with one clear next step.""",
    )
    gemini_history = [
        {"role": m["role"], "parts": [m["content"]]} for m in history
    ]
    chat = model.start_chat(history=gemini_history)
    resp = await chat.send_message_async(message)
    return resp.text


async def risk_score(
    loans: float, major: str, salary: int, payment: float, dti_pct: float
) -> dict:
    model = genai.GenerativeModel(FLASH)
    prompt = f"""You are a financial advisor for Louisiana first-generation college students.
Return ONLY valid JSON — no prose, no fences.

Student profile:
- Major: {major}
- Louisiana starting salary for {major}: ${salary:,}/year
- Total loan debt: ${loans:,.0f}
- Monthly payment (10-yr plan): ${payment:,.0f}
- Debt-to-income ratio: {dti_pct}%

Scoring: 1-3 low, 4-6 moderate, 7-8 high, 9-10 critical

Return this exact JSON:
{{
  "score": integer 1-10,
  "tier": "low|moderate|high|critical",
  "summary": "one warm sentence",
  "explanation": "2-3 sentences using the real numbers above",
  "actions": ["specific action 1", "specific action 2", "specific action 3"]
}}"""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", temperature=0.1
        ),
    )
    return json.loads(clean(resp.text))


async def action_plan(major: str, year: str, loans: float) -> dict:
    model = genai.GenerativeModel(PRO)
    prompt = f"""Generate a 12-week financial action plan for a SELU first-generation student.
Student: {year}, majoring in {major}, total loan debt ${loans:,.0f}

SELU contacts to include:
- Financial Aid: 985-549-2244
- LOSFA: 1-800-259-5626
- southeastern.edu/admin/fin_aid/

Return ONLY valid JSON:
{{
  "weeks": [
    {{
      "week_number": integer,
      "theme": "short theme name",
      "tasks": [
        {{
          "title": "task title",
          "description": "one sentence what to do",
          "resource": "phone number, URL, or office name",
          "minutes": integer
        }}
      ]
    }}
  ]
}}

Each week should have 1-3 concrete specific tasks."""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", temperature=0.4
        ),
    )
    return json.loads(clean(resp.text))


async def tops_scenarios(
    gpa: float, credits: int, courses: list, tops_type: str
) -> dict:
    model = genai.GenerativeModel(FLASH)
    prompt = f"""You are a Louisiana TOPS scholarship policy expert.

Grade points: A=4.0, B=3.0, C=2.0, D=1.0, F=0.0, W=0.0
TOPS Opportunity: need 2.3 cumulative GPA + 24 credits/year
TOPS Performance: need 3.0 cumulative GPA + 24 credits/year
TOPS Tech: need 2.0 cumulative GPA + 24 credits/year

Student:
- Current cumulative GPA: {gpa}
- Credits completed: {credits}
- TOPS type: {tops_type}
- Current courses: {json.dumps(courses)}

Calculate three scenarios:
1. All courses pass at expected grades
2. Fail the course with the most credits (grade becomes F)
3. Withdraw from the course with the most credits (grade becomes W)

Return ONLY valid JSON:
{{
  "scenarios": [
    {{
      "label": "scenario name",
      "new_gpa": float rounded to 2 decimals,
      "status": "safe|warning|at_risk|lost",
      "explanation": "one sentence",
      "action": "one concrete next step"
    }}
  ],
  "policy_note": "one sentence citing the relevant TOPS rule"
}}"""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", temperature=0.0
        ),
    )
    return json.loads(clean(resp.text))


async def scholarship_matches(major: str, year: str, pell: bool) -> list:
    model = genai.GenerativeModel(FLASH)
    prompt = f"""List 5 real Louisiana scholarships for this student.
Student: {year}, {major} major, Pell eligible: {pell}

Return ONLY valid JSON array:
[
  {{
    "name": "scholarship name",
    "amount": "dollar amount or range",
    "eligibility": "2-sentence eligibility summary",
    "why_match": "one sentence why this fits the student",
    "url": "real apply URL",
    "deadline": "deadline or null"
  }}
]"""
    resp = await model.generate_content_async(
        prompt,
        generation_config=genai.GenerationConfig(
            response_mime_type="application/json", temperature=0.2
        ),
    )
    return json.loads(clean(resp.text))