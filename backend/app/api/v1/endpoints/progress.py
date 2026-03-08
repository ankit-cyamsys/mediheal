from typing import Any, List
from uuid import UUID
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.progress import UserProgress
from app.models.user import User
from app.schemas import progress as progress_schemas
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[progress_schemas.UserProgress])
async def get_all_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Get all progress records for current user
    """
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id
    ).offset(skip).limit(limit).all()
    return progress

@router.post("/", response_model=progress_schemas.UserProgress)
async def update_progress(
    progress_in: progress_schemas.UserProgressCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Create or update progress for a session
    """
    # Check if progress exists
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.session_id == progress_in.session_id
    ).first()
    
    if progress:
        # Update existing
        progress_data = progress_in.dict(exclude_unset=True)
        for field, value in progress_data.items():
            setattr(progress, field, value)
        
        # If completed, set timestamp
        if progress_in.is_completed and not progress.completed_at:
            progress.completed_at = datetime.utcnow()
            
        progress.updated_at = datetime.utcnow()
    else:
        # Create new
        progress = UserProgress(
            **progress_in.dict(),
            user_id=current_user.id,
            completed_at=datetime.utcnow() if progress_in.is_completed else None
        )
        db.add(progress)
        
    db.commit()
    db.refresh(progress)
    return progress
