def compute_priority(case, classification):
    score = 0
    explanation = []

    # 1. Detention vs Sentence
    if case["expected_sentence"] > 0:
        ratio = case["detention_duration"] / case["expected_sentence"]

        if ratio >= 1:
            score += 40
            explanation.append("Detention exceeds expected sentence")
        else:
            score += int(ratio * 30)

    # 2. Severity
    if "Major" in classification:
        score += 20
        explanation.append("High severity crime")
    elif "Minor" in classification:
        score += 10

    # 3. Age factor
    if case["age"] > 60 or case["age"] < 18:
        score += 20
        explanation.append("Vulnerable age group")

    # 4. Urgency keywords
    if "urgent" in case["summary"].lower():
        score += 20
        explanation.append("Urgency detected")

    return min(score, 100), explanation