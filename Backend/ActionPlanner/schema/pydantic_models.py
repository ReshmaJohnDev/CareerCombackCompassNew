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
