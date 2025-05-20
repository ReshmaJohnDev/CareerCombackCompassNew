
from fastapi import FastAPI
from JobTracker.routes.job_routes import router as job_router
from InterviewLog.routes.interview_log_route import router as interviewLog_router
#from GapGenerator.routes.gap_routes import router as gap_router

#Initializing the Fast API
app = FastAPI()

# Register routes
app.include_router(job_router)
app.include_router(interviewLog_router)

@app.get("/")
def root():
    return {"message": "Career Comeback Compass App is running"}
