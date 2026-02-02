import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProfile, updatePersonalDetails, updateBiometrics, updateHealthProfile, updatePreferences } from './profile';
import { supabase } from '@/lib/supabase';

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

describe('Profile API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch complete user profile with all related data', async () => {
      const mockUserId = 'user_123';
      const mockAuthUser = { id: mockUserId };
      
      // Mock auth
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: mockAuthUser as any },
        error: null,
      });

      // Mock User table query
      const mockUserData = {
        id: 'clx_user_123',
        email: 'adib@example.com',
        name: 'Adib Rahman',
        phone: '+8801712345678',
        location: 'Dhaka, Bangladesh',
      };

      const mockBiometricsData = {
        age: 28,
        gender: 'Male',
        height: 175,
        weight: 73,
        targetWeight: 70,
        activityLevel: 'Moderate',
        bmi: 23.8,
        bmr: 1720,
      };

      const mockHealthProfileData = {
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const mockPreferencesData = {
        dietType: 'Vegetarian',
        allergens: ['Peanuts'],
        spiceLevel: 4,
        dailyBudget: 250,
        foodPreferences: ['Bengali', 'Indian'],
      };

      // Setup mocks for separate queries
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call - User query (uses .single())
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: mockUserData,
              error: null,
            }),
          } as any;
        } else if (callCount === 2) {
          // Second call - Biometrics query (uses .maybeSingle())
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockBiometricsData,
              error: null,
            }),
          } as any;
        } else if (callCount === 3) {
          // Third call - HealthProfile query (uses .maybeSingle())
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockHealthProfileData,
              error: null,
            }),
          } as any;
        } else {
          // Fourth call - Preferences query (uses .maybeSingle())
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: mockPreferencesData,
              error: null,
            }),
          } as any;
        }
      });

      const result = await getProfile();

      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        user: mockUserData,
        biometrics: mockBiometricsData,
        healthProfile: mockHealthProfileData,
        preferences: mockPreferencesData,
      });
    });

    it('should return error when user is not authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' } as any,
      });

      const result = await getProfile();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Not authenticated');
    });
  });

  describe('updatePersonalDetails', () => {
    it('should update user personal details successfully', async () => {
      const mockUserId = 'user_123';
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: mockUserId } as any },
        error: null,
      });

      const updateData = {
        name: 'Adib Rahman',
        phone: '+8801712345678',
        location: 'Dhaka, Bangladesh',
      };

      const updateMock = vi.fn().mockReturnThis();
      const eqMock = vi.fn().mockResolvedValue({ error: null });

      vi.mocked(supabase.from).mockReturnValue({
        update: updateMock,
        eq: eqMock,
      } as any);

      const result = await updatePersonalDetails(updateData);

      expect(result.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(updateData);
    });
  });

  describe('updateBiometrics', () => {
    it('should update biometrics and recalculate BMI/BMR', async () => {
      const mockUserId = 'user_123';
      const mockInternalUserId = 'clx_user_123';
      
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: mockUserId } as any },
        error: null,
      });

      const updateData = {
        weight: 73,
        height: 175,
        age: 28,
        gender: 'Male' as const,
        targetWeight: 70,
        activityLevel: 'Moderate' as const,
      };

      // Setup mocks for queries
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call - Get User ID
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: mockInternalUserId },
              error: null,
            }),
          } as any;
        } else if (callCount === 2) {
          // Second call - Get current biometrics
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: {
                weight: 70,
                height: 170,
                age: 27,
                gender: 'Male',
              },
              error: null,
            }),
          } as any;
        } else {
          // Third call - UPDATE biometrics
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          } as any;
        }
      });

      const result = await updateBiometrics(updateData);

      expect(result.success).toBe(true);
      expect(result.data).toHaveProperty('bmi');
      expect(result.data).toHaveProperty('bmr');
      expect(result.data).toHaveProperty('weight');
      expect(result.data?.bmi).toBeCloseTo(23.8, 1);
      expect(result.data?.bmr).toBeGreaterThan(1500);
    });
  });

  describe('updateHealthProfile', () => {
    it('should update health conditions', async () => {
      const mockUserId = 'user_123';
      const mockInternalUserId = 'clx_user_123';
      
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: mockUserId } as any },
        error: null,
      });

      const updateData = {
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      // Setup mocks for queries
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call - Get User ID
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: mockInternalUserId },
              error: null,
            }),
          } as any;
        } else {
          // Second call - UPDATE health profile
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          } as any;
        }
      });

      const result = await updateHealthProfile(updateData);

      expect(result.success).toBe(true);
    });
  });

  describe('updatePreferences', () => {
    it('should update dietary preferences including budget', async () => {
      const mockUserId = 'user_123';
      const mockInternalUserId = 'clx_user_123';
      
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: mockUserId } as any },
        error: null,
      });

      const updateData = {
        dietType: 'Vegetarian',
        allergens: ['Peanuts'],
        spiceLevel: 4,
        dailyBudget: 300,
        foodPreferences: ['Bengali', 'Indian'],
      };

      // Setup mocks for queries
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // First call - Get User ID
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: mockInternalUserId },
              error: null,
            }),
          } as any;
        } else {
          // Second call - UPDATE preferences
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({
              error: null,
            }),
          } as any;
        }
      });

      const result = await updatePreferences(updateData);

      expect(result.success).toBe(true);
    });
  });
});
