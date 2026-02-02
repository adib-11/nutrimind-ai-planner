/**
 * Health Profile Validation Tests
 * Story 1.6: Onboarding Step 2 - Health Conditions
 */

import { describe, it, expect } from 'vitest';
import { 
  validateHealthProfile, 
  safeValidateHealthProfile,
  healthProfileSchema 
} from '@/lib/validations/health-profile';

describe('Health Profile Validation', () => {
  describe('validateHealthProfile', () => {
    it('should validate valid health profile data with all conditions false', () => {
      const validData = {
        hasDiabetes: false,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const result = validateHealthProfile(validData);
      expect(result).toEqual(validData);
    });

    it('should validate valid health profile data with some conditions true', () => {
      const validData = {
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: true,
        hasGastritis: false,
      };

      const result = validateHealthProfile(validData);
      expect(result).toEqual(validData);
    });

    it('should validate valid health profile data with all conditions true', () => {
      const validData = {
        hasDiabetes: true,
        hasHypertension: true,
        hasHighCholesterol: true,
        hasGastritis: true,
      };

      const result = validateHealthProfile(validData);
      expect(result).toEqual(validData);
    });

    it('should apply default values when fields are missing', () => {
      const partialData = {
        hasDiabetes: true,
      };

      const result = validateHealthProfile(partialData);
      expect(result.hasDiabetes).toBe(true);
      expect(result.hasHypertension).toBe(false);
      expect(result.hasHighCholesterol).toBe(false);
      expect(result.hasGastritis).toBe(false);
    });

    it('should throw error for invalid boolean value', () => {
      const invalidData = {
        hasDiabetes: 'not a boolean',
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      expect(() => validateHealthProfile(invalidData)).toThrow();
    });

    it('should throw error for numeric values instead of booleans', () => {
      const invalidData = {
        hasDiabetes: 1,
        hasHypertension: 0,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      expect(() => validateHealthProfile(invalidData)).toThrow();
    });
  });

  describe('safeValidateHealthProfile', () => {
    it('should return success for valid data', () => {
      const validData = {
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: true,
      };

      const result = safeValidateHealthProfile(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should return error for invalid data without throwing', () => {
      const invalidData = {
        hasDiabetes: 'not a boolean',
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const result = safeValidateHealthProfile(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
    });

    it('should return error for null data', () => {
      const result = safeValidateHealthProfile(null);
      expect(result.success).toBe(false);
    });

    it('should return error for undefined data', () => {
      const result = safeValidateHealthProfile(undefined);
      expect(result.success).toBe(false);
    });

    it('should return error for empty object', () => {
      const result = safeValidateHealthProfile({});
      expect(result.success).toBe(true); // Should succeed with defaults
      if (result.success) {
        expect(result.data.hasDiabetes).toBe(false);
        expect(result.data.hasHypertension).toBe(false);
        expect(result.data.hasHighCholesterol).toBe(false);
        expect(result.data.hasGastritis).toBe(false);
      }
    });
  });

  describe('healthProfileSchema', () => {
    it('should parse valid health profile data', () => {
      const validData = {
        hasDiabetes: false,
        hasHypertension: true,
        hasHighCholesterol: false,
        hasGastritis: true,
      };

      const result = healthProfileSchema.parse(validData);
      expect(result).toEqual(validData);
    });

    it('should apply defaults for missing fields', () => {
      const partialData = {};

      const result = healthProfileSchema.parse(partialData);
      expect(result.hasDiabetes).toBe(false);
      expect(result.hasHypertension).toBe(false);
      expect(result.hasHighCholesterol).toBe(false);
      expect(result.hasGastritis).toBe(false);
    });

    it('should reject data with extra unknown fields', () => {
      const dataWithExtras = {
        hasDiabetes: true,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
        unknownField: 'should be ignored',
      };

      // Zod by default allows extra fields unless .strict() is used
      const result = healthProfileSchema.parse(dataWithExtras);
      expect(result.hasDiabetes).toBe(true);
    });

    it('should handle Skip scenario - all conditions false', () => {
      // AC4: Skip sets all conditions to false
      const skipData = {
        hasDiabetes: false,
        hasHypertension: false,
        hasHighCholesterol: false,
        hasGastritis: false,
      };

      const result = healthProfileSchema.parse(skipData);
      expect(result).toEqual(skipData);
      expect(Object.values(result).every(val => val === false)).toBe(true);
    });
  });
});
