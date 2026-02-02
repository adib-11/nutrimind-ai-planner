export type Gender = 'Male' | 'Female' | 'Other';

export type ActivityLevel = 
  | 'Sedentary' 
  | 'Light' 
  | 'Moderate' 
  | 'Active' 
  | 'Very Active';

export type BMICategory = 
  | 'Underweight' 
  | 'Normal' 
  | 'Overweight' 
  | 'Obese';

export interface BiometricsFormData {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
}

export interface BiometricsData extends BiometricsFormData {
  id: string;
  userId: string;
  bmi: number;
  bmr: number;
  createdAt: string;
  updatedAt: string;
}

export interface BiometricsCalculations {
  bmi: number;
  bmiCategory: BMICategory;
  bmr: number;
}

export interface BiometricsApiResponse {
  success: boolean;
  data?: BiometricsData;
  error?: {
    code: string;
    message: string;
  };
}
