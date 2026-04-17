from fastapi import APIRouter
from pydantic import BaseModel

from models.case_model import Case
from services.case_service import (
    analyze_case as analyze_case_old,
    get_all_cases,
    get_sorted_cases
)

from models.model import analyze_case

router = APIRouter()

@router.post("/analyze-case-old")
def analyze_old(case: Case):
    return analyze_case_old(case)


@router.get("/cases")
def get_cases():
    return get_all_cases()


@router.get("/cases/sorted")
def sorted_cases():
    return get_sorted_cases()

class CaseInput(BaseModel):
    summary: str
    detention: int
    expected: int
    age: int
    ipc: str
    case_id: str
    gender: str

@router.post("/analyze-case")
def analyze(data: CaseInput):

    result = analyze_case(
        summary=data.summary,
        detention=data.detention,
        expected=data.expected,
        age=data.age,
        ipc=data.ipc,
        case_id=data.case_id,
        gender=data.gender
    )

    return result