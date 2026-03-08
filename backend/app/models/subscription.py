"""
Subscription database model
Tracks user subscriptions and payment status
"""
import uuid
from datetime import datetime
from enum import Enum
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Enum as SQLEnum, Numeric
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship

from app.core.database import Base


class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    EXPIRED = "expired"
    CANCELLED = "cancelled"
    PENDING = "pending"
    TRIAL = "trial"


class SubscriptionPlan(str, Enum):
    FREE = "free"
    MONTHLY = "monthly"
    YEARLY = "yearly"
    LIFETIME = "lifetime"


class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # User relationship
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    # Subscription details
    plan = Column(SQLEnum(SubscriptionPlan), default=SubscriptionPlan.FREE)
    status = Column(SQLEnum(SubscriptionStatus), default=SubscriptionStatus.PENDING)
    
    # Payment details
    amount = Column(Numeric(10, 2), nullable=True)  # Amount paid
    currency = Column(String(3), default="INR")  # INR, USD, etc.
    
    # Payment gateway info
    payment_gateway = Column(String(50), nullable=True)  # 'razorpay', 'stripe', etc.
    payment_id = Column(String(200), nullable=True)  # Gateway payment ID
    order_id = Column(String(200), nullable=True)  # Gateway order ID
    
    # Subscription period
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    
    # Trial
    is_trial = Column(Boolean, default=False)
    trial_end_date = Column(DateTime, nullable=True)
    
    # Auto-renewal
    auto_renew = Column(Boolean, default=False)
    
    # Additional metadata
    payment_metadata = Column(JSONB, default=dict)  # Store additional payment/subscription info
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    cancelled_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", backref="subscriptions")
