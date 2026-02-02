import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BiometricsStep } from '@/components/onboarding/BiometricsStep';

describe('BiometricsStep Component', () => {
  const mockOnNext = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // AC1: Onboarding Entry - Step indicator
  describe('AC1: Step indicator and page title', () => {
    it('should display "Step 1 of 3: Your Biometrics" heading', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText(/Step 1 of 3: Your Biometrics/i)).toBeInTheDocument();
    });

    it('should display descriptive subtitle', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText(/Tell us about yourself/i)).toBeInTheDocument();
    });
  });

  // AC2: Biometric Form Display
  describe('AC2: Form displays all required fields', () => {
    it('should display age input field', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      const ageLabel = screen.getByText('Age');
      expect(ageLabel).toBeInTheDocument();
      
      const ageInput = screen.getByPlaceholderText(/e\.g\., 28/i);
      expect(ageInput).toBeInTheDocument();
      expect(ageInput).toHaveAttribute('type', 'number');
    });

    it('should display gender select field with all options', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText('Gender')).toBeInTheDocument();
      
      const genderSelect = screen.getByRole('combobox', { name: /gender/i });
      expect(genderSelect).toBeInTheDocument();
    });

    it('should display height input field in cm', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText('Height (cm)')).toBeInTheDocument();
      
      const heightInput = screen.getByPlaceholderText(/e\.g\., 175/i);
      expect(heightInput).toBeInTheDocument();
      expect(heightInput).toHaveAttribute('type', 'number');
    });

    it('should display current weight input field', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText('Current Weight (kg)')).toBeInTheDocument();
      
      const weightInput = screen.getByPlaceholderText(/e\.g\., 75/i);
      expect(weightInput).toBeInTheDocument();
    });

    it('should display target weight input field', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText('Target Weight (kg)')).toBeInTheDocument();
      
      const targetWeightInput = screen.getByPlaceholderText(/e\.g\., 70/i);
      expect(targetWeightInput).toBeInTheDocument();
    });

    it('should display activity level select field', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      expect(screen.getByText('Activity Level')).toBeInTheDocument();
      
      const activitySelect = screen.getByRole('combobox', { name: /activity level/i });
      expect(activitySelect).toBeInTheDocument();
    });

    it('should have submit button', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      expect(submitButton).toBeInTheDocument();
    });
  });

  // AC3: BMI/BMR Calculation
  describe('AC3: BMI and BMR calculation with visual indicators', () => {
    it('should calculate and display BMI correctly', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Fill in form with valid data
      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '175');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '75');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Your Health Metrics')).toBeInTheDocument();
      });

      // BMI should be 24.5 for 75kg at 175cm
      expect(screen.getByText('24.5')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    it('should calculate and display BMR correctly for male', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Fill in form (Male is default)
      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '175');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '75');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Basal Metabolic Rate (BMR)')).toBeInTheDocument();
      });

      // BMR should be 1709 for male 28yo, 75kg, 175cm
      expect(screen.getByText('1709')).toBeInTheDocument();
      expect(screen.getByText('calories/day')).toBeInTheDocument();
    });

    it('should show BMI category with color indicator', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '25');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '170');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '50'); // Underweight
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '55');

      await user.click(screen.getByRole('button', { name: /calculate & continue/i }));

      await waitFor(() => {
        expect(screen.getByText('Underweight')).toBeInTheDocument();
      });
    });

    it('should call onNext with calculated data after 2 seconds', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '175');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '75');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      // Wait for button to be enabled
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });

      await user.click(submitButton);

      // Wait for onNext to be called (2 second delay in component)
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledWith(
          expect.objectContaining({
            age: 28,
            gender: 'Male',
            height: 175,
            weight: 75,
            targetWeight: 70,
            activityLevel: 'Moderate',
          }),
          expect.objectContaining({
            bmi: 24.5,
            bmiCategory: 'Normal',
            bmr: 1709,
          })
        );
      }, { timeout: 3000 });
    });
  });

  // AC4: Field Validation
  describe('AC4: Required field validation', () => {
    it('should show validation error when age is empty', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Fill other required fields but leave age empty
      const ageInput = screen.getByPlaceholderText(/e\.g\., 28/i);
      const heightInput = screen.getByPlaceholderText(/e\.g\., 175/i);
      const weightInput = screen.getByPlaceholderText(/e\.g\., 75/i);
      const targetWeightInput = screen.getByPlaceholderText(/e\.g\., 70/i);

      await user.type(heightInput, '175');
      await user.type(weightInput, '75');
      await user.type(targetWeightInput, '70');

      // Focus and blur age field to trigger validation
      await user.click(ageInput);
      await user.tab();

      // Button should be disabled because age is required
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      expect(submitButton).toBeDisabled();
    });

    it('should disable submit button when form is invalid', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button when all fields are valid', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '175');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '75');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 10000 });
    });

    it('should show validation error when height is empty', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Fill other fields but leave height empty
      const heightInput = screen.getByPlaceholderText(/e\.g\., 175/i);
      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '75');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      // Focus and blur height field to trigger validation
      await user.click(heightInput);
      await user.tab();

      // Button should be disabled because height is required
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      expect(submitButton).toBeDisabled();
    });

    it('should show validation error when weight is empty', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Fill other fields but leave weight empty
      const weightInput = screen.getByPlaceholderText(/e\.g\., 75/i);
      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '28');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '175');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '70');

      // Focus and blur weight field to trigger validation
      await user.click(weightInput);
      await user.tab();

      // Button should be disabled because weight is required
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      expect(submitButton).toBeDisabled();
    });
  });

  // AC5: Realistic Value Validation
  describe('AC5: Realistic value validation', () => {
    it('should show error for age below 18', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const ageInput = screen.getByPlaceholderText(/e\.g\., 28/i);
      await user.type(ageInput, '15');

      await waitFor(() => {
        expect(screen.getByText(/Age must be at least 18/i)).toBeInTheDocument();
      });
    });

    it('should show error for age above 100', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const ageInput = screen.getByPlaceholderText(/e\.g\., 28/i);
      await user.type(ageInput, '105');

      await waitFor(() => {
        expect(screen.getByText(/Age must be at most 100/i)).toBeInTheDocument();
      });
    });

    it('should show error for unrealistic height (too low)', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const heightInput = screen.getByPlaceholderText(/e\.g\., 175/i);
      await user.type(heightInput, '50');

      await waitFor(() => {
        expect(screen.getByText(/Height must be at least 100/i)).toBeInTheDocument();
      });
    });

    it('should show error for unrealistic height (too high)', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const heightInput = screen.getByPlaceholderText(/e\.g\., 175/i);
      await user.type(heightInput, '500');

      await waitFor(() => {
        expect(screen.getByText(/Height must be at most 250/i)).toBeInTheDocument();
      });
    });

    it('should show error for unrealistic weight (too low)', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const weightInput = screen.getByPlaceholderText(/e\.g\., 75/i);
      await user.type(weightInput, '20');

      await waitFor(() => {
        expect(screen.getByText(/Weight must be at least 30/i)).toBeInTheDocument();
      });
    });

    it('should show error for unrealistic weight (too high)', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      const weightInput = screen.getByPlaceholderText(/e\.g\., 75/i);
      await user.type(weightInput, '350');

      await waitFor(() => {
        expect(screen.getByText(/Weight must be at most 300/i)).toBeInTheDocument();
      });
    });

    it('should accept valid realistic values within range', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '25');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '165');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '60');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '55');

      await waitFor(() => {
        const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
        expect(submitButton).not.toBeDisabled();
      });

      // Should not show any validation errors
      expect(screen.queryByText(/must be at least/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/must be at most/i)).not.toBeInTheDocument();
    });
  });

  describe('Gender and Activity Level selection', () => {
    it('should default to Male gender', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      const genderSelect = screen.getByRole('combobox', { name: /gender/i });
      expect(genderSelect).toHaveTextContent('Male');
    });

    it('should default to Moderate activity level', () => {
      render(<BiometricsStep onNext={mockOnNext} />);
      
      const activitySelect = screen.getByRole('combobox', { name: /activity level/i });
      expect(activitySelect).toHaveTextContent('Moderate');
    });
  });

  describe('Integration: Full form submission flow', () => {
    it('should complete full biometrics entry flow successfully', async () => {
      const user = userEvent.setup();
      render(<BiometricsStep onNext={mockOnNext} />);

      // Step 1: Verify form is displayed
      expect(screen.getByText(/Step 1 of 3: Your Biometrics/i)).toBeInTheDocument();

      // Step 2: Fill in all required fields
      await user.type(screen.getByPlaceholderText(/e\.g\., 28/i), '30');
      await user.type(screen.getByPlaceholderText(/e\.g\., 175/i), '180');
      await user.type(screen.getByPlaceholderText(/e\.g\., 75/i), '85');
      await user.type(screen.getByPlaceholderText(/e\.g\., 70/i), '75');

      // Step 3: Wait for form to be valid and submit
      const submitButton = screen.getByRole('button', { name: /calculate & continue/i });
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
      
      await user.click(submitButton);

      // Step 4: Verify calculations are displayed
      await waitFor(() => {
        expect(screen.getByText('Your Health Metrics')).toBeInTheDocument();
      });

      expect(screen.getByText('26.2')).toBeInTheDocument(); // BMI
      expect(screen.getByText('Overweight')).toBeInTheDocument();
      expect(screen.getByText('1830')).toBeInTheDocument(); // BMR

      // Step 5: Verify navigation callback is called with correct data (after 2 second delay)
      await waitFor(() => {
        expect(mockOnNext).toHaveBeenCalledTimes(1);
      }, { timeout: 3000 });
    });
  });
});
