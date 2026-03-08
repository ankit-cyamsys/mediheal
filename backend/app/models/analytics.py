"""
Analytics database model
Tracks user events and analytics data
"""
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB

from app.core.database import Base


class AnalyticsEvent(Base):
    __tablename__ = "analytics_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User relationship (nullable for guest users)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    # Event details
    event_type = Column(String(100), nullable=False)  # 'session_started', 'session_completed', etc.
    event_category = Column(String(50), nullable=True)  # 'engagement', 'conversion', 'error', etc.
    
    # Event metadata
    properties = Column(JSONB, default=dict)  # Flexible JSON storage for event properties
    
    # Session tracking
    session_id = Column(String(100), nullable=True)  # Analytics session ID (different from meditation session)
    
    # Device/Platform info
    platform = Column(String(50), nullable=True)  # 'ios', 'android', 'web'
    device_id = Column(String(200), nullable=True)
    app_version = Column(String(50), nullable=True)
    
    # Location (optional)
    country = Column(String(2), nullable=True)  # ISO country code
    city = Column(String(100), nullable=True)
    
    # Timestamp
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    
    # Additional context
    user_agent = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv4 or IPv6
