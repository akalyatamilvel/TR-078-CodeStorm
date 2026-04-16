def compute_priority(case, classification):
    score = 0
    explanation = []

    # Detention vs Sentence (MOST IMPORTANT)
    if case["expected_sentence"] > 0:
        ratio = case["detention_duration"] / case["expected_sentence"]

        score += min(ratio * 50, 50)
        explanation.append(f"Detention ratio impact: {round(ratio,2)}")

    # Severity weight
    severity_map = {
        "Criminal (Major)": 30,
        "Criminal (Minor)": 15,
        "Bail Eligible": 10,
        "Civil": 5
    }

    score += severity_map.get(classification, 5)
    explanation.append("Severity weight applied")

    # Age priority
    if case["age"] > 60:
        score += 15
        explanation.append("Senior citizen priority")

    if case["age"] < 18:
        score += 15
        explanation.append("Minor priority")

    # Urgency NLP signal
    if "urgent" in case["summary"].lower():
        score += 20
        explanation.append("Urgency keyword detected")

    return min(int(score), 100), explanation