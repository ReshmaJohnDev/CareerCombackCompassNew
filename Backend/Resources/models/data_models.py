from sqlalchemy import Column,Integer, String,Text
from shared.base import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    type = Column(String, nullable=False, index=True)   # event, program, community
    title = Column(String, nullable=False, index=True)
    short_description = Column(String, nullable=False)
    full_description = Column(Text, nullable=True)
    location = Column(String, nullable=True)
    organizer = Column(String, nullable=True)
    cta_text = Column(String, nullable=True)
    cta_link = Column(String, nullable=True)