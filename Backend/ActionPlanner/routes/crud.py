from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from ..schema.pydantic_models import GoalCreate, GoalOut, GoalUpdate
from ..models.data_models import Goal

def get_goals(db: Session):
    return db.query(Goal).all()

def create_goal(db: Session, goal: GoalCreate):
    goal_data = goal.model_dump()
    db_goal = Goal(**goal_data)
    db.add(db_goal)
    try:
        db.commit()
        db.refresh(db_goal)
        return db_goal
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Goal with this title already exists.")

def update_goal(db: Session, goal_id: int, goal: GoalUpdate):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    for key, value in goal.model_dump(exclude_unset=True).items():
        setattr(db_goal, key, value)
    try:
        db.commit()
        db.refresh(db_goal)
        return db_goal
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Goal with this title already exists.")

def delete_goal(db: Session, goal_id: int):
    db_goal = db.query(Goal).filter(Goal.id == goal_id).first()
    if not db_goal:
        raise HTTPException(status_code=404, detail="Goal not found")
    db.delete(db_goal)
    db.commit()
    return db_goal
