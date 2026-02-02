import { User, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import type { User as UserType } from "@/types/profile";

interface PersonalDetailsCardProps {
  data: UserType | null;
  editMode: boolean;
  onEdit: () => void;
  onSave: (data: Partial<UserType>) => Promise<void>;
  onCancel: () => void;
}

export function PersonalDetailsCard({
  data,
  editMode,
  onEdit,
  onSave,
  onCancel,
}: PersonalDetailsCardProps) {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    phone: data?.phone || '',
    location: data?.location || '',
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
      name: data?.name || '',
      phone: data?.phone || '',
      location: data?.location || '',
    });
    onCancel();
  };

  if (!data) return null;

  return (
    <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Personal Details
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

      {/* Fields */}
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Name</Label>
          {editMode ? (
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{data.name || 'Not set'}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Email</Label>
          <p className="text-foreground font-medium mt-1">{data.email}</p>
          <p className="text-xs text-muted-foreground">Cannot be changed</p>
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Phone (Optional)</Label>
          {editMode ? (
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+8801712345678"
              className="mt-1"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{data.phone || 'Not set'}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-semibold text-muted-foreground">Location (Optional)</Label>
          {editMode ? (
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Dhaka, Bangladesh"
              className="mt-1"
            />
          ) : (
            <p className="text-foreground font-medium mt-1">{data.location || 'Not set'}</p>
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
