from fastapi import APIRouter
from models.case_model import Case
from services.case_service import analyze_case, get_all_cases, get_sorted_cases

router = APIRouter()

@router.post("/analyze-case")
def analyze(case: Case):
    return analyze_case(case)


@router.get("/cases")
def get_cases():
    return get_all_cases()


@router.get("/cases/sorted")
def sorted_cases():
    return get_sorted_cases()