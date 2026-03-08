from typing import Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

# Shared properties
class SessionBase(BaseModel):
    program_id: UUID
    title: str
    description: Optional[str] = None
    session_number: int
    duration_minutes: Optional[int] = 10
    audio_url: Optional[str] = None
    audio_duration_seconds: Optional[int] = None
    language: Optional[str] = "en"
    is_premium: Optional[bool] = False
    is_locked: Optional[bool] = False
    transcript: Optional[str] = None
    instructions: Optional[str] = None

# Properties to receive via API on creation
class SessionCreate(SessionBase):
    pass

# Properties to receive via API on update
class SessionUpdate(SessionBase):
    program_id: Optional[UUID] = None
    title: Optional[str] = None
    session_number: Optional[int] = None

# Properties to return to client
class Session(SessionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
