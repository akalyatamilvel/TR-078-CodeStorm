"""
NLP Pipeline: TF-IDF + Logistic Regression with rule-based fallback.
Classifies cases into: Bail Eligible, Fast Track, Civil, Criminal (Minor), Criminal (Major)
"""
import re
import string
from typing import Tuple, List

# ---------------------------------------------------------------------------
# Simple stop-words list (no NLTK download required for hackathon portability)
# ---------------------------------------------------------------------------
STOP_WORDS = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "is", "was", "are", "were", "be", "been",
    "being", "have", "has", "had", "do", "does", "did", "will", "would",
    "could", "should", "may", "might", "shall", "can", "this", "that",
    "these", "those", "it", "its", "he", "she", "they", "we", "you", "i",
    "me", "him", "her", "us", "them", "my", "your", "his", "our", "their",
    "not", "no", "nor", "so", "yet", "both", "either", "neither", "each",
    "such", "than", "too", "very", "just", "over", "under", "again",
    "then", "once", "only", "same", "more", "most", "other", "into",
}

# ---------------------------------------------------------------------------
# Keyword dictionaries for urgency and crime severity
# ---------------------------------------------------------------------------
URGENCY_KEYWORDS = {
    "urgent", "immediate", "critical", "emergency", "life-threatening",
    "health", "medical", "terminal", "disability", "handicap", "minor",
    "child", "juvenile", "elderly", "senior", "pregnant", "mental",
    "harassment", "domestic", "violence", "abuse", "rape", "murder",
    "assault", "kidnap", "threat", "extortion", "death", "dying",
}

MAJOR_CRIME_KEYWORDS = {
    "murder", "rape", "terrorism", "kidnapping", "extortion", "robbery",
    "arson", "trafficking", "homicide", "dacoity", "riot", "sedition",
    "attempt to murder", "grievous hurt", "organized crime",
}

MINOR_CRIME_KEYWORDS = {
    "theft", "cheating", "fraud", "forgery", "defamation", "trespass",
    "mischief", "gambling", "drunk", "disorderly", "bribery", "petty",
}

CIVIL_KEYWORDS = {
    "property", "contract", "dispute", "divorce", "custody", "inheritance",
    "land", "rent", "breach", "civil", "matrimonial", "succession",
    "partition", "tenancy", "eviction",
}

BAIL_KEYWORDS = {
    "bail", "anticipatory", "regular bail", "default bail", "overcrowded",
    "compensation", "undertrial", "bailable", "acquit",
}

# ---------------------------------------------------------------------------
# IPC section → classification mapping (rule-based)
# ---------------------------------------------------------------------------
IPC_TO_CLASS = {
    # Major crimes
    "302": "Criminal (Major)",  # Murder
    "376": "Criminal (Major)",  # Rape
    "307": "Criminal (Major)",  # Attempt to murder
    "395": "Criminal (Major)",  # Dacoity
    "364": "Criminal (Major)",  # Kidnapping for ransom
    "396": "Criminal (Major)",  # Dacoity with murder
    "120B": "Criminal (Major)", # Criminal conspiracy
    "121": "Criminal (Major)",  # Waging war against state
    "392": "Criminal (Minor)",  # Robbery
    "323": "Criminal (Minor)",  # Voluntarily causing hurt
    "420": "Criminal (Minor)",  # Cheating
    "379": "Criminal (Minor)",  # Theft
    "498A": "Criminal (Minor)", # Cruelty by husband
    "324": "Criminal (Minor)",  # Hurt by dangerous weapon
    "506": "Criminal (Minor)",  # Criminal intimidation
    # Civil
    "406": "Civil",             # Criminal breach of trust
    "425": "Civil",             # Mischief
    "447": "Civil",             # Trespass
}


def preprocess(text: str) -> str:
    """Lowercase, remove punctuation, remove stop-words."""
    text = text.lower()
    text = re.sub(r"[%s]" % re.escape(string.punctuation), " ", text)
    tokens = text.split()
    tokens = [t for t in tokens if t not in STOP_WORDS and len(t) > 1]
    return " ".join(tokens)


def extract_keywords(text: str) -> List[str]:
    """Return matched urgency / crime keywords found in text."""
    tokens = set(text.lower().split())
    found = []
    for kw in URGENCY_KEYWORDS | MAJOR_CRIME_KEYWORDS | MINOR_CRIME_KEYWORDS:
        if kw in tokens or kw in text.lower():
            found.append(kw)
    return found


