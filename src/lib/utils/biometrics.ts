import type { Gender, BMICategory } from '@/types/biometrics';

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / (height (m))²
 * 
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @returns BMI rounded to 1 decimal place
 */
export const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100;
  return parseFloat((weight / (heightInMeters ** 2)).toFixed(1));
};

/**
 * Get BMI category based on BMI value
 * 
 * Categories:
 * - Underweight: < 18.5
 * - Normal: 18.5 - 24.9
 * - Overweight: 25 - 29.9
 * - Obese: >= 30
 * 
 * @param bmi - BMI value
 * @returns BMI category
 */
export const getBMICategory = (bmi: number): BMICategory => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 18.5 && bmi < 25) return 'Normal';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  return 'Obese';
};

/**
 * Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
 * 
 * Formula:
 * - For men: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) + 5
 * - For women: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 161
 * - For other: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age) - 78 (average)
 * 
 * @param weight - Weight in kilograms
 * @param height - Height in centimeters
 * @param age - Age in years
 * @param gender - Gender (Male, Female, or Other)
 * @returns BMR rounded to nearest integer
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: Gender
): number => {
  const base = (10 * weight) + (6.25 * height) - (5 * age);
  
  if (gender === 'Male') {
    return Math.round(base + 5);
  } else if (gender === 'Female') {
    return Math.round(base - 161);
  } else {
    // For 'Other', use average of male and female formulas
    return Math.round(base - 78);
  }
};

/**
 * Get color for BMI category (for visual indicators)
 */
export const getBMICategoryColor = (category: BMICategory): string => {
  switch (category) {
    case 'Underweight':
      return 'text-blue-600';
    case 'Normal':
      return 'text-green-600';
    case 'Overweight':
      return 'text-yellow-600';
    case 'Obese':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

/**
 * Get background color for BMI category
 */
export const getBMICategoryBg = (category: BMICategory): string => {
  switch (category) {
    case 'Underweight':
      return 'bg-blue-100';
    case 'Normal':
      return 'bg-green-100';
    case 'Overweight':
      return 'bg-yellow-100';
    case 'Obese':
      return 'bg-red-100';
    default:
      return 'bg-gray-100';
  }
};
