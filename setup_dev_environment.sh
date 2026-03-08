#!/bin/bash

# Meditation App - Development Environment Setup Script
# For Mac Mini M4 (Apple Silicon)
# Run this script to set up your complete development environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

print_status "Starting Meditation App Development Setup..."
echo ""

# ===========================
# 1. CHECK PREREQUISITES
# ===========================
print_status "Checking prerequisites..."

# Check Python
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python $PYTHON_VERSION found"
else
    print_error "Python 3 not found. Please install Python 3.11+"
    exit 1
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js $NODE_VERSION found"
else
    print_error "Node.js not found. Please install Node.js 18+"
    exit 1
fi

# Check Xcode
if command_exists xcodebuild; then
    print_success "Xcode found"
else
    print_warning "Xcode not found. iOS development will not be available."
fi

# Check Android Studio (basic check)
if [ -d "/Applications/Android Studio.app" ]; then
    print_success "Android Studio found"
else
    print_warning "Android Studio not found. Android development will not be available."
fi

echo ""

# ===========================
# 2. INSTALL HOMEBREW PACKAGES
# ===========================
print_status "Checking Homebrew packages..."

# Check Homebrew
if ! command_exists brew; then
    print_warning "Homebrew not found. Installing..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    print_success "Homebrew installed"
fi

# Install/update packages
BREW_PACKAGES=(
    "postgresql@15"
    "redis"
    "watchman"
    "cocoapods"
)

for package in "${BREW_PACKAGES[@]}"; do
    if brew list "$package" &>/dev/null; then
        print_success "$package already installed"
    else
        print_status "Installing $package..."
        brew install "$package"
        print_success "$package installed"
    fi
done

echo ""

# ===========================
# 3. START SERVICES
# ===========================
print_status "Starting services..."

# Start PostgreSQL
if brew services list | grep postgresql@15 | grep started &>/dev/null; then
    print_success "PostgreSQL already running"
else
    print_status "Starting PostgreSQL..."
    brew services start postgresql@15
    sleep 2
    print_success "PostgreSQL started"
fi

# Start Redis
if brew services list | grep redis | grep started &>/dev/null; then
    print_success "Redis already running"
else
    print_status "Starting Redis..."
    brew services start redis
    sleep 1
    print_success "Redis started"
fi

echo ""

# ===========================
# 4. SETUP DATABASE
# ===========================
print_status "Setting up database..."

# Wait for PostgreSQL to be ready
sleep 2

# Create database and user
psql postgres -c "CREATE DATABASE meditation_dev;" 2>/dev/null || print_warning "Database meditation_dev may already exist"
psql postgres -c "CREATE USER meditation_user WITH PASSWORD 'dev_password';" 2>/dev/null || print_warning "User meditation_user may already exist"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE meditation_dev TO meditation_user;" 2>/dev/null
psql postgres -c "ALTER DATABASE meditation_dev OWNER TO meditation_user;" 2>/dev/null

print_success "Database setup complete"

echo ""

# ===========================
# 5. INSTALL PYTHON TOOLS
# ===========================
print_status "Installing Python development tools..."

# Install Poetry
if command_exists poetry; then
    print_success "Poetry already installed"
else
    print_status "Installing Poetry..."
    curl -sSL https://install.python-poetry.org | python3 -
    export PATH="$HOME/.local/bin:$PATH"
    print_success "Poetry installed"
fi

# Install global Python tools
pip3 install --upgrade pip --quiet
pip3 install black flake8 mypy pytest pytest-cov --quiet 2>/dev/null || true

print_success "Python tools installed"

echo ""

# ===========================
# 6. INSTALL NODE.JS TOOLS
# ===========================
print_status "Installing Node.js development tools..."

# Check if npm packages are installed globally
NPM_PACKAGES=(
    "expo-cli"
    "yarn"
    "typescript"
)

for package in "${NPM_PACKAGES[@]}"; do
    if npm list -g "$package" &>/dev/null; then
        print_success "$package already installed"
    else
        print_status "Installing $package..."
        npm install -g "$package" --quiet
        print_success "$package installed"
    fi
done

echo ""

# ===========================
# 7. CREATE PROJECT STRUCTURE
# ===========================
print_status "Creating project structure..."

# Create root directory
mkdir -p meditation-app
cd meditation-app

# Create directory structure
mkdir -p backend/{app/{api,core,models,schemas,services,tasks},alembic,tests,scripts}
mkdir -p mobile/src/{components,screens,navigation,services,store,utils,assets}
mkdir -p scripts
mkdir -p docs

print_success "Project structure created"

echo ""

# ===========================
# 8. CREATE CONFIGURATION FILES
# ===========================
print_status "Creating configuration files..."

# Backend .env file
cat > backend/.env.example << 'EOF'
# Database
DATABASE_URL=postgresql://meditation_user:dev_password@localhost:5432/meditation_dev

# Redis
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# AWS S3 (for audio files)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=meditation-app-audio

# Payment Gateways
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
STRIPE_SECRET_KEY=your-stripe-secret-key

# Firebase (for notifications)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-firebase-private-key
FIREBASE_CLIENT_EMAIL=your-firebase-client-email

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Environment
ENVIRONMENT=development
DEBUG=True
EOF

cp backend/.env.example backend/.env

