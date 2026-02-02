import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MainLayout from "@/components/MainLayout";
import { PersonalDetailsCard } from "@/components/profile/PersonalDetailsCard";
import { BiometricsCard } from "@/components/profile/BiometricsCard";
import { HealthConditionsCard } from "@/components/profile/HealthConditionsCard";
import { DietaryPreferencesCard } from "@/components/profile/DietaryPreferencesCard";
import { useToast } from "@/hooks/use-toast";
import {
  getProfile,
  updatePersonalDetails,
  updateBiometrics,
  updateHealthProfile,
  updatePreferences,
} from "@/lib/api/profile";
import type { ProfileData } from "@/types/profile";

const Profile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    personal: false,
    biometrics: false,
    health: false,
    preferences: false,
  });
  const { toast } = useToast();

  // AC1: Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const result = await getProfile();
      
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        toast({
          title: "Error loading profile",
          description: result.error || "Could not load your profile data",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [toast]);

  // AC4: Update personal details
  const handleSavePersonalDetails = async (data: any) => {
    const result = await updatePersonalDetails(data);
    
    if (result.success) {
      toast({
        title: "Profile updated successfully",
        description: "Your personal details have been updated",
      });
      setEditMode({ ...editMode, personal: false });
      
      // Refresh profile
      const updatedProfile = await getProfile();
      if (updatedProfile.success && updatedProfile.data) {
        setProfile(updatedProfile.data);
      }
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Could not update personal details",
        variant: "destructive",
      });
    }
  };

  // AC2 & AC3: Update biometrics with BMI/BMR recalculation
  const handleSaveBiometrics = async (data: any) => {
    const result = await updateBiometrics(data);
    
    if (result.success) {
      toast({
        title: "Profile updated successfully",
        description: `Biometrics updated. New BMI: ${result.data?.bmi}, BMR: ${result.data?.bmr} kcal/day`,
      });
      setEditMode({ ...editMode, biometrics: false });
      
      // Refresh profile to show updated BMI gauge animation
      const updatedProfile = await getProfile();
      if (updatedProfile.success && updatedProfile.data) {
        setProfile(updatedProfile.data);
      }
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Could not update biometrics",
        variant: "destructive",
      });
    }
  };

  // AC6: Update health conditions
  const handleSaveHealthProfile = async (data: any) => {
    const result = await updateHealthProfile(data);
    
    if (result.success) {
      toast({
        title: "Profile updated successfully",
        description: "Your health conditions have been updated",
      });
      setEditMode({ ...editMode, health: false });
      
      // Refresh profile
      const updatedProfile = await getProfile();
      if (updatedProfile.success && updatedProfile.data) {
        setProfile(updatedProfile.data);
      }
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Could not update health profile",
        variant: "destructive",
      });
    }
  };

  // AC5: Update dietary preferences
  const handleSavePreferences = async (data: any) => {
    const result = await updatePreferences(data);
    
    if (result.success) {
      toast({
        title: "Profile updated successfully",
        description: "Your dietary preferences have been updated",
      });
      setEditMode({ ...editMode, preferences: false });
      
      // Refresh profile
      const updatedProfile = await getProfile();
      if (updatedProfile.success && updatedProfile.data) {
        setProfile(updatedProfile.data);
      }
    } else {
      toast({
        title: "Update failed",
        description: result.error || "Could not update preferences",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col overflow-auto p-6 md:p-10 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your health profile and dietary preferences</p>
        </div>

        {/* AC1: Four Cards Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Details Card */}
          <PersonalDetailsCard
            data={profile?.user || null}
            editMode={editMode.personal}
            onEdit={() => setEditMode({ ...editMode, personal: true })}
            onSave={handleSavePersonalDetails}
            onCancel={() => setEditMode({ ...editMode, personal: false })}
          />

          {/* Biometrics Card - AC2: Edit biometrics, AC3: BMI/BMR recalculation */}
          <BiometricsCard
            data={profile?.biometrics || null}
            editMode={editMode.biometrics}
            onEdit={() => setEditMode({ ...editMode, biometrics: true })}
            onSave={handleSaveBiometrics}
            onCancel={() => setEditMode({ ...editMode, biometrics: false })}
          />

          {/* Health Conditions Card - AC6: Toggle health conditions */}
          <HealthConditionsCard
            data={profile?.healthProfile || null}
            editMode={editMode.health}
            onEdit={() => setEditMode({ ...editMode, health: true })}
            onSave={handleSaveHealthProfile}
            onCancel={() => setEditMode({ ...editMode, health: false })}
          />

          {/* Dietary Preferences Card - AC5: Update preferences */}
          <DietaryPreferencesCard
            data={profile?.preferences || null}
            editMode={editMode.preferences}
            onEdit={() => setEditMode({ ...editMode, preferences: true })}
            onSave={handleSavePreferences}
            onCancel={() => setEditMode({ ...editMode, preferences: false })}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
      <div className="flex-1 flex flex-col overflow-auto p-6 md:p-10 pb-24">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Profile & Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your health profile and dietary preferences</p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Identity Card */}
          <div className="lg:col-span-1">
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg h-full">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">Adib Hasan</h2>
                <p className="text-muted-foreground">23 Years, Male</p>
              </div>

              {/* BMI Gauge */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Body Mass Index
                </h3>
                <div className="relative w-full h-24 flex items-center justify-center">
                  <svg viewBox="0 0 200 100" className="w-full max-w-[180px]">
                    {/* Background arc */}
                    <path
                      d="M 20 90 A 70 70 0 0 1 180 90"
                      fill="none"
                      stroke="hsl(var(--muted))"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    {/* Colored segments */}
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
                    {/* Needle */}
                    <line
                      x1="100"
                      y1="90"
                      x2={100 + 50 * Math.cos((180 - bmiAngle) * Math.PI / 180)}
                      y2={90 - 50 * Math.sin((180 - bmiAngle) * Math.PI / 180)}
                      stroke="hsl(var(--foreground))"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="90" r="6" fill="hsl(var(--foreground))" />
                  </svg>
                </div>
                <div className="text-center mt-2">
                  <span className="text-2xl font-bold text-foreground">{bmi}</span>
                  <span className="text-sm text-primary ml-2 font-medium">(Normal)</span>
                </div>
              </div>

              {/* BMR */}
              <div className="mb-6 p-4 bg-muted/50 rounded-xl">
                <h3 className="text-sm font-semibold text-muted-foreground mb-1 flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Basal Metabolic Rate
                </h3>
                <p className="text-2xl font-bold text-foreground">1501 <span className="text-sm font-normal text-muted-foreground">kcal/day</span></p>
              </div>

              {/* Edit Profile Button */}
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Right Columns - Health & Diet Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Conditions */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Health Conditions
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(healthConditions).map(([key, value]) => (
                  <div 
                    key={key}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-foreground capitalize">
                        {key === "diabetes" ? "Diabetes (Type 2)" : 
                         key === "cholesterol" ? "High Cholesterol" : 
                         key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      {value && key === "diabetes" && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                          Sugar Restricted
                        </span>
                      )}
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={() => toggleCondition(key as keyof typeof healthConditions)}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Budget & Preferences */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                Dietary Constraints
              </h3>
              
              {/* Budget Slider */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-muted-foreground">
                  Daily Budget Limit: <span className="text-primary font-bold">৳{budget[0]}</span>
                </Label>
                <div className="mt-4 px-2">
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
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
              </div>

              {/* Allergies */}
              <div>
                <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                  Food Allergies & Restrictions
                </Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {allergies.map((allergy) => (
                    <span 
                      key={allergy}
                      className="inline-flex items-center gap-1 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {allergy}
                      <button 
                        onClick={() => removeAllergy(allergy)}
                        className="hover:bg-destructive/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add allergy (e.g., Peanuts)"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAllergy()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={addAllergy}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Prescription Upload */}
            <div className="bg-background/80 backdrop-blur-md rounded-3xl p-6 border border-border/30 shadow-lg">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-primary" />
                Prescription Upload
              </h3>
              <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
                <UploadCloud className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                <p className="font-semibold text-foreground mb-1">Upload Doctor's Prescription</p>
                <p className="text-sm text-muted-foreground">AI will automatically extract diet restrictions</p>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG or PDF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button - Sticky Footer */}
        <div className="sticky bottom-0 left-0 right-0 mt-8 pt-6 pb-2 bg-gradient-to-t from-background/80 to-transparent -mx-6 md:-mx-10 px-6 md:px-10">
          <Button 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-xl text-lg shadow-lg"
          >
            Save & Regenerate Plan
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
