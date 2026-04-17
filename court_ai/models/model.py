import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# =========================
# LOAD DATASET
# =========================
data = pd.read_csv("cases.csv")

# =========================
# NLP: TEXT → FEATURES
# =========================
vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(data['summary'])
y = data['priority_label']

# =========================
# TRAIN / TEST SPLIT
# =========================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# =========================
# TRAIN MODEL
# =========================
model = LogisticRegression()
model.fit(X_train, y_train)

# =========================
# EVALUATION
# =========================
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("✅ Model trained successfully")
print("📊 Accuracy:", round(accuracy * 100, 2), "%")

# =========================
# RULE-BASED LOGIC
# =========================

def check_undertrial(detention, expected):
    return "yes" if detention > expected else "no"


def calculate_score(detention, expected, age, ipc):
    score = 0

    # detention impact
    if detention > expected:
        score += 50
    elif detention > expected / 2:
        score += 30
    else:
        score += 10

    # age factor
    if age > 60:
        score += 10

    # IPC based importance
    if ipc == "IPC 379":   # theft
        score += 10
    elif ipc == "IPC 420": # fraud
        score += 15

    return min(score, 100)

# =========================
# MAIN ANALYSIS FUNCTION
# =========================

def analyze_case(summary, detention, expected, age, ipc, case_id, gender):
    
    # NLP prediction
    vec = vectorizer.transform([summary])
    priority = model.predict(vec)[0]

    # Rule-based
    undertrial = check_undertrial(detention, expected)
    score = calculate_score(detention, expected, age, ipc)

    # Final output
    return {
        "case_id": case_id,
        "gender": gender,
        "ipc_section": ipc,
        "priority_label": priority,
        "priority_score": score,
        "undertrial_flag": undertrial
    }

# =========================
# TEST SAMPLE
# =========================

test = analyze_case(
    summary="Minor theft, detained for 10 months",
    detention=10,
    expected=6,
    age=25,
    ipc="IPC 379",
    case_id="C99999",
    gender="Male"
)

print("\n🔍 Sample Prediction:")
print(test)