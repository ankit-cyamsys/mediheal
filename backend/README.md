# Meditation App Backend

FastAPI backend for the Meditation App.

## Setup

1. Install dependencies:
```bash
poetry install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run migrations:
```bash
poetry run alembic upgrade head
```

4. Start server:
```bash
poetry run uvicorn app.main:app --reload
```

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc
