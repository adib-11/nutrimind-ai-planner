// Profile-related TypeScript types

export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  location: string | null;
  supabaseAuthId?: string;
}

export interface Biometrics {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  targetWeight: number; // in kg
  activityLevel: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  bmi: number;
  bmr: number; // Basal Metabolic Rate in kcal/day
}

export interface HealthProfile {
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasHighCholesterol: boolean;
  hasGastritis: boolean;
}

export interface Preferences {
  dietType: string; // e.g., 'Vegetarian', 'Non-Vegetarian', 'Vegan'
  allergens: string[];
  spiceLevel: number; // 1-5 scale
  dailyBudget: number; // in BDT
  foodPreferences: string[]; // e.g., ['Bengali', 'Indian', 'Chinese']
}

export interface ProfileData {
  user: User;
  biometrics: Biometrics;
  healthProfile: HealthProfile;
  preferences: Preferences;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Update types for API requests
export interface UpdatePersonalDetailsInput {
  name?: string;
  phone?: string;
  location?: string;
}

export interface UpdateBiometricsInput {
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  height?: number;
  weight?: number;
  targetWeight?: number;
  activityLevel?: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
}

export interface UpdateHealthProfileInput {
  hasDiabetes?: boolean;
  hasHypertension?: boolean;
  hasHighCholesterol?: boolean;
  hasGastritis?: boolean;
}

export interface UpdatePreferencesInput {
  dietType?: string;
  allergens?: string[];
  spiceLevel?: number;
  dailyBudget?: number;
  foodPreferences?: string[];
}
