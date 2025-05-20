from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..schema.pydantic_models import InterviewLogCreate, InterviewLogResponse
from ..models.data_models import InterviewLog
from ..data_manager.sqlite_data_manager import get_session
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/interviews",
    tags=["Interview Logs"])


@router.get("/interview_log/", response_model=List[InterviewLogResponse])
def get_filtered_log(
        company: Optional[str] = Query(None),
        interview_type: Optional[str] = Query(None),
        interview_date: Optional[date] = Query(None),
        role:Optional[date] = Query(None),
        db: Session = Depends(get_session)
):
    query = db.query(InterviewLog)
    if company:
        # Use case-insensitive matching with wildcards, e.g. to filter companies that contain the string
        query = query.filter(InterviewLog.company.ilike(f"%{company}%"))
    if interview_type:
        query = query.filter(InterviewLog.interview_type.ilike(f"%{interview_type}%"))
    if interview_date:
        query = query.filter(InterviewLog.interview_date == interview_date)
    if role:
        query = query.filter(InterviewLog.role.ilike(f"%{role}%"))

    interview_log = query.all()
    return interview_log


@router.post("/interview_log/", response_model=InterviewLogResponse)
def create_log(log: InterviewLogCreate, db: Session = Depends(get_session)):
    #model.dump() is a pydantic method to convert  a Pydantic model into a standard
    # Python dictionary.
    #unpacking is performed

    new_log = InterviewLog(**log.model_dump())  # Create new log using the data passed in the request
    print(new_log.role)
    db.add(new_log)
    try:
        db.commit()
        print("commit sucessfull")
        db.refresh(new_log)
    except IntegrityError as e:
        db.rollback()
        print(f"IntegrityError: {e.orig}")  #
        raise HTTPException(status_code=409,
                            detail="Duplicate log entry for this role and company.")
    return new_log


@router.get("/interview_log/{log_id}", response_model=InterviewLogResponse)
def read_log(log_id: int, db: Session = Depends(get_session)):
    try:
        log= db.query(InterviewLog).filter(InterviewLog.id == log_id).first()

        if log is None:
             raise HTTPException(status_code=404, detail="log not found")

    except HTTPException as http_error:
        # Handle known errors like "Log not found"
        raise http_error
    return log


@router.delete("/interview_log/{log_id}", status_code=204)
def delete_log(log_id: int, db: Session = Depends(get_session)):
    # Fetch the Log from the database
    log = db.query(InterviewLog).filter(InterviewLog.id == log_id).first()

    if log is None:
        raise HTTPException(status_code=404, detail="Log not found")

    # Delete the Log from the database
    db.delete(log)
    db.commit()  # Commit the transaction

    # Return no content (HTTP 204)
    return None

@router.put("/interview_log/{log_id}", response_model=InterviewLogResponse)
def update_log(log_id: int, updated_log: InterviewLogCreate,db: Session = Depends(get_session)):
    try:
        log = db.query(InterviewLog).filter(InterviewLog.id == log_id).first()
        if log is None:
            raise HTTPException(status_code=404, detail="Log not found")

        log.interview_date = updated_log.interview_date
        log.company = updated_log.company
        log.interview_type = updated_log.interview_type
        log.questions = updated_log.questions
        log.feedback= updated_log.feedback
        log.strengths = updated_log.strengths
        log.improvements = updated_log.improvements
        log.next_steps = updated_log.next_steps
        log.role = updated_log.role

        db.commit()
        db.refresh(log)

    except Exception as e:
        db.rollback()  # Rollback any changes made in the transaction
        raise HTTPException(status_code=500, detail="An error occurred while updating the log.")
    return log

