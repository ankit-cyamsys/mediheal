from typing import Any
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.session import Session as SessionModel
from app.schemas import session as session_schemas
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.get("/{session_id}", response_model=session_schemas.Session)
async def get_session(
    session_id: UUID,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user) # Uncomment to protect content
) -> Any:
    """
    Get session by ID
    """
    session = db.query(SessionModel).filter(SessionModel.id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    return session
