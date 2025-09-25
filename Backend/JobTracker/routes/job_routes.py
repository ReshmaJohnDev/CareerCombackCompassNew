from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..schema.pydantic_models import JobCreate, JobResponse
from ..models.data_models import Jobs
from data_manager.data_manager import get_session
from sqlalchemy.exc import IntegrityError
from util.auth_util import get_current_user
from Login.models.data_models import User

router = APIRouter(
    prefix="/jobs",
    tags=["Job Tracker"]
)


@router.get("/jobs/", response_model=List[JobResponse])
def get_filtered_jobs(
        company: Optional[str] = Query(None, description="Filter by company name"),
        status: Optional[str] = Query(None, description="Filter by job status"),
        applied_date: Optional[date] = Query(None, description="Filter by applied date"),
        db: Session = Depends(get_session),
        current_user: User = Depends(get_current_user),
):
    query = db.query(Jobs).filter(Jobs.user_id == current_user.id)
    if company:
        # Use case-insensitive matching with wildcards, e.g. to filter companies that contain the string
        query = query.filter(Jobs.company.ilike(f"%{company}%"))
    if status:
        query = query.filter(Jobs.status.ilike(f"%{status}%"))
    if applied_date:
        query = query.filter(Jobs.applied_date == applied_date)

    jobs = query.all()
    return jobs

@router.post("/jobs/", response_model=JobResponse)
def create_job(job: JobCreate,  db: Session = Depends(get_session),
               current_user: User = Depends(get_current_user)):
    #model.dump() is a pydantic method to convert  a Pydantic model into a standard
    # Python dictionary.
    #unpacking is performed
    job_data = job.model_dump()
    job_data['user_id'] = current_user.id

    new_job = Jobs(**job_data)  # Create new job using the data passed in the request
    db.add(new_job)
    try:
        db.commit()
        db.refresh(new_job)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409,
                            detail="Duplicate job entry for this title and company.")

    return new_job

@router.get("/jobs/{job_id}", response_model=JobResponse)
def read_job(job_id: int,db: Session = Depends(get_session),
             current_user: User = Depends(get_current_user)):
    try:
        job = db.query(Jobs).filter(Jobs.id == job_id,
                                    Jobs.user_id == current_user.id).first()

        if job is None:
            raise HTTPException(status_code=404, detail="Job not found")

    except HTTPException as http_error:
        # Handle known errors like "Job not found"
        raise http_error
    return job


@router.delete("/jobs/{job_id}", status_code=204)
def delete_job(job_id: int, db: Session = Depends(get_session),
               current_user: User = Depends(get_current_user)):
    # Fetch the job from the database
    job = db.query(Jobs).filter(Jobs.id == job_id,
                                Jobs.user_id == current_user.id).first()

    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    # Delete the job from the database
    db.delete(job)
    db.commit()  # Commit the transaction

    # Return no content (HTTP 204)
    return None


@router.put("/jobs/{job_id}", response_model=JobResponse)
def update_job(job_id: int, updated_job: JobCreate,db: Session = Depends(get_session),
               current_user: User = Depends(get_current_user)):
    try:
        job = db.query(Jobs).filter(Jobs.id == job_id,
                                    Jobs.user_id == current_user.id).first()
        if job is None:
            raise HTTPException(status_code=404, detail="Job not found")

        
        update_data = updated_job.dict(exclude_unset=True)
          # Update only provided fields dynamically
        for key, value in update_data.items():
            setattr(job, key, value)

        db.commit()
        db.refresh(job)
        return job

    except Exception as e:
        db.rollback()  # Rollback any changes made in the transaction
        raise HTTPException(status_code=500, detail="An error occurred while updating the job.")
