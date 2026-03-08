# Meditation App - Development Roadmap
## Mac Mini M4 Setup Guide

**Date:** February 15, 2026  
**Target:** MVP Launch in 6 weeks  
**Stack:** React Native + FastAPI + PostgreSQL

---

## 🎯 Development Phases Overview

### Phase 1: Environment Setup (Week 1, Days 1-2)
- ✅ Python 3.11+ installed
- ✅ Node.js installed
- ✅ Xcode installed
- ✅ Android Studio installed
- 🔄 Set up development tools and dependencies
- 🔄 Initialize project structure

### Phase 2: Backend Foundation (Week 1-2)
- Set up FastAPI project structure
- Configure PostgreSQL database
- Implement authentication system
- Create core API endpoints
- Set up Redis for caching

### Phase 3: Mobile App Foundation (Week 2-3)
- Initialize React Native project
- Implement navigation structure
- Create UI components matching design
- Integrate with backend APIs
- Set up audio player

### Phase 4: Core Features (Week 3-4)
- User onboarding flow
- Audio playback and offline downloads
- Progress tracking system
- Notifications setup

### Phase 5: Monetization & Polish (Week 4-5)
- AdMob integration
- Payment gateway (Razorpay/Stripe)
- Analytics integration
- UI/UX polish and testing

### Phase 6: Testing & Launch (Week 5-6)
- Beta testing
- Bug fixes
- App store submission
- Launch preparation

---

## 📋 Pre-Development Checklist

### ✅ Already Installed
- [x] Python 3.11+
- [x] Node.js (v18+)
- [x] Xcode (with command line tools)
- [x] Android Studio

### 🔄 Need to Install/Configure

#### 1. Homebrew Packages
```bash
# Install Homebrew if not installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install essential packages
brew install postgresql@15
brew install redis
brew install watchman
brew install cocoapods
```

#### 2. Python Development Tools
```bash
# Install pipx for global Python tools
brew install pipx
pipx ensurepath

# Install Poetry for dependency management
pipx install poetry

# Install development tools
pip install --upgrade pip
pip install black flake8 mypy pytest pytest-cov
```

#### 3. React Native CLI
```bash
# Install Expo CLI (recommended for faster development)
npm install -g expo-cli

# OR React Native CLI (if you prefer bare workflow)
npm install -g react-native-cli

# Install development tools
npm install -g yarn
npm install -g typescript
```

#### 4. Database Setup
```bash
# Start PostgreSQL
brew services start postgresql@15

# Create database and user
psql postgres
CREATE DATABASE meditation_dev;
CREATE USER meditation_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE meditation_dev TO meditation_user;
\q
```

#### 5. Redis Setup
```bash
# Start Redis
brew services start redis

# Test Redis connection
redis-cli ping
# Should return: PONG
```

#### 6. iOS Development
```bash
# Install CocoaPods dependencies (if using bare React Native)
sudo gem install cocoapods

# Verify Xcode installation
xcode-select --install
```

#### 7. Android Development
- Open Android Studio
- Go to Settings → Appearance & Behavior → System Settings → Android SDK
- Install SDK Platforms: Android 13 (API 33)
- Install SDK Tools: Android SDK Build-Tools, Android Emulator, Android SDK Platform-Tools

#### 8. Environment Variables
Create `.env` file in your home directory:
```bash
# Add to ~/.zshrc or ~/.bash_profile
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

---

## 🏗️ Project Structure

```
meditation-app/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── core/              # Core configurations
│   │   ├── models/            # Database models
│   │   ├── schemas/           # Pydantic schemas
│   │   ├── services/          # Business logic
│   │   └── main.py
│   ├── alembic/               # Database migrations
│   ├── tests/
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── docker-compose.yml
│
├── mobile/                     # React Native App
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── screens/           # App screens
│   │   ├── navigation/        # Navigation config
│   │   ├── services/          # API services
│   │   ├── store/             # State management
│   │   ├── utils/             # Utilities
│   │   └── assets/            # Images, fonts
│   ├── android/
│   ├── ios/
│   ├── package.json
│   └── app.json
│
├── scripts/                    # Automation scripts
│   ├── setup_dev.sh
│   ├── deploy.sh
│   └── seed_database.py
│
├── docs/                       # Documentation
│   ├── api_docs.md
│   ├── deployment.md
│   └── architecture.md
│
└── README.md
```

---

## 🚀 Quick Start Commands

### Initialize Backend Project
```bash
# Create backend directory
mkdir -p meditation-app/backend
cd meditation-app/backend

