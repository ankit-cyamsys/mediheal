
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

# Add parent dir to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core import security
from app.models.user import User, UserType
from app.models.program import Program
from app.models.session import Session as SessionModel

load_dotenv()

extract_path = lambda p: os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(extract_path(__file__))

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    print("Error: DATABASE_URL not found.")
    exit(1)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed():
    db = SessionLocal()
    
    # 1. Create Admin User
    admin_email = "admin@example.com"
    if not db.query(User).filter(User.email == admin_email).first():
        print(f"Creating admin user: {admin_email}")
        user = User(
            email=admin_email,
            hashed_password=security.get_password_hash("admin123"),
            name="Admin User",
            user_type=UserType.PREMIUM,
            is_active=True,
            is_verified=True
        )
        db.add(user)
    
    # 2. Create Test User
    test_email = "test@example.com"
    if not db.query(User).filter(User.email == test_email).first():
        print(f"Creating test user: {test_email}")
        user = User(
            email=test_email,
            hashed_password=security.get_password_hash("password123"),
            name="Test User",
            user_type=UserType.FREE,
            is_active=True
        )
        db.add(user)
        
    db.commit()
    
    # 3. Create Programs
    programs = [
        {
            "title": "Mindfulness Basics",
            "description": "Learn the fundamentals of mindfulness meditation in this 7-day course.",
            "category": "mindfulness",
            "difficulty_level": "beginner",
            "total_sessions": 7,
            "tags": ["mindfulness", "beginners", "basics"]
        },
        {
            "title": "Sleep Better",
            "description": "Techniques to help you fall asleep faster and stay asleep longer.",
            "category": "sleep",
            "difficulty_level": "beginner",
            "total_sessions": 10,
            "tags": ["sleep", "relaxation"]
        },
        {
            "title": "Anxiety SOS",
            "description": "Quick relief for moments of high anxiety or panic.",
            "category": "anxiety",
            "difficulty_level": "intermediate",
            "total_sessions": 5,
            "tags": ["anxiety", "stress", "sos"]
        }
    ]
    
    for p_data in programs:
        if not db.query(Program).filter(Program.title == p_data["title"]).first():
            print(f"Creating program: {p_data['title']}")
            program = Program(
                title=p_data["title"],
                description=p_data["description"],
                category=p_data["category"],
                difficulty_level=p_data["difficulty_level"],
                total_sessions=p_data["total_sessions"],
                tags=p_data["tags"],
                is_published=True
            )
            db.add(program)
            db.commit()
            db.refresh(program)
            
            # Create dummy sessions for this program
            for i in range(1, p_data["total_sessions"] + 1):
                session = SessionModel(
                    program_id=program.id,
                    title=f"Day {i}",
                    session_number=i,
                    duration_minutes=10,
                    audio_url="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", # Public domain dummy audio
                    description=f"Session {i} of {program.title}"
                )
                db.add(session)
            db.commit()
            
    print("Database seeded successfully!")
    db.close()

if __name__ == "__main__":
    seed()
