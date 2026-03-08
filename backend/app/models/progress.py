"""
User Progress database model
Tracks user's progress through programs and sessions
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.core.database import Base


class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Relationships
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    program_id = Column(UUID(as_uuid=True), ForeignKey("programs.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(UUID(as_uuid=True), ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False)
    
    # Progress tracking
    is_completed = Column(Boolean, default=False)
    completion_percentage = Column(Float, default=0.0)  # 0.0 to 100.0
    
    # Time tracking
    time_spent_seconds = Column(Integer, default=0)  # Total time spent on this session
    last_position_seconds = Column(Integer, default=0)  # Last playback position
    
    # Completion details
    completed_at = Column(DateTime, nullable=True)
    
    # Streak tracking (calculated fields)
    is_part_of_streak = Column(Boolean, default=False)
    
    # Timestamps
    started_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", backref="progress")
    program = relationship("Program", back_populates="user_progress")
    session = relationship("Session", back_populates="user_progress")
