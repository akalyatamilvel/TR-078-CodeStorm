def classify_case(summary, ipc_section):
    summary = summary.lower()

    explanation = []

    if "bail" in summary:
        explanation.append("Contains 'bail' keyword")
        return "Bail Eligible", explanation

    if "civil" in summary:
        explanation.append("Detected civil nature")
        return "Civil", explanation

    if "murder" in summary or "rape" in summary:
        explanation.append("Severe crime detected")
        return "Criminal (Major)", explanation

    if "theft" in summary or "fraud" in summary:
        explanation.append("Minor criminal activity")
        return "Criminal (Minor)", explanation

    explanation.append("Default classification")
    return "Fast Track", explanation