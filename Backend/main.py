import os
from fastapi import FastAPI
from JobTracker.routes.job_routes import router as job_router
from GapGenerator.routes.gap_routes import router as gap_router
from Login.routes.login_routes import router as login_router
from Resources.routes.resources_routes import router as resource_router
from fastapi.middleware.cors import CORSMiddleware
from ActionPlanner.routes.action_planner_route import router as action_planner
from ActionPlanner.scheduler.scheduler import start_scheduler as scheduler_start, shutdown_scheduler as scheduler_shutdown
from Chatbot.routes.chat_route import router as chat_router


url = os.getenv("VITE_API_URL")
#Initializing the Fast API
app = FastAPI()
origins = [
    url
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
app.include_router(login_router)
app.include_router(gap_router)
app.include_router(action_planner)
app.include_router(chat_router)
app.include_router(resource_router)

@app.get("/")
def root():
    return {"message": "Career Comeback Compass App is running"}


@app.on_event("startup")
def start_scheduler():
    scheduler_start()

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler_shutdown()