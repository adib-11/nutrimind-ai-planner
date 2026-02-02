/**
 * Health Profile Types
 * Story 1.6: Onboarding Step 2 - Health Conditions
 */

export interface HealthConditions {
  hasDiabetes: boolean;
  hasHypertension: boolean;
  hasHighCholesterol: boolean;
  hasGastritis: boolean;
}

export interface HealthProfileFormData extends HealthConditions {
  // Form data matches the conditions structure
}

export interface HealthProfile extends HealthConditions {
  id: string;
  userId: string;
  prescriptionImageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface HealthProfileApiResponse {
  success: boolean;
  data?: HealthProfile;
  error?: {
    code: string;
    message: string;
  };
}
