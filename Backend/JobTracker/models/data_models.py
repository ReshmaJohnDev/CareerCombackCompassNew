from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from shared.base import Base


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

    # Foreign key relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="jobs")


    # Add a unique constraint on the combination of title and company
    __table_args__ = (UniqueConstraint('title', 'company', 'user_id', name='_title_company_uc'),)