def classify_by_rules(text: str, ipc_section: str) -> str:
    """Rule-based classification: IPC lookup first, then keyword scoring."""
    # 1. IPC section lookup
    ipc_clean = ipc_section.strip().upper().replace("IPC", "").replace(" ", "").replace("SECTION", "")
    for key, cls in IPC_TO_CLASS.items():
        if key.upper() in ipc_clean:
            return cls

    text_lower = text.lower()

    # 2. Keyword scoring
    scores = {
        "Criminal (Major)": 0,
        "Criminal (Minor)": 0,
        "Civil": 0,
        "Bail Eligible": 0,
        "Fast Track": 0,
    }

    for kw in MAJOR_CRIME_KEYWORDS:
        if kw in text_lower:
            scores["Criminal (Major)"] += 2
    for kw in MINOR_CRIME_KEYWORDS:
        if kw in text_lower:
            scores["Criminal (Minor)"] += 2
    for kw in CIVIL_KEYWORDS:
        if kw in text_lower:
            scores["Civil"] += 2
    for kw in BAIL_KEYWORDS:
        if kw in text_lower:
            scores["Bail Eligible"] += 2
    for kw in URGENCY_KEYWORDS:
        if kw in text_lower:
            scores["Fast Track"] += 1

    # Bail eligible if score is high
    if scores["Bail Eligible"] >= 2:
        return "Bail Eligible"

    # Fast Track if high urgency and not major crime
    if scores["Fast Track"] >= 3 and scores["Criminal (Major)"] == 0:
        return "Fast Track"

    best = max(scores, key=lambda k: scores[k])
    if scores[best] == 0:
        return "Criminal (Minor)"  # default fallback
    return best


# ---------------------------------------------------------------------------
# Scikit-learn TF-IDF + Logistic Regression (trained on synthetic corpus)
# ---------------------------------------------------------------------------
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import numpy as np

# Synthetic training corpus (expanded for demo / hackathon)
_TRAIN_CORPUS = [
    # Criminal (Major)
    ("accused committed cold-blooded murder stabbed victim multiple times premeditated killing", "Criminal (Major)"),
    ("rape sexual assault minor victim brutal attack grievous injury", "Criminal (Major)"),
    ("terrorism bomb blast planned attack state government sedition", "Criminal (Major)"),
    ("kidnapping ransom demand hostage held captive months", "Criminal (Major)"),
    ("dacoity armed robbery gang attack serious injury victim", "Criminal (Major)"),
    ("organized crime drug trafficking international network narcotics", "Criminal (Major)"),
    ("homicide attempt murder weapon injury hospital icu", "Criminal (Major)"),
    ("arson deliberately set fire building causing death destruction", "Criminal (Major)"),
    # Criminal (Minor)
    ("theft mobile phone wallet pickpocket market", "Criminal (Minor)"),
    ("cheating fraud online scam deceived victim money", "Criminal (Minor)"),
    ("drunk driving disorderly conduct public nuisance arrested", "Criminal (Minor)"),
    ("domestic dispute quarrel neighbor verbal abuse complaint", "Criminal (Minor)"),
    ("bribery government official small amount demanded", "Criminal (Minor)"),
    ("forgery fake document signature pension fraud", "Criminal (Minor)"),
    ("voluntarily causing hurt punch fight minor injury", "Criminal (Minor)"),
    ("mischief property damage fence broken vandalism", "Criminal (Minor)"),
    # Civil
    ("property dispute land boundary partition ancestral", "Civil"),
    ("divorce matrimonial case custody children maintenance", "Civil"),
    ("contract breach agreement payment defaulted civil suit", "Civil"),
    ("rent eviction tenant landlord dispute arrears", "Civil"),
    ("inheritance succession will disputed estate assets", "Civil"),
    ("defamation reputation newspaper article written lies", "Civil"),
    # Bail Eligible
    ("bail application overcrowded prison undertrial long detention", "Bail Eligible"),
    ("anticipatory bail fear arrest bailable offence surety", "Bail Eligible"),
    ("default bail challan not filed custody exceeds limit", "Bail Eligible"),
    ("regular bail detention disproportionate minor offence surety offered", "Bail Eligible"),
    # Fast Track
    ("elderly victim senior citizen 75 years unable attend hearings urgent", "Fast Track"),
    ("rape victim fast track court sexual assault speedy trial", "Fast Track"),
    ("juvenile minor accused child 14 years speedy justice", "Fast Track"),
    ("medical emergency terminal illness patient deteriorating urgent hearing", "Fast Track"),
    ("pregnant woman accused health risk immediate hearing required", "Fast Track"),
]

_texts = [preprocess(t) for t, _ in _TRAIN_CORPUS]
_labels = [lbl for _, lbl in _TRAIN_CORPUS]

_ml_pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(ngram_range=(1, 2), max_features=1000)),
    ("clf", LogisticRegression(max_iter=500, class_weight="balanced")),
])
_ml_pipeline.fit(_texts, _labels)

_CONFIDENCE_THRESHOLD = 0.40


def classify_case(summary: str, ipc_section: str) -> Tuple[str, List[str]]:
    """
    Classify a case using ML pipeline with rule-based fallback.
    Returns (classification, detected_keywords).
    """
    processed = preprocess(summary)
    keywords = extract_keywords(summary)

    # Try ML first
    proba = _ml_pipeline.predict_proba([processed])[0]
    max_proba = float(np.max(proba))
    ml_class = _ml_pipeline.classes_[int(np.argmax(proba))]

    if max_proba >= _CONFIDENCE_THRESHOLD:
        classification = ml_class
    else:
        # Fallback to rule-based
        classification = classify_by_rules(summary, ipc_section)

    return classification, keywords
