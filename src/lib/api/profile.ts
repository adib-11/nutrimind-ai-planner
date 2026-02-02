import { supabase } from '@/lib/supabase';
import { calculateBMI, calculateBMR } from '@/lib/utils/biometrics';
import type {
  ApiResponse,
  ProfileData,
  UpdatePersonalDetailsInput,
  UpdateBiometricsInput,
  UpdateHealthProfileInput,
  UpdatePreferencesInput,
} from '@/types/profile';

/**
 * GET /api/me - Fetch complete user profile
 */
export async function getProfile(): Promise<ApiResponse<ProfileData>> {
  try {
    // Get current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: authError?.message || 'Not authenticated',
      };
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('User')
      .select('*')
      .eq('supabaseAuthId', user.id)
      .single();

    if (userError || !userData) {
      return {
        success: false,
        error: userError?.message || 'User not found',
      };
    }

    // Fetch biometrics separately (maybeSingle to avoid 406 if no row exists yet)
    const { data: biometricsData } = await supabase
      .from('Biometrics')
      .select('*')
      .eq('userId', userData.id)
      .maybeSingle();

    // Fetch health profile separately (maybeSingle to avoid 406 if no row exists yet)
    const { data: healthProfileData } = await supabase
      .from('HealthProfile')
      .select('*')
      .eq('userId', userData.id)
      .maybeSingle();

    // Fetch preferences separately (maybeSingle to avoid 406 if no row exists yet)
    const { data: preferencesData } = await supabase
      .from('Preferences')
      .select('*')
      .eq('userId', userData.id)
      .maybeSingle();

    // Extract and structure the data
    const profileData: ProfileData = {
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        location: userData.location,
      },
      biometrics: biometricsData || {
        age: 0,
        gender: 'Male' as const,
        height: 0,
        weight: 0,
        targetWeight: 0,
        activityLevel: 'Moderate' as const,
        bmi: 0,
        bmr: 0,
      },
      healthProfile: healthProfileData || {
        hasDiabetes: false,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      },
      preferences: preferencesData || {
        dietType: '',
        allergens: [],
        spiceLevel: 3,
        dailyBudget: 250,
        foodPreferences: [],
      },
    };

    return {
      success: true,
      data: profileData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * PUT /api/me - Update personal details
 */
export async function updatePersonalDetails(
  input: UpdatePersonalDetailsInput
): Promise<ApiResponse<void>> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    const { error } = await supabase
      .from('User')
      .update(input)
      .eq('supabaseAuthId', user.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * PUT /api/me/biometrics - Update biometrics and recalculate BMI/BMR
 */
export async function updateBiometrics(
  input: UpdateBiometricsInput
): Promise<ApiResponse<{ bmi: number; bmr: number; weight: number }>> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get user ID first
    const { data: userData } = await supabase
      .from('User')
      .select('id')
      .eq('supabaseAuthId', user.id)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    // Get current biometrics to fill in any missing values
    const { data: currentBiometrics } = await supabase
      .from('Biometrics')
      .select('*')
      .eq('userId', userData.id)
      .single();

    const current = currentBiometrics || {};
    
    // Merge current with input
    const weight = input.weight ?? current.weight ?? 70;
    const height = input.height ?? current.height ?? 170;
    const age = input.age ?? current.age ?? 25;
    const gender = input.gender ?? current.gender ?? 'Male';

    // Recalculate BMI and BMR
    const bmi = calculateBMI(weight, height);
    const bmr = calculateBMR(weight, height, age, gender);

    // Update biometrics with recalculated values
    const updateData = {
      ...input,
      bmi,
      bmr,
    };

    const { error } = await supabase
      .from('Biometrics')
      .update(updateData)
      .eq('userId', userData.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      data: { bmi, bmr, weight },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * PUT /api/me/health-profile - Update health conditions
 */
export async function updateHealthProfile(
  input: UpdateHealthProfileInput
): Promise<ApiResponse<void>> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get user ID first
    const { data: userData } = await supabase
      .from('User')
      .select('id')
      .eq('supabaseAuthId', user.id)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const { error } = await supabase
      .from('HealthProfile')
      .update(input)
      .eq('userId', userData.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * PUT /api/me/preferences - Update dietary preferences
 */
export async function updatePreferences(
  input: UpdatePreferencesInput
): Promise<ApiResponse<void>> {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return {
        success: false,
        error: 'Not authenticated',
      };
    }

    // Get user ID first
    const { data: userData } = await supabase
      .from('User')
      .select('id')
      .eq('supabaseAuthId', user.id)
      .single();

    if (!userData) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    const { error } = await supabase
      .from('Preferences')
      .update(input)
      .eq('userId', userData.id);

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
