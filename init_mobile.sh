#!/bin/bash

# React Native Mobile App Initialization Script
# For Meditation App with Expo

set -e

print_status() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_warning() {
    echo -e "\033[1;33m[WARNING]\033[0m $1"
}

print_status "🚀 Initializing Meditation App Mobile..."

# Check if we're in the right directory
if [ ! -d "meditation-app" ]; then
    mkdir meditation-app
fi

cd meditation-app

# Create mobile app with Expo
if [ ! -d "mobile" ]; then
    print_status "Creating Expo app..."
    npx create-expo-app mobile --template blank-typescript
    print_success "Expo app created"
else
    print_warning "mobile directory already exists"
fi

cd mobile

# Install dependencies
print_status "Installing dependencies..."

# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs

# Expo modules
npx expo install react-native-screens react-native-safe-area-context
npx expo install expo-av expo-notifications expo-file-system
npx expo install @react-native-async-storage/async-storage

# Audio player
npm install react-native-track-player

# State management
npm install zustand

# API client
npm install axios

# UI utilities
npm install react-native-gesture-handler react-native-reanimated

# Dev dependencies
npm install --save-dev @types/react @types/react-native

print_success "Dependencies installed"

# Create directory structure
print_status "Creating directory structure..."

mkdir -p src/{components,screens,navigation,services,store,utils,assets,types,constants}
mkdir -p src/components/{common,audio,progress}
mkdir -p src/screens/{auth,home,player,profile,onboarding}
mkdir -p src/assets/{images,fonts,audio}

print_success "Directory structure created"

# Create core files
print_status "Creating core files..."

# Theme configuration
cat > src/constants/theme.ts << 'EOF'
export const Colors = {
  primary: '#19e65e',
  backgroundLight: '#f6f8f6',
  backgroundDark: '#112116',
  mintSoft: '#e8f7ed',
  orangeSoft: '#fff4e6',
  
  text: {
    primary: '#1a1a1a',
    secondary: '#666666',
    light: '#999999',
  },
  
  white: '#ffffff',
  black: '#000000',
  
  success: '#19e65e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '300' as const,
    letterSpacing: 2,
  },
  h2: {
    fontSize: 24,
    fontWeight: '400' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};
EOF

# API configuration
cat > src/services/api.ts << 'EOF'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh or logout
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;
EOF

# Auth service
cat > src/services/auth.ts << 'EOF'
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  language_preference: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name: string;
    user_type: string;
  };
}

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    await this.saveTokens(response.data.data);
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    await this.saveTokens(response.data.data);
    return response.data.data;
  }

  async guestLogin(): Promise<AuthResponse> {
    const response = await api.post('/auth/guest');
    await this.saveTokens(response.data.data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('user');
  }

  private async saveTokens(data: AuthResponse): Promise<void> {
    await AsyncStorage.setItem('access_token', data.access_token);
    await AsyncStorage.setItem('refresh_token', data.refresh_token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  }

  async getUser(): Promise<any> {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('access_token');
    return !!token;
  }
}

export default new AuthService();
EOF

# Store configuration (Zustand)
cat > src/store/authStore.ts << 'EOF'
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  user_type: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setAuthenticated: (value) => set({ isAuthenticated: value }),
  setLoading: (value) => set({ isLoading: value }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
EOF

# Navigation setup
cat > src/navigation/AppNavigator.tsx << 'EOF'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import screens (create these later)
import LanguageScreen from '../screens/onboarding/LanguageScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import PlayerScreen from '../screens/player/PlayerScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#19e65e',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Player" component={PlayerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
EOF

# Create placeholder screens
print_status "Creating placeholder screens..."

# Language Selection Screen
cat > src/screens/onboarding/LanguageScreen.tsx << 'EOF'
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function LanguageScreen({ navigation }: any) {
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');

  const handleContinue = () => {
    // Save language preference
    navigation.navigate('Onboarding');
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandingContainer}>
        <Text style={styles.appName}>Mindfulness</Text>
        <Text style={styles.tagline}>Your journey to peace begins here</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.selectLabel}>Select Language</Text>

        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'en' && styles.selectedButton,
          ]}
          onPress={() => setSelectedLanguage('en')}
        >
          <View style={styles.languageInfo}>
            <View style={styles.languageCode}>
              <Text style={styles.codeText}>EN</Text>
            </View>
            <Text style={styles.languageText}>English</Text>
          </View>
          {selectedLanguage === 'en' && (
            <View style={styles.checkmark} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            selectedLanguage === 'hi' && styles.selectedButton,
          ]}
          onPress={() => setSelectedLanguage('hi')}
        >
          <View style={styles.languageInfo}>
            <View style={styles.languageCode}>
              <Text style={styles.codeText}>हि</Text>
            </View>
            <Text style={styles.languageText}>हिन्दी (Hindi)</Text>
          </View>
          {selectedLanguage === 'hi' && (
            <View style={styles.checkmark} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  brandingContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  appName: {
    ...Typography.h1,
    color: Colors.text.primary,
    textTransform: 'uppercase',
  },
  tagline: {
    ...Typography.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  contentContainer: {
    marginBottom: 60,
  },
  selectLabel: {
    ...Typography.caption,
    textAlign: 'center',
    color: Colors.primary,
    textTransform: 'uppercase',
    marginBottom: Spacing.lg,
  },
  languageButton: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedButton: {
    borderColor: Colors.primary,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageCode: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.mintSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  codeText: {
    ...Typography.body,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  languageText: {
    ...Typography.body,
    color: Colors.text.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    padding: Spacing.md,
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  continueText: {
    ...Typography.button,
    color: Colors.white,
  },
});

const BorderRadius = {
  lg: 16,
  full: 9999,
};
EOF

# Create other placeholder screens
for screen in "OnboardingScreen" "LoginScreen" "HomeScreen" "PlayerScreen" "ProfileScreen"; do
  dir=$(echo $screen | sed 's/Screen$//' | tr '[:upper:]' '[:lower:]')
  
  if [ "$screen" = "OnboardingScreen" ] || [ "$screen" = "LanguageScreen" ]; then
    dir="onboarding"
  elif [ "$screen" = "LoginScreen" ]; then
    dir="auth"
  elif [ "$screen" = "HomeScreen" ]; then
    dir="home"
  elif [ "$screen" = "PlayerScreen" ]; then
    dir="player"
  elif [ "$screen" = "ProfileScreen" ]; then
    dir="profile"
  fi
  
  cat > "src/screens/$dir/$screen.tsx" << EOF
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function $screen() {
  return (
    <View style={styles.container}>
      <Text>$screen - Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
EOF
done

print_success "Screens created"

# Update App.tsx
cat > App.tsx << 'EOF'
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}
EOF

# Update package.json scripts
npm pkg set scripts.start="expo start"
npm pkg set scripts.android="expo start --android"
npm pkg set scripts.ios="expo start --ios"
npm pkg set scripts.web="expo start --web"

print_success "✅ Mobile app initialized!"
echo ""
echo "📱 Next steps:"
echo "  1. cd meditation-app/mobile"
echo "  2. Update .env with your API URL"
echo "  3. npm start"
echo "  4. Press 'i' for iOS or 'a' for Android"
echo ""
echo "Project structure created at: meditation-app/mobile"