# Initialize Poetry project
poetry init --no-interaction --name meditation-backend --python ^3.11

# Add dependencies
poetry add fastapi uvicorn[standard] sqlalchemy alembic psycopg2-binary \
           pydantic-settings python-jose[cryptography] passlib[bcrypt] \
           python-multipart redis celery fastapi-users[sqlalchemy] \
           boto3 stripe razorpay

# Add development dependencies
poetry add --group dev pytest pytest-asyncio pytest-cov black flake8 mypy \
                       httpx faker

# Activate virtual environment
poetry shell

# Initialize project structure (we'll create this script next)
python ../scripts/init_backend.py
```

### Initialize Mobile Project
```bash
# Navigate to project root
cd meditation-app

# Using Expo (Recommended)
npx create-expo-app mobile --template blank-typescript

# OR using React Native CLI
npx react-native@latest init MeditationApp --template react-native-template-typescript

# Navigate to mobile directory
cd mobile

# Install dependencies
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-track-player axios zustand
npm install @react-native-async-storage/async-storage
npm install react-native-safe-area-context react-native-screens
npm install expo-av expo-notifications expo-file-system
npm install react-native-gesture-handler react-native-reanimated

# iOS specific (if using bare React Native)
cd ios && pod install && cd ..
```

---

## 📝 Development Workflow

### Daily Workflow

#### Morning (Backend)
```bash
# 1. Start services
brew services start postgresql@15
brew services start redis

# 2. Activate backend environment
cd meditation-app/backend
poetry shell

# 3. Run migrations if any
alembic upgrade head

# 4. Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# 5. In new tab, start Celery worker (for background tasks)
celery -A app.tasks.celery_app worker --loglevel=info
```

#### Afternoon (Mobile)
```bash
# 1. Navigate to mobile directory
cd meditation-app/mobile

# 2. Start Metro bundler
npm start

# 3. In new tab, run iOS simulator
npm run ios
# OR press 'i' in Metro bundler

# 4. In another tab, run Android emulator
npm run android
# OR press 'a' in Metro bundler
```

### Testing Commands
```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Mobile tests
cd mobile
npm test

