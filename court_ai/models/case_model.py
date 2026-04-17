from pydantic import BaseModel

class Case(BaseModel):
    case_id: str
    summary: str
    ipc_section: str
    detention_duration: int
    expected_sentence: int
    age: int
    gender: str