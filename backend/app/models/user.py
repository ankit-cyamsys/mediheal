"""
User database model
"""
import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base

class UserType(str, Enum):
    GUEST = "guest"
    FREE = "free"
    PREMIUM = "premium"

class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=True)
    phone = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String, nullable=True)
    name = Column(String, nullable=True)
    
    language_preference = Column(String(5), default="en")  # 'en', 'hi', etc.
    user_type = Column(SQLEnum(UserType), default=UserType.GUEST)
    
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    
    google_id = Column(String, unique=True, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_active = Column(DateTime, default=datetime.utcnow)
