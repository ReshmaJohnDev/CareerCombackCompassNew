from pydantic import BaseModel
from datetime import date
from typing import Optional


#pydasntic model is used to handle the quality of input db
class JobBase(BaseModel):
    title: str #Required
    company: str #Required
    applied_date: date #Required
    application_link: Optional[str] = None
    status: str #Required
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None

#For creating a new job
class JobCreate(JobBase):
    pass

#For returning  a job response
class JobResponse(JobBase):
    id: int
    user_id: int 

    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy ORM models
