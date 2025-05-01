from sqlalchemy import Column, Integer, String, Date ,UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

# Base class for SQLAlchemy models
Base = declarative_base()

class Jobs(Base):
    __tablename__ = 'jobs'

    # Define columns
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String, nullable=False,index=True)
    company = Column(String, nullable=False,index=True)
    applied_date = Column(Date, nullable=False,index=True)
    application_link = Column(String, nullable=True)
    status = Column(String, nullable=False, index=True)
    notes = Column(String, nullable=True)
    follow_up_date = Column(Date, nullable=True)

    # Add a unique constraint on the combination of title and company
    __table_args__ = (UniqueConstraint('title', 'company', name='_title_company_uc'),)

    def __repr__(self):
        return f"<Job(id={self.id}, title={self.title}, company={self.company})>"
