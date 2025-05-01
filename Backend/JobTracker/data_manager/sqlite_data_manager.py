from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Function to create engine
def get_engine(db_path: str):
    engine = create_engine(db_path, connect_args={"check_same_thread": False})
    return engine

# Function to get a session
def get_session(engine):
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal
