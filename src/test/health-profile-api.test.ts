/**
 * Health Profile API Integration Tests
 * Story 1.6: Onboarding Step 2 - Health Conditions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveHealthProfile, getHealthProfile } from '@/lib/api/health-profile';
import { supabase } from '@/lib/supabase';
import type { HealthProfileFormData } from '@/lib/validations/health-profile';

// Mock the supabase client
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
  isSupabaseConfigured: vi.fn(() => true),
}));

describe('Health Profile API Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('saveHealthProfile', () => {
    const mockUserId = 'test-user-123';
    const validHealthData: HealthProfileFormData = {
      hasDiabetes: true,
      hasHypertension: false,
      hasHighCholesterol: true,
      hasGastritis: false,
    };

    it('should successfully save new health profile (AC3)', async () => {
      const mockHealthProfile = {
        id: 'health-profile-123',
        userId: mockUserId,
        ...validHealthData,
        prescriptionImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock no existing profile
      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      // Mock successful insert
      const mockInsertChain = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockHealthProfile, error: null }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
            insert: vi.fn(() => mockInsertChain),
          } as any;
        }
        return {} as any;
      });

      const result = await saveHealthProfile(mockUserId, validHealthData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockHealthProfile);
      expect(result.data?.hasDiabetes).toBe(true);
      expect(result.data?.hasHighCholesterol).toBe(true);
    });

    it('should successfully update existing health profile', async () => {
      const existingProfile = { id: 'existing-123' };
      const updatedProfile = {
        id: 'existing-123',
        userId: mockUserId,
        ...validHealthData,
        prescriptionImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Mock existing profile found
      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: existingProfile, error: null }),
      };

      // Mock successful update
      const mockUpdateChain = {
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: updatedProfile, error: null }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
            update: vi.fn(() => mockUpdateChain),
          } as any;
        }
        return {} as any;
      });

      const result = await saveHealthProfile(mockUserId, validHealthData);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe('existing-123');
    });

    it('should handle Skip scenario - all conditions false (AC4)', async () => {
      const skipData: HealthProfileFormData = {
        hasDiabetes: false,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const mockHealthProfile = {
        id: 'health-profile-456',
        userId: mockUserId,
        ...skipData,
        prescriptionImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      const mockInsertChain = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockHealthProfile, error: null }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
            insert: vi.fn(() => mockInsertChain),
          } as any;
        }
        return {} as any;
      });

      const result = await saveHealthProfile(mockUserId, skipData);

      expect(result.success).toBe(true);
      expect(result.data?.hasDiabetes).toBe(false);
      expect(result.data?.hasHypertension).toBe(false);
      expect(result.data?.hasHighCholesterol).toBe(false);
      expect(result.data?.hasGastritis).toBe(false);
    });

    it('should return error when database insert fails', async () => {
      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      const mockInsertChain = {
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'DB_ERROR', message: 'Database error' } 
        }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
            insert: vi.fn(() => mockInsertChain),
          } as any;
        }
        return {} as any;
      });

      const result = await saveHealthProfile(mockUserId, validHealthData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('DB_ERROR');
    });

    it('should validate health data before saving', async () => {
      const invalidData = {
        hasDiabetes: 'not a boolean' as any,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const result = await saveHealthProfile(mockUserId, invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('getHealthProfile', () => {
    const mockUserId = 'test-user-123';

    it('should successfully retrieve existing health profile', async () => {
      const mockHealthProfile = {
        id: 'health-profile-123',
        userId: mockUserId,
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: true,
        hasGastritis: true,
        prescriptionImageUrl: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockHealthProfile, error: null }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
          } as any;
        }
        return {} as any;
      });

      const result = await getHealthProfile(mockUserId);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockHealthProfile);
      expect(result.data?.hasDiabetes).toBe(true);
      expect(result.data?.hasGastritis).toBe(true);
    });

    it('should return default values when no health profile exists', async () => {
      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'PGRST116', message: 'No rows found' } 
        }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
          } as any;
        }
        return {} as any;
      });

      const result = await getHealthProfile(mockUserId);

      expect(result.success).toBe(true);
      expect(result.data?.hasDiabetes).toBe(false);
      expect(result.data?.hasHypertension).toBe(false);
      expect(result.data?.hasHighCholesterol).toBe(false);
      expect(result.data?.hasGastritis).toBe(false);
    });

    it('should return error for other database errors', async () => {
      const mockSelectChain = {
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { code: 'DB_ERROR', message: 'Database connection failed' } 
        }),
      };

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        if (table === 'HealthProfile') {
          return {
            select: vi.fn(() => mockSelectChain),
          } as any;
        }
        return {} as any;
      });

      const result = await getHealthProfile(mockUserId);

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error?.code).toBe('DB_ERROR');
    });
  });
});
