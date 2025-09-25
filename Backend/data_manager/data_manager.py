from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from shared.base import Base
from config.config import DATABASE_URI


from JobTracker.models.data_models import Jobs
from Login.models.data_models import User
from ActionPlanner.models.data_models import Task,SubTask
from Resources.models.data_models import Resource

engine = create_engine(DATABASE_URI)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
