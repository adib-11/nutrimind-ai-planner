import { z } from 'zod';

export const biometricsSchema = z.object({
  age: z
    .number({
      required_error: 'Age is required',
      invalid_type_error: 'Age must be a number',
    })
    .int('Age must be a whole number')
    .min(18, 'Age must be at least 18')
    .max(100, 'Age must be at most 100'),
  
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required',
  }),
  
  height: z
    .number({
      required_error: 'Height is required',
      invalid_type_error: 'Height must be a number',
    })
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height must be at most 250 cm')
    .refine((val) => val >= 100 && val <= 250, {
      message: 'Please enter realistic height values (100-250 cm)',
    }),
  
  weight: z
    .number({
      required_error: 'Weight is required',
      invalid_type_error: 'Weight must be a number',
    })
    .min(30, 'Weight must be at least 30 kg')
    .max(300, 'Weight must be at most 300 kg')
    .refine((val) => val >= 30 && val <= 300, {
      message: 'Please enter realistic weight values (30-300 kg)',
    }),
  
  targetWeight: z
    .number({
      required_error: 'Target weight is required',
      invalid_type_error: 'Target weight must be a number',
    })
    .min(30, 'Target weight must be at least 30 kg')
    .max(300, 'Target weight must be at most 300 kg')
    .refine((val) => val >= 30 && val <= 300, {
      message: 'Please enter realistic target weight values (30-300 kg)',
    }),
  
  activityLevel: z.enum(['Sedentary', 'Light', 'Moderate', 'Active', 'Very Active'], {
    required_error: 'Activity level is required',
  }),
});

export type BiometricsFormData = z.infer<typeof biometricsSchema>;
