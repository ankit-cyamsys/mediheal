"""
Program database model
Represents a meditation program (e.g., "Mindfulness Basics", "Sleep Better")
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship

from app.core.database import Base


class Program(Base):
    __tablename__ = "programs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Basic Info
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    short_description = Column(String(500), nullable=True)
    
    # Language support
    language = Column(String(5), default="en")  # 'en', 'hi', etc.
    
    # Program metadata
    category = Column(String(100), nullable=True)  # 'mindfulness', 'sleep', 'stress', etc.
    difficulty_level = Column(String(50), default="beginner")  # 'beginner', 'intermediate', 'advanced'
    total_sessions = Column(Integer, default=0)
    estimated_duration_days = Column(Integer, default=21)  # Default 21-day program
    
    # Media
    thumbnail_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    
    # Access control
    is_premium = Column(Boolean, default=False)
    is_published = Column(Boolean, default=True)
    
    # Tags for filtering
    tags = Column(ARRAY(String), default=list)  # ['stress-relief', 'sleep', etc.]
    
    # Ordering
    sort_order = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sessions = relationship("Session", back_populates="program", cascade="all, delete-orphan")
    user_progress = relationship("UserProgress", back_populates="program")
