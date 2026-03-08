from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

# Shared properties
class UserProgressBase(BaseModel):
    program_id: UUID
    session_id: UUID
    is_completed: Optional[bool] = False
    completion_percentage: Optional[float] = 0.0
    time_spent_seconds: Optional[int] = 0
    last_position_seconds: Optional[int] = 0

# Properties to receive via API on creation
class UserProgressCreate(UserProgressBase):
    pass

# Properties to receive via API on update
class UserProgressUpdate(UserProgressBase):
    program_id: Optional[UUID] = None
    session_id: Optional[UUID] = None

# Properties to return to client
class UserProgress(UserProgressBase):
    id: UUID
    user_id: UUID
    completed_at: Optional[datetime] = None
    is_part_of_streak: bool
    started_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
