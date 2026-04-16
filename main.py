from fastapi import FastAPI
from routes.case_routes import router

app = FastAPI(title="Court Case Prioritization Engine")

app.include_router(router)

@app.get("/")
def home():
    return {"message": "Backend is running 🚀"}