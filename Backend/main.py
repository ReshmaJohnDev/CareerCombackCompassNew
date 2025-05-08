# app/main.py
from fastapi import FastAPI
from JobTracker.routes.job_routes import router as job_router

app = FastAPI()

# Register routes
app.include_router(job_router)

@app.get("/")
def root():
    return {"message": "Career Comeback Compass App is running"}