from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..models.data_models import Base
from config.config import DATABASE_URI
from shared.base import Base
from JobTracker.models.data_models import Jobs
from Login.models.data_models import User


engine = create_engine(DATABASE_URI)

# Create Session Factory
SessionLocal = sessionmaker(bind=engine)


# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


#<***** Database Dependency ****>
# Dependency to get DB session .Any route that requires a
# database , gets this Session injected.
def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
