from nlp.preprocess import preprocess_text
from nlp.classifier import classify_case
from utils.scoring import compute_priority
from database.db import collection


def analyze_case(case):
    case_dict = case.dict()

    # NLP Processing
    clean_text = preprocess_text(case.summary)
    classification, class_explain = classify_case(clean_text, case.ipc_section)

    # Priority Score
    score, score_explain = compute_priority(case_dict, classification)

    # Undertrial Detection
    flag = None
    if case.detention_duration > case.expected_sentence:
        flag = "Undertrial exceeds sentence"

    result = {
        **case_dict,
        "classification": classification,
        "priority_score": score,
        "flag": flag,
        "explanation": class_explain + score_explain
    }

    collection.insert_one(result)

    return result


def get_all_cases():
    return list(collection.find({}, {"_id": 0}))


def get_sorted_cases():
    return list(collection.find({}, {"_id": 0}).sort("priority_score", -1))