# Backend requirements.txt
cat > backend/requirements.txt << 'EOF'
# Core
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.5.3
pydantic-settings==2.1.0

# Database
sqlalchemy==2.0.25
alembic==1.13.1
psycopg2-binary==2.9.9
asyncpg==0.29.0

# Authentication
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
fastapi-users[sqlalchemy]==12.1.3

# Redis & Caching
redis==5.0.1
celery==5.3.4

# Cloud Storage
boto3==1.34.28

# Payments
stripe==7.10.0
razorpay==1.4.1

# Utilities
python-dotenv==1.0.0
httpx==0.26.0
aiofiles==23.2.1

# Development
pytest==7.4.4
pytest-asyncio==0.23.3
pytest-cov==4.1.0
black==23.12.1
flake8==7.0.0
mypy==1.8.0
faker==22.2.0
EOF

# Backend pyproject.toml for Poetry
cat > backend/pyproject.toml << 'EOF'
[tool.poetry]
name = "meditation-backend"
version = "0.1.0"
description = "Backend API for Meditation App"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
sqlalchemy = "^2.0.25"
pydantic-settings = "^2.1.0"

[tool.poetry.dev-dependencies]
pytest = "^7.4.4"
black = "^23.12.1"
flake8 = "^7.0.0"

[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"
EOF

# Mobile package.json base
cat > mobile/package.json << 'EOF'
{
  "name": "meditation-mobile",
  "version": "0.1.0",
  "main": "index.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "test": "jest",
    "lint": "eslint . --ext .ts,.tsx"
  },
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.2",
    "expo": "~50.0.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "@types/react-native": "~0.73.0",
    "typescript": "^5.3.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0"
  }
}
EOF

# Mobile .env.example
cat > mobile/.env.example << 'EOF'
API_BASE_URL=http://localhost:8000/api/v1
GOOGLE_CLIENT_ID=your-google-client-id
ADMOB_APP_ID=your-admob-app-id
RAZORPAY_KEY_ID=your-razorpay-key-id
EOF

cp mobile/.env.example mobile/.env

# Git ignore
cat > .gitignore << 'EOF'
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
ENV/
.env

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# React Native
.expo/
.expo-shared/
dist/
web-build/

# iOS
ios/Pods/
ios/build/
*.pbxuser
*.mode1v3
*.mode2v3
*.perspectivev3
xcuserdata/
*.xcworkspace/

# Android
android/.gradle/
android/build/
android/app/build/
*.apk

# IDEs
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Secrets
*.pem
*.key
.env.local
.env.production
EOF

print_success "Configuration files created"

echo ""

# ===========================
# 9. CREATE HELPER SCRIPTS
# ===========================
print_status "Creating helper scripts..."

# Backend start script
cat > scripts/start_backend.sh << 'EOF'
#!/bin/bash
cd backend
source venv/bin/activate || poetry shell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
EOF
chmod +x scripts/start_backend.sh

# Mobile start script
cat > scripts/start_mobile.sh << 'EOF'
#!/bin/bash
cd mobile
npm start
EOF
chmod +x scripts/start_mobile.sh

# Database reset script
cat > scripts/reset_database.sh << 'EOF'
#!/bin/bash
echo "Resetting database..."
psql postgres -c "DROP DATABASE IF EXISTS meditation_dev;"
psql postgres -c "CREATE DATABASE meditation_dev;"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE meditation_dev TO meditation_user;"
echo "Database reset complete!"
EOF
chmod +x scripts/reset_database.sh

print_success "Helper scripts created"

echo ""

# ===========================
# 10. CREATE README
# ===========================
cat > README.md << 'EOF'
# Meditation App - "Inner Peace"

A minimalistic meditation application with guided sessions, progress tracking, and multi-language support.

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15
- Redis
- Xcode (for iOS)
- Android Studio (for Android)

### Setup
```bash
# Run setup script
chmod +x setup_dev_environment.sh
./setup_dev_environment.sh
```

### Start Backend
```bash
cd backend
poetry install
poetry shell
uvicorn app.main:app --reload
```

### Start Mobile App
```bash
cd mobile
npm install
npm start
```

## Project Structure
- `backend/` - FastAPI backend
- `mobile/` - React Native mobile app
- `scripts/` - Helper scripts
- `docs/` - Documentation

## Documentation
See [DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md) for detailed development guide.

## Tech Stack
- **Backend:** FastAPI, PostgreSQL, Redis, Celery
- **Mobile:** React Native, Expo, TypeScript
- **Cloud:** AWS S3, CloudFront
- **Payments:** Razorpay, Stripe
EOF

print_success "README created"

echo ""

# ===========================
# FINAL STATUS
# ===========================
print_success "Setup complete! 🎉"
echo ""
echo "Next steps:"
echo "  1. cd meditation-app"
echo "  2. Initialize backend: cd backend && poetry install"
echo "  3. Initialize mobile: cd mobile && npm install"
echo "  4. Start backend: ./scripts/start_backend.sh"
echo "  5. Start mobile: ./scripts/start_mobile.sh"
echo ""
echo "API Documentation will be available at:"
echo "  http://localhost:8000/docs (Swagger UI)"
echo "  http://localhost:8000/redoc (ReDoc)"
echo ""
echo "Services running:"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - Backend API: http://localhost:8000"
echo ""
print_warning "Remember to update .env files with your actual API keys!"
