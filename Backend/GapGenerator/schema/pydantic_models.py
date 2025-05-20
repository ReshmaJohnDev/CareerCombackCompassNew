from pydantic import BaseModel
from typing import Optional


#pydasntic model is used to handle the quality of input db
class GapBase(BaseModel):
    reason: str #Required
    duration: str #Required
    activities : Optional[str] = None
    skills : Optional[str] = None
    goals: Optional[str] = None

#For creating a new job
class GapCreate(GapBase):
    pass

#For returning  a job response
class GapResponse(GapBase):
    id: int

    class Config:
        from_attributes = True  # Allows Pydantic to work with SQLAlchemy ORM models
