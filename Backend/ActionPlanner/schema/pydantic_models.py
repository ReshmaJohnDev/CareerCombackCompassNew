from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Define structure of a single subtask
class Subtask(BaseModel):
    title: str
    completed: bool = False

# Base class for Goal (shared fields)
class GoalBase(BaseModel):
    title: str
    description: str
    deadline: datetime
    reminder: datetime
    status: Optional[str] = "Pending"  # default if not provided
    subtasks: List[Subtask] = []       # list of subtasks in JSON format

# For creating new goals
class GoalCreate(GoalBase):
    pass

# For updating goals (fields optional)
class GoalUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    deadline: Optional[datetime]
    reminder: Optional[datetime]
    status: Optional[str]
    subtasks: Optional[List[Subtask]]

# For reading/returning goals
class GoalOut(GoalBase):
    id: int

    class Config:
        orm_mode = True
