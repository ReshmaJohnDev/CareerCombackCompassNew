from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from shared.base import Base


class Goal(Base):
    __tablename__ = 'goals'

    # Define columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False,index=True)
    description = Column(String, nullable=False)
    deadline = Column(DateTime, nullable=False)
    reminder = Column(DateTime, nullable=False)
    subtasks = Column(JSON, nullable=False, default=[])
    status = Column(String, nullable=False, default="Pending")

      __table_args__ = (
        UniqueConstraint('title', name='uq_goal_title'),
    )


