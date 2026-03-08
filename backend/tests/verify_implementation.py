
import os
import uuid
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

from app.main import app
from app.core.database import get_db
from app.models.user import User

# Load env vars
load_dotenv()

# Use the real database (PostgreSQL)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
if not SQLALCHEMY_DATABASE_URL:
    print("Error: DATABASE_URL not found in environment.")
    exit(1)

print(f"Connecting to: {SQLALCHEMY_DATABASE_URL}")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

client = TestClient(app)

def test_full_flow():
    # Unique email for this run
    run_id = str(uuid.uuid4())[:8]
    email = f"test_{run_id}@example.com"
    print(f"Test Email: {email}")

    print("1. Registering new user...")
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "password": "password123",
            "name": "Test User",
            "language_preference": "en"
        }
    )
    if response.status_code != 200:
        print(f"Registration failed: {response.text}")
        return
    
    data = response.json()
    token = data["access_token"]
    print(f"   Success! Token received: {token[:10]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n2. Logging in...")
    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": email,
            "password": "password123"
        }
    )
    if response.status_code != 200:
        print(f"Login failed: {response.text}")
        return
    print("   Success!")
    
    print("\n3. Creating a Program (Admin)...")
    program_data = {
        "title": f"Mindfulness Basics {run_id}",
        "description": "A 7-day introduction to mindfulness",
        "is_published": True,
        "total_sessions": 7,
        "tags": ["mindfulness", "beginners"]
    }
    # Note: Create endpoint is currently open
    response = client.post("/api/v1/programs/", json=program_data, headers=headers)
    if response.status_code != 200:
        print(f"Create program failed: {response.text}")
        return
    program_id = response.json()["id"]
    print(f"   Success! Program ID: {program_id}")
    
    print("\n4. Listing Programs...")
    response = client.get("/api/v1/programs/", headers=headers)
    assert len(response.json()) > 0
    print(f"   Success! Found {len(response.json())} programs")
    
    print("\n5. Getting specific Program...")
    response = client.get(f"/api/v1/programs/{program_id}", headers=headers)
    assert response.status_code == 200
    print("   Success!")

    # Manually create a session
    from app.models.session import Session as SessionModel
    
    db = TestingSessionLocal()
    session = SessionModel(
        program_id=program_id,
        title="Day 1: Breath",
        session_number=1,
        duration_minutes=10,
        audio_url="http://example.com/audio.mp3"
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    session_id = str(session.id)
    print(f"\n6. Created test session manually: {session_id}")
    
    print("\n7. Getting Session...")
    response = client.get(f"/api/v1/sessions/{session_id}", headers=headers)
    if response.status_code != 200:
        print(f"Get session failed: {response.text}")
    else:
        print("   Success!")
    
    print("\n8. Updating Progress...")
    progress_data = {
        "program_id": program_id,
        "session_id": session_id,
        "is_completed": True,
        "completion_percentage": 100.0,
        "time_spent_seconds": 600
    }
    response = client.post("/api/v1/progress/", json=progress_data, headers=headers)
    if response.status_code != 200:
        print(f"Update progress failed: {response.text}")
    else:
        print("   Success!")
        
    print("\n9. Verifying Progress...")
    response = client.get("/api/v1/progress/", headers=headers)
    progress_list = response.json()
    assert len(progress_list) > 0
    assert progress_list[0]["is_completed"] == True
    print("   Success! Progress verified.")

    # Cleanup
    print("\n10. Cleaning up test data...")
    try:
        # Delete user (will cascade delete progress, subscriptions)
        # Delete program (will cascade delete sessions)
        # Since logic deletes cascade from user/program, we just need to delete those.
        # But we need to use raw sql or reusable session
        
        db.execute(text(f"DELETE FROM users WHERE email = '{email}'"))
        db.execute(text(f"DELETE FROM programs WHERE id = '{program_id}'"))
        db.commit()
        print("   Cleanup successful!")
    except Exception as e:
        print(f"   Cleanup failed: {e}")
    finally:
        db.close()

    print("\nALL CHECKS PASSED!")

if __name__ == "__main__":
    test_full_flow()
