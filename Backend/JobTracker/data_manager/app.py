import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic_models import JobCreate, JobResponse
from sqlalchemy import create_engine
from data_models import Base, Jobs
from sqlite_data_manager import get_session ,get_engine
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

# Initialize FastAPI app
app = FastAPI()

# Setup DB
db_path = os.path.join(os.path.realpath(os.path.dirname(__file__)), '../data', 'jobs.sqlite')
db_file_name = f"sqlite:///{db_path}"

# Create SQLAlchemy engine
engine = get_engine(db_file_name)

# Create Session Factory
SessionLocal = get_session(engine)

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = get_session(engine)()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Job Tracker API"}

@app.get("/jobs/", response_model=list[JobResponse])
def read_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Jobs).all()
    print("inside get list of job")
    return jobs

@app.post("/jobs/", response_model=JobResponse)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    #model.dump() is a pydantic method to convert  a Pydantic model into a standard
    # Python dictionary.
    #unpacking is performed

    new_job = Jobs(**job.model_dump())  # Create new job using the data passed in the request
    db.add(new_job)
    try:
        db.commit()
        db.refresh(new_job)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,
                            detail="Duplicate job entry for this title and company.")
    finally:
        db.close()  # Ensure the session is closed after the operation
    return new_job
#
# @app.get("/jobs/{job_id}", response_model=JobResponse)
# def read_job(job_id: int, db: Session = Depends(get_db)):
#     job = db.query(Jobs).filter(Jobs.id == job_id).first()
#     if job is None:
#         raise HTTPException(status_code=404, detail="Job not found")
#     return job


