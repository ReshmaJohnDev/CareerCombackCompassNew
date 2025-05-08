from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..models.data_models import Jobs,Base
import os


# Define the path to the SQLite file

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Goes up two levels
db_path = os.path.join(base_dir, 'db', 'jobs.sqlite')
db_uri = f"sqlite:///{db_path}"
# Create SQLAlchemy engine

engine = create_engine(db_uri, connect_args={"check_same_thread": False})

# Create Session Factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Dependency to get DB session

Base.metadata.create_all(bind=engine)
def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
