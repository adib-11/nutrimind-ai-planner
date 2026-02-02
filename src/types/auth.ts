import { User, Session } from '@supabase/supabase-js';

// User profile as stored in our custom User table
export interface UserProfile {
  id: string;
  supabaseAuthId: string;
  email: string;
  name?: string;
  authProvider: 'email' | 'google';
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth state for context
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth error types
export type AuthErrorCode = 
  | 'EMAIL_EXISTS'
  | 'INVALID_CREDENTIALS'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

// API response format
export interface AuthResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: AuthError;
}

// Registration response
export interface RegisterResponse {
  userId: string;
  email: string;
  needsOnboarding: boolean;
}
