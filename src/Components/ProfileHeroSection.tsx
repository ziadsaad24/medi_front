import React, { useState } from "react";
import { CheckCircle, User, Phone, Mail, Plus } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

interface ProfileHeroSectionProps {
  profile: {
    profileImage: string | null;
    fullName: string;
    specialization: string;
    phone: string;
    email: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

export function ProfileHeroSection({ profile, setProfile }: ProfileHeroSectionProps) {
  const { isDark } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile((prev: any) => ({ ...prev, profileImage: imageUrl }));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  };

  return (
    <div className={`backdrop-blur-xl border rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 relative overflow-hidden ${isDark ? "bg-gradient-to-b from-blue-950/40 via-blue-900/30 to-cyan-800/40 border-white/20" : "bg-white border-[#0f427d]/16"}`}>

      {/* رسالة النجاح */}
      {showSuccess && (
        <div className={`relative z-20 mb-4 px-4 sm:px-6 py-3 rounded-2xl border flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${isDark ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-[#0f427d]"}`}>
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          تم رفع الصورة بنجاح!
        </div>
      )}

      {/* Container الرئيسي */}
      <div className="flex flex-col items-center md:flex-col lg:flex-row lg:items-start gap-6 md:gap-6 lg:gap-10">

        {/* الصورة */}
        <div className="relative flex-shrink-0 w-28 sm:w-32 md:w-32 lg:w-44 h-28 sm:h-32 md:h-32 lg:h-44">
          {profile.profileImage ? (
            <img
              src={profile.profileImage}
              alt="profile"
              className="w-full h-full rounded-full object-cover border-4 border-white/20 shadow-2xl"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center shadow-2xl">
              <User className={`w-12 h-12 sm:w-16 sm:h-16 ${isDark ? "text-white/60" : "text-[#0f427d]/60"}`} />
            </div>
          )}

          {/* زرار رفع الصورة */}
          <label
            htmlFor="uploadImage"
            className="absolute bottom-1 right-1 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white hover:bg-blue-600 hover:text-white text-blue-900 flex items-center justify-center shadow-lg cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="uploadImage"
          />

          {/* حالة الحساب */}
          <div className="absolute bottom-3 left-3 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-4 border-white"></div>
        </div>

        {/* البيانات */}
        <div className="flex-1 max-w-xl md:max-w-2xl lg:max-w-4xl space-y-4 md:space-y-4 lg:space-y-6 text-center md:text-center lg:text-right">
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-[#0f427d]"}`}>{profile.fullName}</h1>
          <p className={`text-sm sm:text-base md:text-lg ${isDark ? "text-cyan-100" : "text-[#0f427d]/75"}`}>{profile.specialization}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm mb-1 ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
                <Phone className="w-3 h-3 sm:w-4 sm:h-4" /> رقم الهاتف
              </label>
              <div className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? "bg-white/10 text-white" : "bg-[#0f427d]/8 text-[#0f427d]"}`}>{profile.phone}</div>
            </div>
            <div>
              <label className={`flex items-center gap-2 text-xs sm:text-sm mb-1 ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" /> البريد الإلكتروني
              </label>
              <div className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? "bg-white/10 text-white" : "bg-[#0f427d]/8 text-[#0f427d]"}`}>{profile.email}</div>
            </div>
          </div>

          {/* حساب نشط */}
          <div className={`flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? "bg-emerald-500/20 text-emerald-100" : "bg-emerald-100 text-[#0f427d] border border-emerald-200"}`}>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> حساب نشط
          </div>
        </div>
      </div>
    </div>
  );
}