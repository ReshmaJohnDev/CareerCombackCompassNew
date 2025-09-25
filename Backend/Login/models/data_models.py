from sqlalchemy import Column, Integer, String,ForeignKey, UniqueConstraint
from shared.base import Base
from sqlalchemy.orm import relationship



class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    jobs = relationship("Jobs", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="owner")
