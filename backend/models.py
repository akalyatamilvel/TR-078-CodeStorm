from pydantic import BaseModel, Field
from typing import List, Optional


class CaseInput(BaseModel):
    case_id: str
    summary: str
    ipc_section: str
    detention_duration: float  # months
    expected_sentence: float   # months
    age: int
    gender: str  # Male / Female / Other


class CaseResult(BaseModel):
    case_id: str
    summary: str
    ipc_section: str
    detention_duration: float
    expected_sentence: float
    age: int
    gender: str
    classification: str
    priority_score: float
    flag: Optional[str] = None
    explanation: List[str]
