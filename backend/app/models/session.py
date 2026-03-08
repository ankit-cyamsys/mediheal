"""
Session database model
Represents a single meditation session within a program
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class Session(Base):
    __tablename__ = "sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relationship to Program
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    
    # Basic Info
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    
    # Session metadata
    session_number = Column(Integer, nullable=False)  # 1, 2, 3, etc. within the program
    duration_minutes = Column(Integer, default=10)  # Duration in minutes
    
    # Audio
    audio_url = Column(String(500), nullable=True)  # S3 URL or local path
    audio_duration_seconds = Column(Integer, nullable=True)  # Actual audio duration
    
    # Language
    language = Column(String(5), default="en")
    
    # Access control
    is_premium = Column(Boolean, default=False)
    is_locked = Column(Boolean, default=False)  # For progressive unlock
    unlock_after_session = Column(Integer, nullable=True)  # Unlock after completing session N
    
    # Content
    transcript = Column(Text, nullable=True)  # Optional transcript
    instructions = Column(Text, nullable=True)  # Pre-session instructions
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    program = relationship("Program", back_populates="sessions")
    user_progress = relationship("UserProgress", back_populates="session")
