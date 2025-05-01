from pydantic import BaseModel
from datetime import date
from typing import Optional


#pydasntic model is used to handle the quality of input data
class JobBase(BaseModel):
    title: str #Required
    company: str #Required
    applied_date: date #Required
    application_link: Optional[str] = None
    status: str #Required
    notes: Optional[str] = None
    follow_up_date: Optional[date] = None

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: int

    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy ORM models
