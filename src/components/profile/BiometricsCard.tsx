import { Activity, Heart, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { calculateBMI, calculateBMR, getBMICategory } from "@/lib/utils/biometrics";
import type { Biometrics } from "@/types/profile";

interface BiometricsCardProps {
  data: Biometrics | null;
  editMode: boolean;
  onEdit: () => void;
  onSave: (data: Partial<Biometrics>) => Promise<void>;
  onCancel: () => void;
}

export function BiometricsCard({
  data,
  editMode,
  onEdit,
  onSave,
  onCancel,
}: BiometricsCardProps) {
  const [formData, setFormData] = useState({
    age: data?.age || 25,
    gender: data?.gender || ('Male' as 'Male' | 'Female' | 'Other'),
    height: data?.height || 170,
    weight: data?.weight || 70,
    targetWeight: data?.targetWeight || 65,
    activityLevel: data?.activityLevel || ('Moderate' as Biometrics['activityLevel']),
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      age: data?.age || 25,
      gender: data?.gender || 'Male',
      height: data?.height || 170,
      weight: data?.weight || 70,
      targetWeight: data?.targetWeight || 65,
      activityLevel: data?.activityLevel || 'Moderate',
    });
    onCancel();
  };

  const displayData = editMode ? formData : data;
  if (!displayData) {
    return (
      <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Biometrics
          </h3>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          No biometrics data available. Please complete onboarding.
        </div>
      </div>
    );
  }

  const bmi = calculateBMI(displayData.weight, displayData.height);
  const bmr = calculateBMR(displayData.weight, displayData.height, displayData.age, displayData.gender);
  const bmiCategory = getBMICategory(bmi);
  const bmiAngle = ((bmi - 15) / 25) * 180;

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          Biometrics
        </h3>
        {!editMode && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="h-8 w-8 text-muted-foreground hover:text-primary"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* BMI Gauge */}
      {!editMode && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Body Mass Index
          </h4>
          <div className="relative w-full h-24 flex items-center justify-center">
            <svg viewBox="0 0 200 100" className="w-full max-w-[180px]">
              <path
                d="M 20 90 A 70 70 0 0 1 180 90"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 20 90 A 70 70 0 0 1 60 35"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 60 35 A 70 70 0 0 1 140 35"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <path
                d="M 140 35 A 70 70 0 0 1 180 90"
                fill="none"
                stroke="#ef4444"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <line
                x1="100"
                y1="90"
                x2={100 + 50 * Math.cos((180 - (bmiAngle || 90)) * Math.PI / 180)}
                y2={90 - 50 * Math.sin((180 - (bmiAngle || 90)) * Math.PI / 180)}
                stroke="hsl(var(--foreground))"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="100" cy="90" r="6" fill="hsl(var(--foreground))" />
            </svg>
          </div>
          <div className="text-center mt-2">
            <span className="text-2xl font-bold text-foreground">{bmi?.toFixed(1) || 'N/A'}</span>
            <span className="text-sm text-primary ml-2 font-medium">({bmiCategory})</span>
          </div>
        </div>
      )}

      {/* Fields */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Age</Label>
          {editMode ? (
            <Input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
              className="mt-1"
              min="18"
              max="100"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.age} years</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Gender</Label>
          {editMode ? (
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData({ ...formData, gender: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.gender}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Height (cm)</Label>
          {editMode ? (
            <Input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) || 0 })}
              className="mt-1"
              min="100"
              max="250"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.height} cm</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Weight (kg)</Label>
          {editMode ? (
            <Input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
              className="mt-1"
              min="30"
              max="300"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.weight} kg</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Target Weight (kg)</Label>
          {editMode ? (
            <Input
              type="number"
              value={formData.targetWeight}
              onChange={(e) => setFormData({ ...formData, targetWeight: parseInt(e.target.value) || 0 })}
              className="mt-1"
              min="30"
              max="300"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.targetWeight} kg</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Activity Level</Label>
          {editMode ? (
            <Select
              value={formData.activityLevel}
              onValueChange={(value) => setFormData({ ...formData, activityLevel: value as any })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedentary">Sedentary</SelectItem>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Moderate">Moderate</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Very Active">Very Active</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="text-foreground font-medium mt-1">{displayData.activityLevel}</p>
          )}
        </div>
      </div>

      {/* BMR Display */}
      {!editMode && (
        <div className="mb-4 p-4 bg-muted/50 rounded-xl">
          <h4 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Basal Metabolic Rate
          </h4>
          <p className="text-2xl font-bold text-foreground">
            {bmr} <span className="text-sm font-normal text-muted-foreground">kcal/day</span>
          </p>
        </div>
      )}

      {/* Actions */}
      {editMode && (
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
