"""
Priority Scoring Engine (0–100)

Factors:
  1. Detention ratio  (detention_duration / expected_sentence) → up to 40 pts
  2. Severity         (Major=30, Minor=15, Civil=10, Bail/Fast=20) → up to 30 pts
  3. Age factor       (elderly ≥ 65 or minor ≤ 18) → up to 15 pts
  4. Urgency keywords → up to 15 pts
"""
from typing import List, Tuple

SEVERITY_SCORES = {
    "Criminal (Major)": 30,
    "Fast Track": 22,
    "Bail Eligible": 18,
    "Criminal (Minor)": 15,
    "Civil": 10,
}

URGENCY_BOOST_WORDS = {
    "murder", "rape", "terrorism", "life-threatening", "medical", "health",
    "emergency", "critical", "disability", "pregnant", "minor", "juvenile",
    "elderly", "senior", "handicap", "terminal", "death", "dying",
    "kidnapping", "trafficking", "dacoity",
}


def compute_priority(
    classification: str,
    detention_duration: float,
    expected_sentence: float,
    age: int,
    keywords: List[str],
) -> Tuple[float, List[str], str | None]:
    """
    Returns (priority_score 0-100, explanation list, flag or None).
    """
    score = 0.0
    explanation: List[str] = []
    flag: str | None = None

    # ── 1. Detention ratio (max 40 pts) ────────────────────────────────────
    if expected_sentence > 0:
        ratio = detention_duration / expected_sentence
    else:
        ratio = 0.0

    if ratio >= 1.0:
        det_score = 40.0
        flag = "Undertrial exceeds sentence"
        explanation.append(
            f"Detention ({detention_duration:.0f} mo) exceeds expected sentence "
            f"({expected_sentence:.0f} mo) — undertrial overstay detected."
        )
    elif ratio >= 0.75:
        det_score = 30.0
        explanation.append(
            f"Detention is {ratio*100:.0f}% of expected sentence — very close to limit."
        )
    elif ratio >= 0.5:
        det_score = 20.0
        explanation.append(
            f"Detention is {ratio*100:.0f}% of expected sentence — moderate concern."
        )
    elif ratio >= 0.25:
        det_score = 10.0
        explanation.append(f"Detention is {ratio*100:.0f}% of expected sentence.")
    else:
        det_score = 5.0

    score += det_score

    # ── 2. Severity (max 30 pts) ─────────────────────────────────────────
    sev_score = SEVERITY_SCORES.get(classification, 10)
    score += sev_score
    if classification == "Criminal (Major)":
        explanation.append("High severity crime (Criminal — Major category).")
    elif classification == "Fast Track":
        explanation.append("Case qualifies for Fast Track court processing.")
    elif classification == "Bail Eligible":
        explanation.append("Case may be eligible for bail consideration.")
    elif classification == "Criminal (Minor)":
        explanation.append("Moderate severity crime (Criminal — Minor category).")
    else:
        explanation.append("Civil matter — lower inherent severity.")

    # ── 3. Age factor (max 15 pts) ───────────────────────────────────────
    if age <= 18:
        score += 15
        explanation.append(f"Accused/victim is a minor (age {age}) — elevated priority.")
    elif age >= 65:
        score += 15
        explanation.append(f"Accused/victim is a senior citizen (age {age}) — elevated priority.")
    elif age >= 55:
        score += 7
        explanation.append(f"Accused/victim is above 55 years — moderate age concern.")
    else:
        explanation.append(f"Age ({age}) does not add special priority boost.")

    # ── 4. Urgency keywords (max 15 pts) ─────────────────────────────────
    matched_urgent = [kw for kw in keywords if kw in URGENCY_BOOST_WORDS]
    kw_score = min(len(matched_urgent) * 5, 15)
    score += kw_score
    if matched_urgent:
        explanation.append(
            f"Urgency keywords detected: {', '.join(matched_urgent[:5])}."
        )

    # Cap at 100
    final_score = round(min(score, 100.0), 1)
    return final_score, explanation, flag
