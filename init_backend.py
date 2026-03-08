#!/usr/bin/env python3
"""
Backend Project Initialization Script
Creates complete FastAPI project structure with all necessary files
"""

import os
from pathlib import Path

# Project structure
STRUCTURE = {
    "app": {
        "api": {
            "v1": {
                "endpoints": [
                    "__init__.py",
                    "auth.py",
                    "users.py",
                    "programs.py",
                    "sessions.py",
                    "progress.py",
                    "analytics.py",
                    "subscriptions.py",
                ],
                "__init__.py": "",
            },
            "__init__.py": "",
            "deps.py": "",
        },
        "core": [
            "__init__.py",
            "config.py",
            "security.py",
            "database.py",
        ],
        "models": [
            "__init__.py",
            "user.py",
            "program.py",
            "session.py",
            "progress.py",
            "subscription.py",
            "analytics.py",
        ],
        "schemas": [
            "__init__.py",
            "user.py",
            "program.py",
            "session.py",
            "progress.py",
            "subscription.py",
            "analytics.py",
            "auth.py",
        ],
        "services": [
            "__init__.py",
            "auth_service.py",
            "program_service.py",
            "progress_service.py",
            "subscription_service.py",
            "analytics_service.py",
            "notification_service.py",
            "storage_service.py",
        ],
        "tasks": [
            "__init__.py",
            "celery_app.py",
            "notification_tasks.py",
        ],
        "__init__.py": "",
        "main.py": "",
    },
    "alembic": {
        "versions": ["__init__.py"],
        "__init__.py": "",
        "env.py": "",
        "script.py.mako": "",
    },
    "tests": {
        "api": ["__init__.py", "test_auth.py", "test_programs.py"],
        "services": ["__init__.py", "test_auth_service.py"],
        "__init__.py": "",
        "conftest.py": "",
    },
}

# File templates
TEMPLATES = {
    "app/main.py": '''"""
Main FastAPI application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

from app.core.config import settings
from app.api.v1 import auth, users, programs, sessions, progress, analytics, subscriptions
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Meditation App API",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/v1/users", tags=["Users"])
app.include_router(programs.router, prefix="/api/v1/programs", tags=["Programs"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["Progress"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])
app.include_router(subscriptions.router, prefix="/api/v1/subscriptions", tags=["Subscriptions"])

@app.get("/")
async def root():
    return {"message": "Meditation App API", "version": settings.VERSION}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
''',
    
    "app/core/config.py": '''"""
Application configuration using Pydantic Settings
"""
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # App
    PROJECT_NAME: str = "Meditation App API"
    VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    
    # AWS S3
    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str = "ap-south-1"
    S3_BUCKET_NAME: Optional[str] = None
    
    # Payment Gateways
    RAZORPAY_KEY_ID: Optional[str] = None
    RAZORPAY_KEY_SECRET: Optional[str] = None
    STRIPE_SECRET_KEY: Optional[str] = None
    
    # Firebase
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    
    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = None
    GOOGLE_CLIENT_SECRET: Optional[str] = None
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
''',
    
    "app/core/database.py": '''"""
Database configuration and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Database dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
''',
    
    "app/core/security.py": '''"""
Security utilities for authentication and authorization
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Generate password hash"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None
''',
    
    "app/api/deps.py": '''"""
Common dependencies for API endpoints
"""
from typing import Generator
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import decode_token
from app.models.user import User

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user
''',
    
    "app/models/user.py": '''"""
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
''',
    
    "app/api/v1/endpoints/auth.py": '''"""
Authentication endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):
    """Register a new user"""
    auth_service = AuthService(db)
    return await auth_service.register_user(request)

@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login user"""
    auth_service = AuthService(db)
    return await auth_service.login_user(request)

@router.post("/guest", response_model=TokenResponse)
async def guest_login(db: Session = Depends(get_db)):
    """Create guest user"""
    auth_service = AuthService(db)
    return await auth_service.create_guest_user()
''',
}


def create_directory_structure(base_path: Path, structure: dict):
    """Recursively create directory structure"""
    for name, content in structure.items():
        path = base_path / name
        
        if isinstance(content, dict):
            # It's a directory
            path.mkdir(parents=True, exist_ok=True)
            create_directory_structure(path, content)
        elif isinstance(content, list):
            # It's a directory with files
            path.mkdir(parents=True, exist_ok=True)
            for file in content:
                (path / file).touch()
        else:
            # It's a file
            path.parent.mkdir(parents=True, exist_ok=True)
            if content:
                path.write_text(content)
            else:
                path.touch()


def create_file_from_template(path: Path, template_content: str):
    """Create file from template"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(template_content)


def main():
    """Main initialization function"""
    print("🚀 Initializing Meditation App Backend...")
    
    # Get base path
    base_path = Path.cwd() / "backend"
    base_path.mkdir(exist_ok=True)
    
    # Create directory structure
    print("📁 Creating directory structure...")
    create_directory_structure(base_path, STRUCTURE)
    
    # Create files from templates
    print("📝 Creating files from templates...")
    for file_path, content in TEMPLATES.items():
        full_path = base_path / file_path
        create_file_from_template(full_path, content)
    
    # Create __init__.py files
    print("🔧 Creating __init__.py files...")
    init_files = [
        "app/__init__.py",
        "app/api/__init__.py",
        "app/api/v1/__init__.py",
        "app/api/v1/endpoints/__init__.py",
        "app/core/__init__.py",
        "app/models/__init__.py",
        "app/schemas/__init__.py",
        "app/services/__init__.py",
        "app/tasks/__init__.py",
        "tests/__init__.py",
    ]
    
    for init_file in init_files:
        (base_path / init_file).touch()
    
    print("✅ Backend structure initialized!")
    print(f"\n📂 Project created at: {base_path}")
    print("\nNext steps:")
    print("  1. cd backend")
    print("  2. poetry install (or pip install -r requirements.txt)")
    print("  3. Update .env with your configuration")
    print("  4. alembic init alembic (if not exists)")
    print("  5. alembic revision --autogenerate -m 'Initial migration'")
    print("  6. alembic upgrade head")
    print("  7. uvicorn app.main:app --reload")


if __name__ == "__main__":
    main()
