from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

# Shared properties for SubTask
class SubTaskBase(BaseModel):
    title: str
    completed: Optional[bool] = False

# What we receive when creating a subtask
class SubTaskCreate(SubTaskBase):
    pass

# What we send back: subtask + id + task relation omitted here to avoid recursion
class SubTaskRead(SubTaskBase):
    id: int

    class Config:
        orm_mode = True


# Shared properties for Task
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: Optional[bool] = False
    reminder: Optional[datetime] = None
    reminder_email: Optional[EmailStr] = None
    reminder_enabled: bool = False
    completed_date: Optional[datetime] = None

# Properties to receive on creation
class TaskCreate(TaskBase):
    # subtasks can be created together optionally
    subtasks: Optional[List[SubTaskCreate]] = []

# Properties returned from DB, with id and subtasks included
class TaskRead(TaskBase):
    id: int
    subtasks: List[SubTaskRead] = []

    class Config:
        orm_mode = True

class SubTaskUpdate(BaseModel):
    id: Optional[int]
    title: Optional[str] = None
    completed: Optional[bool] = None

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str] = None
    completed: Optional[bool] = False
    reminder: Optional[datetime] = None
    reminder_email: Optional[EmailStr] = None
    reminder_enabled: Optional[bool] = False
    completed_date: Optional[datetime] = None
    subtasks: Optional[List[SubTaskUpdate]] = []

class CompletionUpdate(BaseModel):
    completed: bool
    completed_date: Optional[datetime] = None