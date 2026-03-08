from typing import Any, List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.program import Program
from app.models.user import User, UserType
from app.schemas import program as program_schemas
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/", response_model=List[program_schemas.Program])
async def get_programs(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    language: Optional[str] = None,
    difficulty: Optional[str] = None
) -> Any:
    """
    Get all programs with optional filtering
    """
    query = db.query(Program).filter(Program.is_published == True)
    
    if category:
        query = query.filter(Program.category == category)
    if language:
        query = query.filter(Program.language == language)
    if difficulty:
        query = query.filter(Program.difficulty_level == difficulty)
        
    programs = query.order_by(Program.sort_order).offset(skip).limit(limit).all()
    return programs

@router.get("/{program_id}", response_model=program_schemas.ProgramWithSessions)
async def get_program(
    program_id: UUID,
    db: Session = Depends(get_db)
) -> Any:
    """
    Get program by ID with sessions
    """
    program = db.query(Program).options(joinedload(Program.sessions)).filter(Program.id == program_id).first()
    
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
        
    return program

# Admin/Creator endpoints (For future use or seeding)
@router.post("/", response_model=program_schemas.Program)
async def create_program(
    program_in: program_schemas.ProgramCreate,
    db: Session = Depends(get_db),
    # current_user: User = Depends(get_current_user) # Uncomment to protect
) -> Any:
    """
    Create a new program
    """
    program = Program(**program_in.dict())
    db.add(program)
    db.commit()
    db.refresh(program)
    return program
