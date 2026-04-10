import React, { useState } from "react";
import { CheckCircle, User, Phone, Mail, Plus, Edit2, Save, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import doctorApi from "../services/doctorApi";

interface ProfileHeroSectionProps {
  profile: {
    profileImage: string | null;
    fullName: string;
    specialization: string;
    phone: string;
    email: string;
  };
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  isLoading?: boolean;
}

export function ProfileHeroSection({ profile, setProfile, isLoading }: ProfileHeroSectionProps) {
  const { isDark } = useTheme();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempData, setTempData] = useState({
    fullName: profile.fullName || '',
    phone: profile.phone || '',
    email: profile.email || '',
  });

  // Show loading state
  if (isLoading) {
    return (
      <div className={`backdrop-blur-xl border rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 relative ${isDark ? "bg-gradient-to-b from-blue-950/40 via-blue-900/30 to-cyan-800/40 border-white/20" : "bg-white border-[#0f427d]/16"}`}>
        <div className="flex flex-col items-center gap-6">
          <div className={`w-28 h-28 sm:w-32 sm:h-32 md:w-32 md:h-32 lg:w-44 lg:h-44 rounded-full ${isDark ? 'bg-white/10' : 'bg-[#0f427d]/8'} animate-pulse`} />
          <div className="flex-1 max-w-xl md:max-w-2xl lg:max-w-4xl space-y-4 w-full">
            <div className={`h-8 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#0f427d]/8'} animate-pulse`} />
            <div className={`h-6 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#0f427d]/8'} animate-pulse max-w-xs`} />
            <div className={`h-12 rounded-xl ${isDark ? 'bg-white/10' : 'bg-[#0f427d]/8'} animate-pulse`} />
          </div>
        </div>
      </div>
    );
  }

  const handleStartEdit = () => {
    setTempData({
      fullName: profile.fullName || '',
      phone: profile.phone || '',
      email: profile.email || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await doctorApi.updateDoctorProfile({
        fullName: tempData.fullName,
        full_name: tempData.fullName,
        email: tempData.email,
        phone: tempData.phone,
        specialization: profile.specialization,
        address: (profile as any).address,
        clinicName: (profile as any).clinicName,
        clinic_name: (profile as any).clinicName,
        licenseNumber: (profile as any).licenseNumber,
        license_number: (profile as any).licenseNumber,
        experience: (profile as any).experience,
        years_experience: (profile as any).experience,
        about: (profile as any).about,
        bio: (profile as any).about,
        consultationFee: (profile as any).consultationFee,
        consultation_fee: (profile as any).consultationFee,
      });

      setProfile((prev: any) => ({ ...prev, ...tempData }));
      setIsEditing(false);
      setSuccessMessage('تم تحديث البيانات بنجاح!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.warn('Doctor profile update API failed:', error);
      setSuccessMessage('تعذر تحديث البيانات الآن. حاول مرة أخرى.');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const response = await doctorApi.uploadDoctorAvatar(file);
        const data = response?.data || response || {};
        const profileImage = data.profileImage || data.profile_image || data.avatar_url || URL.createObjectURL(file);

        setProfile((prev: any) => ({ ...prev, profileImage }));
        setSuccessMessage('تم رفع الصورة بنجاح!');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      } catch (error) {
        console.warn('Avatar upload failed:', error);
        setSuccessMessage('تعذر رفع الصورة الآن.');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2500);
      }
    }
  };

  return (
    <div className={`backdrop-blur-xl border rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 mb-6 relative ${isDark ? "bg-gradient-to-b from-blue-950/40 via-blue-900/30 to-cyan-800/40 border-white/20" : "bg-white border-[#0f427d]/16"}`}>

      {/* رسالة النجاح */}
      {showSuccess && (
        <div className={`relative z-20 mb-4 px-4 sm:px-6 py-3 rounded-2xl border flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${isDark ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-100" : "bg-emerald-50 border-emerald-200 text-[#0f427d]"}`}>
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          {successMessage}
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
          <h1 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold ${isDark ? "text-white" : "text-[#0f427d]"}`}>
            {profile.fullName}
          </h1>

          <p className={`text-sm sm:text-base md:text-lg ${isDark ? "text-cyan-100" : "text-[#0f427d]/75"}`}>
            {profile.specialization}
          </p>

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

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base ${isDark ? "bg-emerald-500/20 text-emerald-100" : "bg-emerald-100 text-[#0f427d] border border-emerald-200"}`}>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> حساب نشط
            </div>

            <button
              onClick={handleStartEdit}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isDark ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' : 'bg-blue-50 text-[#0F427D] hover:bg-blue-100 border border-blue-100'}`}
            >
              <Edit2 className="w-4 h-4" />
              تعديل البيانات الأساسية
            </button>
          </div>
        </div>
      </div>

      {/* Basic Profile Edit Modal */}
      {isEditing && (
        <div
          className="fixed inset-0 z-[2200] bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleCancelEdit}
        >
          <div
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'}`}
            dir="rtl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`flex items-center justify-between p-5 border-b ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0f427d]'}`}>تعديل البيانات الأساسية</h3>
              <button
                onClick={handleCancelEdit}
                className="w-10 h-10 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="space-y-2">
                <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-[#0f427d]/80'}`}>الاسم الكامل</label>
                <input
                  value={tempData.fullName}
                  onChange={(e) => setTempData((prev) => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl theme-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-[#0f427d]/80'}`}>رقم الهاتف</label>
                  <input
                    value={tempData.phone}
                    onChange={(e) => setTempData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl theme-input"
                  />
                </div>

                <div className="space-y-2">
                  <label className={`text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-[#0f427d]/80'}`}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => setTempData((prev) => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl theme-input"
                  />
                </div>
              </div>
            </div>

            <div className={`p-5 md:p-6 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
              <button
                onClick={handleCancelEdit}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all"
              >
                إلغاء
              </button>

              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}