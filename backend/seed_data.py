"""
Seed 20 sample cases into MongoDB via the analyze-case endpoint.
Run:  python seed_data.py
Make sure the backend server is running first.
"""
import requests
import json

API_URL = "http://localhost:8000/analyze-case"

SAMPLE_CASES = [
    {
        "case_id": "CC-2024-001",
        "summary": "Accused committed murder by stabbing the victim 12 times during a property dispute. Premeditated killing, eyewitnesses present.",
        "ipc_section": "IPC 302",
        "detention_duration": 36,
        "expected_sentence": 24,
        "age": 34,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-002",
        "summary": "Rape of a 14-year-old minor by a known person. Victim requires medical attention. Fast track court referral needed.",
        "ipc_section": "IPC 376",
        "detention_duration": 6,
        "expected_sentence": 84,
        "age": 14,
        "gender": "Female",
    },
    {
        "case_id": "CC-2024-003",
        "summary": "Bail application filed for undertrial prisoner held for mobile phone theft. Challan not submitted within 60 days.",
        "ipc_section": "IPC 379",
        "detention_duration": 4,
        "expected_sentence": 3,
        "age": 22,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-004",
        "summary": "Property boundary dispute between two families over ancestral land. Disputed area 2 acres, civil suit pending 7 years.",
        "ipc_section": "IPC 447",
        "detention_duration": 0,
        "expected_sentence": 6,
        "age": 58,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-005",
        "summary": "Elderly woman aged 72 accused of forgery of pension documents. Medical condition deteriorating, unable to attend frequent hearings.",
        "ipc_section": "IPC 420",
        "detention_duration": 8,
        "expected_sentence": 12,
        "age": 72,
        "gender": "Female",
    },
    {
        "case_id": "CC-2024-006",
        "summary": "Terrorism case involving bomb blast planning. Accused part of an organized network targeting government buildings.",
        "ipc_section": "IPC 121",
        "detention_duration": 18,
        "expected_sentence": 120,
        "age": 29,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-007",
        "summary": "Drunk driving case. Accused arrested after minor collision, no injuries reported. First-time offender.",
        "ipc_section": "IPC 279",
        "detention_duration": 1,
        "expected_sentence": 2,
        "age": 27,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-008",
        "summary": "Divorce and child custody dispute. Wife alleges domestic violence and cruelty under section 498A.",
        "ipc_section": "IPC 498A",
        "detention_duration": 0,
        "expected_sentence": 36,
        "age": 35,
        "gender": "Female",
    },
    {
        "case_id": "CC-2024-009",
        "summary": "Kidnapping for ransom. Victim held captive for 3 months. Accused demands 50 lakh from family.",
        "ipc_section": "IPC 364A",
        "detention_duration": 20,
        "expected_sentence": 18,
        "age": 31,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-010",
        "summary": "Online cheating and fraud. Accused created fake website and duped 200+ victims of savings.",
        "ipc_section": "IPC 420",
        "detention_duration": 5,
        "expected_sentence": 24,
        "age": 25,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-011",
        "summary": "Dacoity with murder. Gang of 6 robbed a bank and shot the security guard. Critical evidence recorded.",
        "ipc_section": "IPC 396",
        "detention_duration": 14,
        "expected_sentence": 10,
        "age": 33,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-012",
        "summary": "Juvenile accused age 16 involved in theft. First offence, referred for reformation assessment under juvenile justice.",
        "ipc_section": "IPC 379",
        "detention_duration": 2,
        "expected_sentence": 6,
        "age": 16,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-013",
        "summary": "Contract breach case. Supplier failed to deliver goods worth 10 lakh. Civil dispute, no criminal element.",
        "ipc_section": "Civil",
        "detention_duration": 0,
        "expected_sentence": 0,
        "age": 45,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-014",
        "summary": "Accused suffering from terminal cancer, still detained for minor forgery offence. Medical emergency, urgent bail required.",
        "ipc_section": "IPC 467",
        "detention_duration": 10,
        "expected_sentence": 6,
        "age": 68,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-015",
        "summary": "Arson: accused deliberately burned a competitor's factory. Estimated loss 2 crore. Workers suffered grievous injuries.",
        "ipc_section": "IPC 436",
        "detention_duration": 9,
        "expected_sentence": 84,
        "age": 42,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-016",
        "summary": "Drug trafficking: accused smuggled 5 kg narcotics across state borders. International syndicate connections found.",
        "ipc_section": "NDPS 21",
        "detention_duration": 22,
        "expected_sentence": 60,
        "age": 38,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-017",
        "summary": "Domestic violence complaint. Husband repeatedly assaulted wife causing visible injuries, children traumatized.",
        "ipc_section": "IPC 324",
        "detention_duration": 3,
        "expected_sentence": 12,
        "age": 40,
        "gender": "Male",
    },
    {
        "case_id": "CC-2024-018",
        "summary": "Rent eviction dispute. Tenant refusing to vacate after lease expiry. Landlord claims 24 months arrears.",
        "ipc_section": "Civil",
        "detention_duration": 0,
        "expected_sentence": 0,
        "age": 62,
        "gender": "Female",
    },
    {
        "case_id": "CC-2024-019",
        "summary": "Pregnant woman accused of bribery. Accused 8 months pregnant, doctors advise against stress and detention.",
        "ipc_section": "IPC 171E",
        "detention_duration": 3,
        "expected_sentence": 6,
        "age": 28,
        "gender": "Female",
    },
    {
        "case_id": "CC-2024-020",
        "summary": "Attempt to murder. Accused fired gunshot at victim in crowded marketplace. Victim survived but critical.",
        "ipc_section": "IPC 307",
        "detention_duration": 16,
        "expected_sentence": 12,
        "age": 30,
        "gender": "Male",
    },
]


def seed():
    print("[SEED] Seeding 20 sample cases into MongoDB via API...\n")
    success = 0
    for case in SAMPLE_CASES:
        try:
            resp = requests.post(API_URL, json=case, timeout=10)
            if resp.status_code == 200:
                data = resp.json()
                print(
                    f"[OK]  {case['case_id']} | {data['classification']} | Score: {data['priority_score']} | Flag: {data.get('flag', 'None')}"
                )
                success += 1
            else:
                print(f"[ERR] {case['case_id']} -> HTTP {resp.status_code}: {resp.text}")
        except Exception as e:
            print(f"[ERR] {case['case_id']} -> Error: {e}")

    print(f"\n[DONE] Seeded {success}/{len(SAMPLE_CASES)} cases successfully.")


if __name__ == "__main__":
    seed()
