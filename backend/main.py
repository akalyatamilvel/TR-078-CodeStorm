"""
FastAPI main application.

Endpoints:
  POST /analyze-case   → classify + score a case, store in MongoDB
  GET  /cases          → all cases
  GET  /cases/sorted   → cases sorted by priority_score DESC
  GET  /health         → health check
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import CaseInput, CaseResult
from nlp_pipeline import classify_case
from scoring_engine import compute_priority
from database import insert_case, get_all_cases, get_cases_sorted, case_exists

app = FastAPI(
    title="Court Case Prioritization Engine",
    description="AI-powered judicial case backlog prioritization API",
    version="1.0.0",
)

# Allow all origins for hackathon demo; restrict in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "Court Case Prioritization Engine"}


@app.post("/analyze-case", response_model=CaseResult)
def analyze_case(case: CaseInput):
    """
    Analyze, classify, score, and persist a single court case.
    """
    # 1. NLP Classification
    classification, keywords = classify_case(case.summary, case.ipc_section)

    # 2. Priority Scoring
    priority_score, explanation, flag = compute_priority(
        classification=classification,
        detention_duration=case.detention_duration,
        expected_sentence=case.expected_sentence,
        age=case.age,
        keywords=keywords,
    )

    # 3. Build result
    result = CaseResult(
        case_id=case.case_id,
        summary=case.summary,
        ipc_section=case.ipc_section,
        detention_duration=case.detention_duration,
        expected_sentence=case.expected_sentence,
        age=case.age,
        gender=case.gender,
        classification=classification,
        priority_score=priority_score,
        flag=flag,
        explanation=explanation,
    )

    # 4. Persist (upsert by case_id)
    result_dict = result.model_dump()
    if case_exists(case.case_id):
        # Update existing record
        from database import get_db
        get_db().update_one(
            {"case_id": case.case_id},
            {"$set": result_dict},
        )
    else:
        insert_case(result_dict)

    return result


@app.get("/cases")
def list_cases():
    """Return all cases stored in MongoDB."""
    try:
        cases = get_all_cases()
        return {"total": len(cases), "cases": cases}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/cases/sorted")
def list_cases_sorted():
    """Return all cases sorted by priority_score (highest first)."""
    try:
        cases = get_cases_sorted()
        return {"total": len(cases), "cases": cases}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
def root():
    return {"message": "Court Case API Running"}