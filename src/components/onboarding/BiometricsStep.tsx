import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, Activity, User as UserIcon, Ruler, Weight, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { biometricsSchema, type BiometricsFormData } from '@/lib/validations/biometrics';
import {
  calculateBMI,
  calculateBMR,
  getBMICategory,
  getBMICategoryColor,
  getBMICategoryBg,
} from '@/lib/utils/biometrics';
import type { BiometricsCalculations } from '@/types/biometrics';

interface BiometricsStepProps {
  onNext: (data: BiometricsFormData, calculations: BiometricsCalculations) => void;
}

export const BiometricsStep = ({ onNext }: BiometricsStepProps) => {
  const [calculations, setCalculations] = useState<BiometricsCalculations | null>(null);
  const [showResults, setShowResults] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<BiometricsFormData>({
    resolver: zodResolver(biometricsSchema),
    mode: 'onChange',
    defaultValues: {
      gender: 'Male',
      activityLevel: 'Moderate',
    },
  });

  const gender = watch('gender');
  const activityLevel = watch('activityLevel');

  const onSubmit = (data: BiometricsFormData) => {
    // AC3: Calculate BMI and BMR
    const bmi = calculateBMI(data.weight, data.height);
    const bmiCategory = getBMICategory(bmi);
    const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);

    const calcs: BiometricsCalculations = {
      bmi,
      bmiCategory,
      bmr,
    };

    setCalculations(calcs);
    setShowResults(true);

    // AC3: Save data and navigate to Step 2
    // Note: For MVP, we'll pass data to parent. In future stories, we'll save to database
    setTimeout(() => {
      onNext(data, calcs);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* AC1: Step indicator */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Step 1 of 3: Your Biometrics</h2>
        <p className="text-gray-600">
          Tell us about yourself so we can personalize your meal plans
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* AC2: Age input */}
        <div className="space-y-2">
          <Label htmlFor="age" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Age
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="e.g., 28"
            {...register('age', { valueAsNumber: true })}
            className={errors.age ? 'border-red-500' : ''}
          />
          {/* AC4: Validation errors */}
          {errors.age && (
            <p className="text-sm text-red-600">{errors.age.message}</p>
          )}
        </div>

        {/* AC2: Gender select */}
        <div className="space-y-2">
          <Label htmlFor="gender" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Gender
          </Label>
          <Select
            value={gender}
            onValueChange={(value) => setValue('gender', value as BiometricsFormData['gender'], { shouldValidate: true })}
          >
            <SelectTrigger id="gender" className={errors.gender ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>

        {/* AC2: Height input */}
        <div className="space-y-2">
          <Label htmlFor="height" className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Height (cm)
          </Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            placeholder="e.g., 175"
            {...register('height', { valueAsNumber: true })}
            className={errors.height ? 'border-red-500' : ''}
          />
          {/* AC4 & AC5: Validation errors */}
          {errors.height && (
            <p className="text-sm text-red-600">{errors.height.message}</p>
          )}
        </div>

        {/* AC2: Weight input */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="flex items-center gap-2">
            <Weight className="w-4 h-4" />
            Current Weight (kg)
          </Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            placeholder="e.g., 75"
            {...register('weight', { valueAsNumber: true })}
            className={errors.weight ? 'border-red-500' : ''}
          />
          {errors.weight && (
            <p className="text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>

        {/* AC2: Target Weight input */}
        <div className="space-y-2">
          <Label htmlFor="targetWeight" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Target Weight (kg)
          </Label>
          <Input
            id="targetWeight"
            type="number"
            step="0.1"
            placeholder="e.g., 70"
            {...register('targetWeight', { valueAsNumber: true })}
            className={errors.targetWeight ? 'border-red-500' : ''}
          />
          {errors.targetWeight && (
            <p className="text-sm text-red-600">{errors.targetWeight.message}</p>
          )}
        </div>

        {/* AC2: Activity Level select */}
        <div className="space-y-2">
          <Label htmlFor="activityLevel" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity Level
          </Label>
          <Select
            value={activityLevel}
            onValueChange={(value) => setValue('activityLevel', value as BiometricsFormData['activityLevel'], { shouldValidate: true })}
          >
            <SelectTrigger id="activityLevel" className={errors.activityLevel ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sedentary">Sedentary (little or no exercise)</SelectItem>
              <SelectItem value="Light">Light (exercise 1-3 days/week)</SelectItem>
              <SelectItem value="Moderate">Moderate (exercise 3-5 days/week)</SelectItem>
              <SelectItem value="Active">Active (exercise 6-7 days/week)</SelectItem>
              <SelectItem value="Very Active">Very Active (intense exercise daily)</SelectItem>
            </SelectContent>
          </Select>
          {errors.activityLevel && (
            <p className="text-sm text-red-600">{errors.activityLevel.message}</p>
          )}
        </div>

        {/* AC3: Display calculated BMI and BMR with visual indicators */}
        {showResults && calculations && (
          <Card className="border-2 border-[#C4D600] animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#C4D600]" />
                <h3 className="text-lg font-semibold">Your Health Metrics</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {/* BMI Display */}
                <div className={`p-4 rounded-lg ${getBMICategoryBg(calculations.bmiCategory)}`}>
                  <p className="text-sm text-gray-600 mb-1">Body Mass Index (BMI)</p>
                  <p className={`text-3xl font-bold ${getBMICategoryColor(calculations.bmiCategory)}`}>
                    {calculations.bmi}
                  </p>
                  <p className={`text-sm font-medium mt-1 ${getBMICategoryColor(calculations.bmiCategory)}`}>
                    {calculations.bmiCategory}
                  </p>
                </div>

                {/* BMR Display */}
                <div className="p-4 rounded-lg bg-blue-100">
                  <p className="text-sm text-gray-600 mb-1">Basal Metabolic Rate (BMR)</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculations.bmr}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">calories/day</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4 text-center">
                Calculating your personalized meal plan...
              </p>
            </CardContent>
          </Card>
        )}

        {/* AC4: Submit button (disabled when invalid) */}
        {!showResults && (
          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-[#C4D600] hover:bg-[#a8b800] text-gray-900"
          >
            Calculate & Continue
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        )}
      </form>
    </div>
  );
};
