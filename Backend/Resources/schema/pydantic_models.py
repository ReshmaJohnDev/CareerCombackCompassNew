from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ResourceBase(BaseModel):
    type: str
    title: str
    short_description: str
    full_description: Optional[str] = None
    location: Optional[str] = None
    organizer: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None

# Schema for creating new resource (POST)
class ResourceCreate(ResourceBase):
    pass

# Schema for reading resource (GET)
class Resource(ResourceBase):
    id: int

    class Config:
        orm_mode = True
