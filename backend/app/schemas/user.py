from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from uuid import UUID

from app.models.user import UserType

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    name: Optional[str] = None
    language_preference: Optional[str] = "en"
    user_type: Optional[UserType] = UserType.GUEST
    is_active: Optional[bool] = True

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    
class UserCreateGuest(BaseModel):
    user_type: UserType = UserType.GUEST

# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to return to client
class User(UserBase):
    id: UUID
    is_verified: bool
    created_at: datetime
    last_active: datetime

    class Config:
        from_attributes = True
