from pydantic import BaseModel
from datetime import date
from typing import Optional


#pydasntic model is used to handle the quality of input db
class InterviewLogBase(BaseModel):
    interview_date: date
    company: str
    interview_type: Optional[str] = None
    role: str
    questions: Optional[str] = None
    feedback: Optional[str] = None
    strengths: Optional[str] = None
    improvements: Optional[str] = None
    next_steps: Optional[str] = None
#For creating a new job
class InterviewLogCreate(InterviewLogBase):
    interview_date: date
    company: str
    interview_type: str

class InterviewLogUpdate(InterviewLogBase):
    pass
#For returning  a job response
class InterviewLogResponse(InterviewLogBase):
    id: int

    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy ORM models
