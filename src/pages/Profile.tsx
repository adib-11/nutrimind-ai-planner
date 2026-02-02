import { useState, useEffect } from "react";
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
