import { Wallet, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import type { Preferences } from "@/types/profile";

interface DietaryPreferencesCardProps {
  data: Preferences | null;
  editMode: boolean;
  onEdit: () => void;
  onSave: (data: Partial<Preferences>) => Promise<void>;
  onCancel: () => void;
}

export function DietaryPreferencesCard({
  data,
  editMode,
  onEdit,
  onSave,
  onCancel,
}: DietaryPreferencesCardProps) {
  const [formData, setFormData] = useState({
    dietType: data?.dietType || 'Non-Vegetarian',
    allergens: data?.allergens || [],
    spiceLevel: data?.spiceLevel || 3,
    dailyBudget: data?.dailyBudget || 250,
    foodPreferences: data?.foodPreferences || [],
  });
  const [newAllergen, setNewAllergen] = useState('');
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
      dietType: data?.dietType || 'Non-Vegetarian',
      allergens: data?.allergens || [],
      spiceLevel: data?.spiceLevel || 3,
      dailyBudget: data?.dailyBudget || 250,
      foodPreferences: data?.foodPreferences || [],
    });
    setNewAllergen('');
    onCancel();
  };

  const addAllergen = () => {
    if (newAllergen.trim() && !formData.allergens.includes(newAllergen.trim())) {
      setFormData({
        ...formData,
        allergens: [...formData.allergens, newAllergen.trim()],
      });
      setNewAllergen('');
    }
  };

  const removeAllergen = (allergen: string) => {
    setFormData({
      ...formData,
      allergens: formData.allergens.filter(a => a !== allergen),
    });
  };

  const displayData = editMode ? formData : data;
  if (!displayData) return null;

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Dietary Preferences
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

      {/* Budget Slider */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-muted-foreground">
          Daily Budget: <span className="text-primary font-bold">৳{displayData.dailyBudget}</span>
        </Label>
        {editMode ? (
          <div className="mt-4 px-2">
            <Slider
              value={[formData.dailyBudget]}
              onValueChange={(value) => setFormData({ ...formData, dailyBudget: value[0] })}
              min={100}
              max={1000}
              step={10}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.bg-primary]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>৳100</span>
              <span>৳1000</span>
            </div>
          </div>
        ) : (
          <p className="text-foreground font-medium mt-1">৳{displayData.dailyBudget}/day</p>
        )}
      </div>

      {/* Diet Type */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-muted-foreground">Diet Type</Label>
        {editMode ? (
          <Input
            value={formData.dietType}
            onChange={(e) => setFormData({ ...formData, dietType: e.target.value })}
            className="mt-1"
            placeholder="e.g., Vegetarian, Non-Vegetarian"
          />
        ) : (
          <p className="text-foreground font-medium mt-1">{displayData.dietType}</p>
        )}
      </div>

      {/* Spice Level */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-muted-foreground">
          Spice Level: <span className="text-primary font-bold">{displayData.spiceLevel}/5</span>
        </Label>
        {editMode ? (
          <div className="mt-4 px-2">
            <Slider
              value={[formData.spiceLevel]}
              onValueChange={(value) => setFormData({ ...formData, spiceLevel: value[0] })}
              min={1}
              max={5}
              step={1}
              className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary [&_.bg-primary]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Mild</span>
              <span>Very Spicy</span>
            </div>
          </div>
        ) : (
          <p className="text-foreground font-medium mt-1">{displayData.spiceLevel}/5</p>
        )}
      </div>

      {/* Allergens */}
      <div className="mb-6">
        <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
          Food Allergies & Restrictions
        </Label>
        <div className="flex flex-wrap gap-2 mb-3">
          {displayData.allergens.map((allergen) => (
            <span
              key={allergen}
              className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {allergen}
              {editMode && (
                <button
                  onClick={() => removeAllergen(allergen)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
          {displayData.allergens.length === 0 && (
            <p className="text-muted-foreground text-sm">No allergens specified</p>
          )}
        </div>
        {editMode && (
          <div className="flex gap-2">
            <Input
              placeholder="Add allergen (e.g., Peanuts)"
              value={newAllergen}
              onChange={(e) => setNewAllergen(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAllergen()}
              className="flex-1"
            />
            <Button
              onClick={addAllergen}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              Add
            </Button>
          </div>
        )}
      </div>

      {/* Food Preferences */}
      <div>
        <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
          Preferred Cuisines
        </Label>
        <div className="flex flex-wrap gap-2">
          {displayData.foodPreferences.map((pref) => (
            <span
              key={pref}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium"
            >
              {pref}
            </span>
          ))}
          {displayData.foodPreferences.length === 0 && (
            <p className="text-muted-foreground text-sm">No preferences specified</p>
          )}
        </div>
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
