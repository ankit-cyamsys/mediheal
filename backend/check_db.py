
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
print(f"Connecting to: {database_url}")

try:
    engine = create_engine(database_url)
    with engine.connect() as connection:
        print("Successfully connected to the database!")
        
        # Check alembic version
        try:
            result = connection.execute(text("SELECT version_num FROM alembic_version"))
            version = result.scalar()
            print(f"Current Alembic Version: {version}")
        except Exception as e:
            print("Could not get alembic version (table might not exist):", e)
            
        # List tables
        result = connection.execute(text("SELECT table_name FROM information_schema.tables WHERE table_schema='public'"))
        tables = [row[0] for row in result]
        print("Existing tables:", tables)
        
except Exception as e:
    print(f"Connection failed: {e}")
