from fastapi import FastAPI
from JobTracker.routes.job_routes import router as job_router
from InterviewLog.routes.interview_log_route import router as interviewLog_router
from Login.routes.login_routes import router as login_router
from fastapi.middleware.cors import CORSMiddleware
#from GapGenerator.routes.gap_routes import router as gap_router

#Initializing the Fast API
app = FastAPI()
origins = [
    "http://localhost:5173", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # allow your frontend origin(s)
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods
    allow_headers=["*"],  # allow all headers
)
# Register routes
app.include_router(job_router)
app.include_router(interviewLog_router)
app.include_router(login_router)

@app.get("/")
def root():
    return {"message": "Career Comeback Compass App is running"}
