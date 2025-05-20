#
# from fastapi import APIRouter, Query
# from sqlalchemy.orm import Session
# from typing import List, Optional
# from ..schema.pydantic_models import GapCreate, GapResponse
# router = APIRouter()
#
#
#
# @router.get("/jobs/", response_model=List[GapResponse])
# def get_filtered_jobs(
#         reason: Optional[str] = Query(None, description="Filter by reason"),
#         duration: Optional[str] = Query(None, description="Filter by duration"),
#         activities: Optional[str] = Query(None, description="Filter by applied date"),
#         db: Session = Depends(get_session)
# ):
#