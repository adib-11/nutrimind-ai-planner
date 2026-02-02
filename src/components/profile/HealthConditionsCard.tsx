import { Pill, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import type { HealthProfile } from "@/types/profile";

interface HealthConditionsCardProps {
  data: HealthProfile | null;
  editMode: boolean;
  onEdit: () => void;
  onSave: (data: Partial<HealthProfile>) => Promise<void>;
  onCancel: () => void;
}

export function HealthConditionsCard({
  data,
  editMode,
  onEdit,
  onSave,
  onCancel,
}: HealthConditionsCardProps) {
  const [formData, setFormData] = useState({
    hasDiabetes: data?.hasDiabetes || false,
    hasHypertension: data?.hasHypertension || false,
    hasHighCholesterol: data?.hasHighCholesterol || false,
    hasGastritis: data?.hasGastritis || false,
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
      hasDiabetes: data?.hasDiabetes || false,
      hasHypertension: data?.hasHypertension || false,
      hasHighCholesterol: data?.hasHighCholesterol || false,
      hasGastritis: data?.hasGastritis || false,
    });
    onCancel();
  };

  const toggleCondition = (condition: keyof typeof formData) => {
    setFormData(prev => ({ ...prev, [condition]: !prev[condition] }));
  };

  const displayData = editMode ? formData : data;
  if (!displayData) return null;

  const healthConditions = [
    { key: 'hasDiabetes' as const, label: 'Diabetes (Type 2)', tag: displayData.hasDiabetes ? 'Sugar Restricted' : null },
    { key: 'hasHypertension' as const, label: 'Hypertension', tag: displayData.hasHypertension ? 'Salt Restricted' : null },
    { key: 'hasHighCholesterol' as const, label: 'High Cholesterol', tag: displayData.hasHighCholesterol ? 'Low Fat' : null },
    { key: 'hasGastritis' as const, label: 'Gastritis', tag: displayData.hasGastritis ? 'Mild Foods' : null },
  ];

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Pill className="w-5 h-5 text-primary" />
          Health Conditions
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

      {/* Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {healthConditions.map(({ key, label, tag }) => (
          <div
            key={key}
            className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-foreground">{label}</span>
              {tag && (
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium w-fit">
                  {tag}
                </span>
              )}
            </div>
            <Switch
              checked={displayData[key]}
              onCheckedChange={() => editMode && toggleCondition(key)}
              disabled={!editMode}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      {editMode && (
        <div className="flex gap-2 mt-6">
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
