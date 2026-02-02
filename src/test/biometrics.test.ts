import { describe, it, expect } from 'vitest';
import { calculateBMI, calculateBMR, getBMICategory } from '@/lib/utils/biometrics';

describe('Biometrics Utility Functions', () => {
  describe('calculateBMI', () => {
    it('should calculate BMI correctly for normal values', () => {
      // weight: 75kg, height: 175cm
      const bmi = calculateBMI(75, 175);
      expect(bmi).toBe(24.5);
    });

    it('should calculate BMI for underweight person', () => {
      // weight: 50kg, height: 170cm
      const bmi = calculateBMI(50, 170);
      expect(bmi).toBe(17.3);
    });

    it('should calculate BMI for overweight person', () => {
      // weight: 85kg, height: 170cm
      const bmi = calculateBMI(85, 170);
      expect(bmi).toBe(29.4);
    });

    it('should calculate BMI for obese person', () => {
      // weight: 100kg, height: 170cm
      const bmi = calculateBMI(100, 170);
      expect(bmi).toBe(34.6);
    });

    it('should round to 1 decimal place', () => {
      // weight: 70.5kg, height: 172.5cm
      const bmi = calculateBMI(70.5, 172.5);
      expect(bmi.toString().split('.')[1]?.length || 0).toBeLessThanOrEqual(1);
    });

    it('should handle edge case: minimum realistic values', () => {
      // weight: 30kg, height: 100cm
      const bmi = calculateBMI(30, 100);
      expect(bmi).toBe(30.0);
    });

    it('should handle edge case: maximum realistic values', () => {
      // weight: 300kg, height: 250cm
      const bmi = calculateBMI(300, 250);
      expect(bmi).toBe(48.0);
    });
  });

  describe('getBMICategory', () => {
    it('should categorize as Underweight for BMI < 18.5', () => {
      expect(getBMICategory(17.0)).toBe('Underweight');
      expect(getBMICategory(18.4)).toBe('Underweight');
    });

    it('should categorize as Normal for BMI 18.5-24.9', () => {
      expect(getBMICategory(18.5)).toBe('Normal');
      expect(getBMICategory(22.0)).toBe('Normal');
      expect(getBMICategory(24.9)).toBe('Normal');
    });

    it('should categorize as Overweight for BMI 25-29.9', () => {
      expect(getBMICategory(25.0)).toBe('Overweight');
      expect(getBMICategory(27.5)).toBe('Overweight');
      expect(getBMICategory(29.9)).toBe('Overweight');
    });

    it('should categorize as Obese for BMI >= 30', () => {
      expect(getBMICategory(30.0)).toBe('Obese');
      expect(getBMICategory(35.0)).toBe('Obese');
      expect(getBMICategory(40.0)).toBe('Obese');
    });
  });

  describe('calculateBMR', () => {
    describe('Male BMR calculation', () => {
      it('should calculate BMR correctly for adult male', () => {
        // weight: 75kg, height: 175cm, age: 28
        const bmr = calculateBMR(75, 175, 28, 'Male');
        // (10 * 75) + (6.25 * 175) - (5 * 28) + 5
        // = 750 + 1093.75 - 140 + 5 = 1708.75 -> 1709
        expect(bmr).toBe(1709);
      });

      it('should calculate BMR for younger male', () => {
        // weight: 70kg, height: 180cm, age: 20
        const bmr = calculateBMR(70, 180, 20, 'Male');
        // (10 * 70) + (6.25 * 180) - (5 * 20) + 5
        // = 700 + 1125 - 100 + 5 = 1730
        expect(bmr).toBe(1730);
      });

      it('should calculate BMR for older male', () => {
        // weight: 80kg, height: 175cm, age: 50
        const bmr = calculateBMR(80, 175, 50, 'Male');
        // (10 * 80) + (6.25 * 175) - (5 * 50) + 5
        // = 800 + 1093.75 - 250 + 5 = 1648.75 -> 1649
        expect(bmr).toBe(1649);
      });
    });

    describe('Female BMR calculation', () => {
      it('should calculate BMR correctly for adult female', () => {
        // weight: 65kg, height: 165cm, age: 28
        const bmr = calculateBMR(65, 165, 28, 'Female');
        // (10 * 65) + (6.25 * 165) - (5 * 28) - 161
        // = 650 + 1031.25 - 140 - 161 = 1380.25 -> 1380
        expect(bmr).toBe(1380);
      });

      it('should calculate BMR for younger female', () => {
        // weight: 60kg, height: 160cm, age: 22
        const bmr = calculateBMR(60, 160, 22, 'Female');
        // (10 * 60) + (6.25 * 160) - (5 * 22) - 161
        // = 600 + 1000 - 110 - 161 = 1329
        expect(bmr).toBe(1329);
      });

      it('should calculate BMR for older female', () => {
        // weight: 70kg, height: 165cm, age: 55
        const bmr = calculateBMR(70, 165, 55, 'Female');
        // (10 * 70) + (6.25 * 165) - (5 * 55) - 161
        // = 700 + 1031.25 - 275 - 161 = 1295.25 -> 1295
        expect(bmr).toBe(1295);
      });
    });

    describe('Other gender BMR calculation', () => {
      it('should calculate BMR using average formula for Other gender', () => {
        // weight: 70kg, height: 170cm, age: 30
        const bmr = calculateBMR(70, 170, 30, 'Other');
        // (10 * 70) + (6.25 * 170) - (5 * 30) - 78
        // = 700 + 1062.5 - 150 - 78 = 1534.5 -> 1535
        expect(bmr).toBe(1535);
      });

      it('should calculate BMR between male and female values', () => {
        const weight = 70;
        const height = 170;
        const age = 30;
        
        const maleBMR = calculateBMR(weight, height, age, 'Male');
        const femaleBMR = calculateBMR(weight, height, age, 'Female');
        const otherBMR = calculateBMR(weight, height, age, 'Other');

        // Other should be approximately between male and female
        expect(otherBMR).toBeGreaterThan(femaleBMR);
        expect(otherBMR).toBeLessThan(maleBMR);
      });
    });

    describe('Edge cases', () => {
      it('should handle minimum age (18)', () => {
        const bmr = calculateBMR(60, 165, 18, 'Female');
        expect(bmr).toBeGreaterThan(0);
        expect(Number.isInteger(bmr)).toBe(true);
      });

      it('should handle maximum age (100)', () => {
        const bmr = calculateBMR(70, 170, 100, 'Male');
        expect(bmr).toBeGreaterThan(0);
        expect(Number.isInteger(bmr)).toBe(true);
      });

      it('should handle minimum weight (30kg)', () => {
        const bmr = calculateBMR(30, 150, 25, 'Female');
        expect(bmr).toBeGreaterThan(0);
      });

      it('should handle maximum weight (300kg)', () => {
        const bmr = calculateBMR(300, 200, 40, 'Male');
        expect(bmr).toBeGreaterThan(0);
      });

      it('should always return an integer', () => {
        const bmr1 = calculateBMR(75.5, 175.7, 28, 'Male');
        const bmr2 = calculateBMR(65.3, 165.2, 32, 'Female');
        const bmr3 = calculateBMR(70.8, 170.4, 27, 'Other');
        
        expect(Number.isInteger(bmr1)).toBe(true);
        expect(Number.isInteger(bmr2)).toBe(true);
        expect(Number.isInteger(bmr3)).toBe(true);
      });
    });

    describe('BMR decreases with age', () => {
      it('should calculate lower BMR for older person with same weight/height', () => {
        const weight = 70;
        const height = 170;
        
        const bmr25 = calculateBMR(weight, height, 25, 'Male');
        const bmr50 = calculateBMR(weight, height, 50, 'Male');
        
        expect(bmr50).toBeLessThan(bmr25);
        expect(bmr25 - bmr50).toBe(125); // 5 calories per year * 25 years
      });
    });
  });
});
