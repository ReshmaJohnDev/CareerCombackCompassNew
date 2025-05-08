import sys
import os
from fastapi import FastAPI
from JobTracker.routes.job_routes import router as job_router


sys.path.append(os.path.join(os.path.dirname(__file__)))
app = FastAPI()

# Register routes
app.include_router(job_router)

@app.get("/")
def root():
    return {"message": "Career Comeback Compass App is running"}
