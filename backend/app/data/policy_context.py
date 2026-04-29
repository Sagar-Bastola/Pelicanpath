SELU_POLICY = """
SELU FINANCIAL AID OFFICE
- Phone: 985-549-2244
- Hours: Monday-Friday 8am-4:30pm
- Location: Student Union Room 2102

TYPES OF AID
- Pell Grant: Free money, max $7,395/year. Need-based, no repayment.
- Louisiana Go Grant: Up to $3,000/year for Pell-eligible Louisiana residents.
- Direct Subsidized Loan: 6.53% interest, govt pays interest while enrolled.
- Direct Unsubsidized Loan: 6.53% interest, accrues from day one.
- IMPORTANT: Students do NOT have to accept the full loan amount offered.
- Work-Study: Part-time campus jobs, average $1,500-$2,500/year.

KEY TERMS
- EFC/SAI: Expected Family Contribution. EFC=0 means maximum need-based aid.
- COA: Cost of Attendance. SELU 2024-25 in-state residential ~$18,240/year.
- SAP: Satisfactory Academic Progress. Must maintain 2.0 GPA and complete 67% of credits.

SAP POLICY
- Minimum 2.0 cumulative GPA (2.5 for Education majors)
- Complete at least 67% of attempted credits
- Cannot exceed 150% of program length
- Appeal: call 985-549-2244

TOPS SCHOLARSHIP
- TOPS Opportunity: maintain 2.3 cumulative GPA + 24 credits/year
- TOPS Performance: maintain 3.0 cumulative GPA + 24 credits/year
- TOPS Tech: maintain 2.0 cumulative GPA + 24 credits/year
- GPA reviewed after SPRING semester each year
- Freshman grace period: TOPS continues through entire freshman year
- F and W grades do NOT count toward the 24 credit requirement
- Summer credits do NOT count toward the 24 credit requirement
- First failure = SUSPENSION (one year to recover, pay tuition yourself)
- Second failure = PERMANENT LOSS
- Reinstatement appeal: LOSFA 1-800-259-5626 within 30 days

EMERGENCY RESOURCES
- Food Pantry: Friendship Center Room 133, Mon-Thu 9am-4pm
- Emergency Fund: Student Affairs 985-549-5283
- Counseling: 985-549-3894

CONTACTS
- SELU Financial Aid: 985-549-2244
- LOSFA State Aid: 1-800-259-5626
- Registrar: 985-549-2066
- mylosfa.la.gov for TOPS information
"""

LA_SALARIES = {
    "elementary education": 38000,
    "secondary education": 40000,
    "nursing": 58000,
    "computer science": 72000,
    "information technology": 65000,
    "business administration": 45000,
    "accounting": 52000,
    "biology": 38000,
    "chemistry": 48000,
    "psychology": 36000,
    "social work": 34000,
    "criminal justice": 38000,
    "communications": 39000,
    "english": 36000,
    "history": 35000,
    "political science": 42000,
    "pre-med": 55000,
    "engineering": 70000,
    "mathematics": 55000,
    "kinesiology": 38000,
    "music": 34000,
    "art": 33000,
    "healthcare administration": 52000,
    "sports management": 40000,
    "undeclared": 38000,
}


def get_salary(major: str) -> int:
    return LA_SALARIES.get(major.strip().lower(), 38000)


def monthly_payment(debt: float, rate: float = 0.065, years: int = 10) -> float:
    if debt <= 0:
        return 0.0
    r = rate / 12
    n = years * 12
    return round(debt * r * (1 + r) ** n / ((1 + r) ** n - 1), 2)


def dti(payment: float, salary: float) -> float:
    if salary <= 0:
        return 100.0
    return round((payment / (salary / 12)) * 100, 1)