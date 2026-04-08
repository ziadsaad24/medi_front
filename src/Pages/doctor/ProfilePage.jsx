import React from "react";
import DoctorLayout from "../../Components/DoctorLayout";
import { ProfileHeroSection } from "../../Components/ProfileHeroSection";
import { ChangePassword } from "../../Components/ChangePassword";
import ProfileCompletionAlert from "../../Components/ProfileCompletionAlert";
import { useProfile } from "../../context/ProfileContext";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile(); // استخدام الـ context مباشرة

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-5 md:p-6 lg:p-8 min-h-full space-y-6 theme-page">
        {/* Hero Section */}
        <ProfileHeroSection 
          profile={profile} 
          setProfile={setProfile} 
          className="w-full max-w-full sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto" 
        />

        {/* Completion Alert */}
        <ProfileCompletionAlert 
          className="w-full max-w-full sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto"
        />

        {/* Change Password */}
        <ChangePassword 
          className="w-full max-w-full sm:max-w-[90%] md:max-w-[85%] lg:max-w-[80%] mx-auto"
        />
      </div>
    </DoctorLayout>
  );
}