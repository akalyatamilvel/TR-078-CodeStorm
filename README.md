# ⚖️ AI-Based Court Case Prioritization System

## 📌 Overview
The AI-Based Court Case Prioritization System is designed to help courts manage large case backlogs efficiently.  
It uses Artificial Intelligence (NLP + rule-based scoring) to analyze case details and assign a priority score, ensuring urgent and undertrial cases are handled faster and more fairly.

---

## 🚨 Problem Statement
Courts face a huge number of pending cases, making it difficult to decide which case should be handled first.

This leads to:
- Delay in urgent and important cases  
- Undertrial prisoners staying longer than required  
- Inefficient case scheduling and management  

---

## 🎯 Solution
This system provides:
- Automated case analysis using NLP  
- Case classification based on type and severity  
- Priority scoring system (0–100)  
- Identification of undertrial cases exceeding expected sentence  
- Dashboard for viewing and managing case priorities  

---

## 🧠 Key Features

- NLP-based case understanding  
- Case classification (Bail Eligible, Civil, Criminal, etc.)  
- Priority scoring engine  
- Undertrial detection logic  
- Search, filter, and sorting of cases  
- Explainable AI (reason for priority score)  
- Cloud database integration  

---

## 🏗️ Tech Stack

### Frontend
- React.js  
- Tailwind CSS  
- Axios  

### Backend
- Python (FastAPI)  
- spaCy / scikit-learn (for NLP)  

### Database
- MongoDB Atlas (Cloud Database)  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone https://github.com/akalyatamilvel/TR-078-CodeStorm.git
cd TR-078-CodeStorm
```
2️⃣ Backend Setup
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```
3️⃣ Frontend Setup
```
cd frontend
npm install
npm start
```
4️⃣ MongoDB Setup
Create a MongoDB Atlas cluster
Add a database user with read/write access
Allow network access: 0.0.0.0/0
Get connection string

Update in backend (db.py):
```
MONGO_URL = "your_mongodb_connection_string"
```
---

## 🔗 API Endpoints
Method	Endpoint	Description
POST	/analyze-case	Analyze and store case
GET	/cases	Fetch all cases
GET	/cases/sorted	Fetch cases by priority

---
## 📊 Dataset
The dataset contains structured case information:

case_id
summary
ipc_section
detention_duration
expected_sentence
age
gender

Used for testing and simulation.

---

## 📈 System Workflow
User submits case details
Backend processes input using NLP
Case is classified and scored
Data is stored in MongoDB
Dashboard displays prioritized cases

---

## 🧪 Evaluation Metrics
Classification Accuracy
Undertrial Detection Rate
Priority Ranking Consistency
Dashboard Response Time

---
## 🚀 Future Enhancements
Integration with real court data
Advanced ML models (BERT / Transformers)
Role-based authentication system
Multi-language support (Tamil & English)
Mobile application

--- 

## 👥 Team
Akalya TS
Sachitha R
Laxmi Priya TM
Atchaya P

---

## 📜 License
This project is developed for educational and hackathon purposes.

---

## 💡 Acknowledgment
Inspired by real-world judicial challenges and the need for fair and efficient legal systems.

⭐ If you like this project, consider giving it a star!
