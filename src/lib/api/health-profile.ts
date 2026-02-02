/**
 * Health Profile API Integration
 * Story 1.6: Onboarding Step 2 - Health Conditions
 * 
 * Provides functions to interact with the HealthProfile table in Supabase
 */

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { validateHealthProfile, type HealthProfileFormData } from '@/lib/validations/health-profile';
import type { HealthProfile, HealthProfileApiResponse } from '@/types/health-profile';

/**
 * Save health profile data to Supabase
 * POST /api/me/health-profile equivalent
 * 
 * AC3: Saves health conditions to database and navigates to Step 3
 * 
 * @param userId - The user ID to associate with the health profile
 * @param healthData - Health conditions data from the form
 * @returns Promise with API response containing saved health profile
 */
export const saveHealthProfile = async (
  userId: string,
  healthData: HealthProfileFormData
): Promise<HealthProfileApiResponse> => {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: {
          code: 'SUPABASE_NOT_CONFIGURED',
          message: 'Supabase is not configured. Please set up environment variables.',
        },
      };
    }

    // Validate health data
    const validatedData = validateHealthProfile(healthData);

    // Check if health profile already exists for this user
    const { data: existingProfile } = await supabase
      .from('HealthProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    let result;

    if (existingProfile) {
      // Update existing profile
      result = await supabase
        .from('HealthProfile')
        .update({
          ...validatedData,
          updatedAt: new Date().toISOString(),
        })
        .eq('userId', userId)
        .select()
        .single();
    } else {
      // Create new profile
      result = await supabase
        .from('HealthProfile')
        .insert({
          userId,
          ...validatedData,
        })
        .select()
        .single();
    }

    const { data, error } = result;

    if (error) {
      return {
        success: false,
        error: {
          code: error.code || 'DATABASE_ERROR',
          message: error.message || 'Failed to save health profile',
        },
      };
    }

    return {
      success: true,
      data: data as HealthProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    };
  }
};

/**
 * Get health profile data from Supabase
 * GET /api/me/health-profile equivalent
 * 
 * @param userId - The user ID to fetch health profile for
 * @returns Promise with API response containing health profile
 */
export const getHealthProfile = async (
  userId: string
): Promise<HealthProfileApiResponse> => {
  try {
    if (!isSupabaseConfigured()) {
      return {
        success: false,
        error: {
          code: 'SUPABASE_NOT_CONFIGURED',
          message: 'Supabase is not configured.',
        },
      };
    }

    const { data, error } = await supabase
      .from('HealthProfile')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      // If no profile exists yet, return default values
      if (error.code === 'PGRST116') {
        return {
          success: true,
          data: {
            id: '',
            userId,
            hasDiabetes: false,
            hasHypertension: false,
            hasHighCholesterol: false,
            hasGastritis: false,
            prescriptionImageUrl: null,
            createdAt: '',
            updatedAt: '',
          } as HealthProfile,
        };
      }

      return {
        success: false,
        error: {
          code: error.code || 'DATABASE_ERROR',
          message: error.message || 'Failed to fetch health profile',
        },
      };
    }

    return {
      success: true,
      data: data as HealthProfile,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'UNEXPECTED_ERROR',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      },
    };
  }
};