# E2E tests (later)
npm run test:e2e
```

---

## 🎨 Design Implementation Guide

Based on your `meditation_app_screen.html`, here's the color scheme and design system:

### Color Palette
```javascript
// tailwind.config.js or theme.ts
const colors = {
  primary: '#19e65e',           // Bright green
  backgroundLight: '#f6f8f6',   // Off-white
  backgroundDark: '#112116',    // Dark green
  mintSoft: '#e8f7ed',          // Light mint
  orangeSoft: '#fff4e6',        // Light orange
  
  // Additional colors for UI
  success: '#19e65e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}
```

### Typography
```javascript
// Font: Inter (already in your design)
const typography = {
  h1: 'text-4xl font-light tracking-widest',
  h2: 'text-3xl font-light',
  h3: 'text-2xl font-medium',
  body: 'text-base font-normal',
  caption: 'text-sm text-gray-500',
  button: 'font-semibold',
}
```

### Component Patterns
1. **Cards:** White/80 opacity with backdrop blur
2. **Buttons:** Rounded-full, shadow-lg, active:scale-95
3. **Icons:** Material Icons (spa icon for logo)
4. **Gradients:** Radial gradients with soft colors

---

## 📊 Week-by-Week Development Plan

### Week 1: Foundation Setup

#### Days 1-2: Environment & Project Structure
- [ ] Run setup script to install all dependencies
- [ ] Initialize backend project with FastAPI
- [ ] Initialize mobile project with React Native
- [ ] Set up Git repository and branching strategy
- [ ] Configure environment variables
- [ ] Create initial database schema

**Deliverable:** Both projects running locally

#### Days 3-4: Authentication System
- [ ] Implement JWT authentication in backend
- [ ] Create user registration endpoint
- [ ] Create login endpoint
- [ ] Implement Google OAuth
- [ ] Create guest user flow
- [ ] Write authentication tests

**Deliverable:** Working auth system with tests

#### Days 5-7: Database & Core Models
- [ ] Create database models (users, programs, sessions, progress)
- [ ] Set up Alembic migrations
- [ ] Create seed data script
- [ ] Implement CRUD operations
- [ ] Set up Redis caching layer
- [ ] Write model tests

**Deliverable:** Complete database layer with sample data

---

### Week 2: Backend Core Features

#### Days 8-10: Content Management APIs
- [ ] Programs API (GET /programs, GET /programs/:id)
- [ ] Sessions API (GET /sessions, GET /sessions/:id)
- [ ] Audio file upload to S3
- [ ] Pre-signed URL generation
- [ ] Content filtering by language
- [ ] API documentation

**Deliverable:** Content APIs with Swagger docs

#### Days 11-12: Progress Tracking
- [ ] Progress tracking endpoints
- [ ] Session completion logic
- [ ] Streak calculation
- [ ] Statistics aggregation
- [ ] Calendar view data endpoint

**Deliverable:** Progress tracking system

#### Days 13-14: Analytics & Notifications
- [ ] Analytics events endpoint
- [ ] Event tracking logic
- [ ] Push notification setup (FCM)
- [ ] Notification scheduling with Celery
- [ ] Background tasks

**Deliverable:** Analytics and notifications working

---

### Week 3: Mobile App Foundation

#### Days 15-17: UI Components & Navigation
- [ ] Set up navigation structure
- [ ] Create design system (colors, typography, components)
- [ ] Language selection screen
- [ ] Onboarding screens
- [ ] Bottom tab navigation
- [ ] Reusable components (buttons, cards, inputs)

**Deliverable:** Basic navigation and UI components

#### Days 18-19: Authentication Flows
- [ ] Login screen
- [ ] Registration screen
- [ ] Google Sign-In integration
- [ ] Guest access flow
- [ ] Token management
- [ ] Protected routes

**Deliverable:** Complete authentication flow in app

#### Days 20-21: Home & Program Screens
- [ ] Home screen with programs list
- [ ] Program detail screen
- [ ] Session list screen
- [ ] API integration
- [ ] Loading states
- [ ] Error handling

**Deliverable:** Browse and view programs

---

### Week 4: Core Features Implementation

#### Days 22-24: Audio Player
- [ ] Audio player setup (react-native-track-player)
- [ ] Player controls (play, pause, skip)
- [ ] Progress bar
- [ ] Background playback
- [ ] Offline download functionality
- [ ] Queue management

**Deliverable:** Fully functional audio player

#### Days 25-26: Progress Tracking UI
- [ ] Progress screen
- [ ] Calendar view
- [ ] Statistics display
- [ ] Streak indicator
- [ ] Session completion UI
- [ ] Animations

**Deliverable:** Progress tracking UI

#### Days 27-28: User Profile & Settings
- [ ] Profile screen
- [ ] Settings screen
- [ ] Language switcher
- [ ] Notification preferences
- [ ] Logout functionality
- [ ] Account management

**Deliverable:** User profile features

---

### Week 5: Monetization & Polish

#### Days 29-30: AdMob Integration
- [ ] AdMob setup
- [ ] Interstitial ads before sessions (guest users)
- [ ] Ad frequency logic
- [ ] Skip ad countdown
- [ ] Test ads

**Deliverable:** Ads working for guest users

#### Days 31-32: Payment Integration
- [ ] Razorpay SDK integration
- [ ] Subscription plans UI
- [ ] Payment flow
- [ ] Subscription status checking
- [ ] Restore purchases
- [ ] Donation button

**Deliverable:** Payment system working

#### Days 33-34: Analytics & Tracking
- [ ] Firebase Analytics setup
- [ ] Event tracking implementation
- [ ] User properties
- [ ] Screen tracking
- [ ] Custom events
- [ ] Debug view

**Deliverable:** Analytics tracking all key events

#### Day 35: UI/UX Polish
- [ ] Animations and transitions
- [ ] Loading states refinement
- [ ] Error messages improvement
- [ ] Empty states
- [ ] Accessibility improvements
- [ ] Dark mode tweaks

**Deliverable:** Polished user experience

---

### Week 6: Testing & Launch Preparation

#### Days 36-38: Testing
- [ ] Unit tests for critical functions
- [ ] Integration tests
- [ ] E2E tests for main flows
- [ ] Manual testing on real devices
- [ ] Performance testing
- [ ] Fix critical bugs

**Deliverable:** Stable app with <5% crash rate

#### Days 39-40: Beta Testing
- [ ] TestFlight setup (iOS)
- [ ] Google Play Internal Testing (Android)
- [ ] Recruit 20-30 beta testers
- [ ] Collect feedback
- [ ] Fix reported issues
- [ ] Iterate based on feedback

**Deliverable:** Beta version with user feedback

#### Days 41-42: App Store Preparation
- [ ] App store screenshots
- [ ] App descriptions (EN, HI)
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] App icons in all sizes
- [ ] Store listing optimization

**Deliverable:** Store listings ready

#### Day 42: Launch! 🚀
- [ ] Submit to App Store
- [ ] Submit to Google Play
- [ ] Set up customer support email
- [ ] Create landing page
- [ ] Prepare launch announcement
- [ ] Monitor analytics

**Deliverable:** App submitted and live

---

## 🛠️ Development Tools & Resources

### Essential Tools
1. **VS Code Extensions:**
   - Python (Microsoft)
   - Pylance
   - React Native Tools
   - Prettier
   - ESLint
   - Thunder Client (API testing)

2. **Mac Apps:**
   - Postman (API testing)
   - TablePlus (Database GUI)
   - Proxyman (Network debugging)
   - Figma (Design reference)
   - Sourcetree (Git GUI)

3. **Chrome Extensions:**
   - React Developer Tools
   - Redux DevTools

### Learning Resources
- FastAPI Docs: https://fastapi.tiangolo.com
- React Native Docs: https://reactnative.dev
- React Navigation: https://reactnavigation.org
- Expo Docs: https://docs.expo.dev

### Community & Support
- FastAPI Discord
- React Native Discord
- Stack Overflow
- GitHub Issues

---

## 📈 Success Metrics to Track

### Development Metrics
- Code coverage: >80%
- Build time: <5 minutes
- Hot reload time: <2 seconds
- API response time: <200ms (p95)

### MVP Launch Metrics (Month 1)
- Downloads: 1,000
- Paid subscribers: 50 (5% conversion)
- D7 retention: >40%
- Crash-free rate: >95%
- App store rating: >4.0

---

## 🐛 Common Issues & Solutions

### Backend Issues

**Issue: Database connection error**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart if needed
brew services restart postgresql@15

# Test connection
psql -U meditation_user -d meditation_dev -h localhost
```

**Issue: Redis connection error**
```bash
# Check Redis status
redis-cli ping

# Restart Redis
brew services restart redis
```

### Mobile Issues

**Issue: Metro bundler cache**
```bash
# Clear Metro cache
npm start -- --reset-cache

# Clear watchman
watchman watch-del-all

# Clean and rebuild
cd ios && pod install && cd ..
npm run ios
```

**Issue: Android build fails**
```bash
# Clean Gradle cache
cd android && ./gradlew clean && cd ..

# Rebuild
npm run android
```

---

## 🔒 Security Checklist

- [ ] Environment variables not committed
- [ ] API keys secured in backend
- [ ] HTTPS only in production
- [ ] Input validation on all endpoints
- [ ] Password hashing (bcrypt)
- [ ] JWT token expiration
- [ ] Rate limiting on APIs
- [ ] SQL injection prevention (using ORM)
- [ ] XSS prevention
- [ ] CORS properly configured

---

## 🎯 Next Steps

1. **Run the setup script** (we'll create this next)
2. **Initialize both projects**
3. **Set up version control**
4. **Create first API endpoint**
5. **Build first screen in mobile app**
6. **Connect mobile to backend**
7. **Iterate rapidly!**

---

## 📞 Getting Help

- **Technical Issues:** Create GitHub issue
- **Design Questions:** Refer to design system
- **Architecture Decisions:** Document in `/docs`
- **Code Reviews:** Use Pull Requests

---

**Good luck with your development! 🚀**

Remember: Start small, iterate fast, and focus on MVP features first!
