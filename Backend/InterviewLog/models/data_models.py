from sqlalchemy import Column, Integer, String, Date,Text,UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

# Base class for SQLAlchemy models
Base = declarative_base()

class InterviewLog(Base):
    __tablename__ = 'interview_log'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    interview_date = Column(Date, nullable=False)
    company = Column(String(100), nullable=False)
    interview_type = Column(String(50))  # optional
    role = Column(String(100), nullable=False)
    questions = Column(Text)  # optional
    feedback = Column(Text)  # optional
    strengths = Column(Text)  # optional
    improvements = Column(Text)  # optional
    next_steps = Column(Text)  # optional

    __table_args__ = (
        UniqueConstraint('company', 'role', 'interview_date',name='uq_company_role_date'),
    )
