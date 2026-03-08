from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

if TYPE_CHECKING:
    from app.schemas.session import Session

# Shared properties
class ProgramBase(BaseModel):
    title: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    language: Optional[str] = "en"
    category: Optional[str] = None
    difficulty_level: Optional[str] = "beginner"
    thumbnail_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    is_premium: Optional[bool] = False
    is_published: Optional[bool] = False
    tags: Optional[List[str]] = []
    sort_order: Optional[int] = 0

# Properties to receive via API on creation
class ProgramCreate(ProgramBase):
    pass

# Properties to receive via API on update
class ProgramUpdate(ProgramBase):
    title: Optional[str] = None

# Properties to return to client
class Program(ProgramBase):
    id: UUID
    total_sessions: int
    estimated_duration_days: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ProgramWithSessions(Program):
    sessions: List['Session'] = []

from app.schemas.session import Session
ProgramWithSessions.model_rebuild()
