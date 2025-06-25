from fastapi import APIRouter, Depends, HTTPException, Query,status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from ..schema.pydantic_models  import TaskCreate, TaskRead, SubTaskCreate
from ..models.data_models import Task, SubTask
from ..data_manager.sqlite_data_manager import get_session
from sqlalchemy.exc import IntegrityError


router = APIRouter(
    prefix="/tasks",
    tags=["Action Planner"]
)


@router.post("/", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(task_in: TaskCreate, db: Session = Depends(get_session)):
    task = Task(
        title=task_in.title,
        description=task_in.description,
        completed=task_in.completed,
        reminder=task_in.reminder,
        reminder_email=str(task_in.reminder_email) if task_in.reminder_email else None,
        reminder_enabled=task_in.reminder_enabled,
    )
    db.add(task)
    db.flush()  # To get task.id before adding subtasks

    for subtask_in in task_in.subtasks:
        subtask = SubTask(
            title=subtask_in.title,
            completed=subtask_in.completed,
            task=task,
        )
        db.add(subtask)

    db.commit()
    db.refresh(task)
    return task

# Get all tasks
@router.get("/", response_model=List[TaskRead])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    tasks = db.query(Task).offset(skip).limit(limit).all()
    return tasks

# Get task by ID
@router.get("/{task_id}", response_model=TaskRead)
def read_task(task_id: int, db: Session = Depends(get_session)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# Update task completion status
@router.patch("/{task_id}/complete", response_model=TaskRead)
def update_task_completion(task_id: int, completed: bool, db: Session = Depends(get_session)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = completed
    db.commit()
    db.refresh(task)
    return task


 # Update subtask completion status
@router.patch("/subtasks/{subtask_id}/complete", response_model=SubTaskCreate)
def update_subtask_completion(subtask_id: int, completed: bool, db: Session = Depends(get_session)):
    subtask = db.query(SubTask).filter(SubTask.id == subtask_id).first()
    if not subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    subtask.completed = completed
    db.commit()
    db.refresh(subtask)
    return subtask


# Delete a task (and cascade delete subtasks)
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_session)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return