/**
 * Health Profile Validation Schemas
 * Story 1.6: Onboarding Step 2 - Health Conditions
 */

import { z } from 'zod';

/**
 * Health Profile Form Data Schema
 * Validates health conditions input from onboarding
 */
export const healthProfileSchema = z.object({
  hasDiabetes: z.boolean().default(false),
  hasHypertension: z.boolean().default(false),
  hasHighCholesterol: z.boolean().default(false),
  hasGastritis: z.boolean().default(false),
});

export type HealthProfileFormData = z.infer<typeof healthProfileSchema>;

/**
 * Validates health profile form data
 * @param data - Health conditions to validate
 * @returns Validated health profile data
 */
export const validateHealthProfile = (data: unknown): HealthProfileFormData => {
  return healthProfileSchema.parse(data);
};

/**
 * Safely validates health profile data without throwing
 * @param data - Health conditions to validate
 * @returns Success/error result
 */
export const safeValidateHealthProfile = (data: unknown) => {
  return healthProfileSchema.safeParse(data);
};
