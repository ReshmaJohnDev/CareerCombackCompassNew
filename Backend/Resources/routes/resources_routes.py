from fastapi import APIRouter,HTTPException,Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
from ..models.data_models import Resource as ResourceModel  
from ..schema.pydantic_models  import Resource as ResourceSchema , ResourceCreate,Resource
from data_manager.data_manager import get_session

router = APIRouter(
    prefix="/resources",
    tags=["Resources"]
)


@router.get("/grouped")
def get_resources(db: Session = Depends(get_session)):
     resources = db.query(ResourceModel).all()
     grouped = {"Upcoming Events": [], "Returnship Programs": [], "Communities & Support": []}
     for r in resources:
        if r.type == "event":
            grouped["Upcoming Events"].append(r)
        elif r.type == "program":
            grouped["Returnship Programs"].append(r)
        elif r.type == "community":
            grouped["Communities & Support"].append(r)
     return grouped

