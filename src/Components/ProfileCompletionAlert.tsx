import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ProfileCompletionSection } from "./ProfileCompletionSection";
import { useTheme } from "../context/ThemeContext";
import doctorApi from "../services/doctorApi";
import { useProfile } from "../context/ProfileContext";

interface ProfileCompletionAlertProps {
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  forceOpen?: boolean;
}

const ProfileCompletionAlert = ({ profile, setProfile, forceOpen = false }: ProfileCompletionAlertProps) => {
  const { isDark } = useTheme();
  const { completionMeta, refreshProfileFromApi } = useProfile();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  // بيانات حقيقية يتم حفظها عند الضغط على زر الحفظ فقط
  const [formData, setFormData] = useState({
    address: profile?.address || '',
    clinicName: profile?.clinicName || '',
    licenseNumber: profile?.licenseNumber || '',
    experience: profile?.experience || '',
    about: profile?.about || '',
    consultationFee: profile?.consultationFee || '',
  });

  // بيانات مؤقتة للتعديل و progress bar
  const [tempData, setTempData] = useState({ ...formData });

  useEffect(() => {
    const next = {
      address: profile?.address || '',
      clinicName: profile?.clinicName || '',
      licenseNumber: profile?.licenseNumber || '',
      experience: profile?.experience || '',
      about: profile?.about || '',
      consultationFee: profile?.consultationFee || '',
    };

    setFormData(next);
    setTempData(next);
  }, [profile]);

  const liveCompletion = useMemo(() => {
    const draft = {
      fullName: profile?.fullName || '',
      specialization: profile?.specialization || '',
      phone: profile?.phone || '',
      email: profile?.email || '',
      profileImage: profile?.profileImage || null,
      address: tempData?.address || '',
      clinicName: tempData?.clinicName || '',
      licenseNumber: tempData?.licenseNumber || '',
      experience: tempData?.experience || '',
      about: tempData?.about || '',
      consultationFee: tempData?.consultationFee || '',
    };

    const requiredValues = [
      draft.fullName,
      draft.specialization,
      draft.phone,
      draft.email,
      draft.profileImage,
      draft.address,
      draft.clinicName,
      draft.licenseNumber,
      draft.experience,
      draft.about,
      draft.consultationFee,
    ];

    const filledCount = requiredValues.filter((value) => {
      if (typeof value === 'string') return value.trim().length > 0;
      return Boolean(value);
    }).length;

    return Math.round((filledCount / requiredValues.length) * 100);
  }, [profile, tempData]);

  const completion = Number.isFinite(liveCompletion)
    ? liveCompletion
    : Number(completionMeta?.completionPercent ?? 0);
  const isComplete = completion >= 100 || Boolean(completionMeta?.isProfileComplete && completion >= Number(completionMeta?.completionPercent ?? 0));

  const handleSaveCompletion = async (data: any) => {
    await doctorApi.updateDoctorProfile({
      fullName: profile?.fullName,
      full_name: profile?.fullName,
      email: profile?.email,
      phone: profile?.phone,
      specialization: profile?.specialization,
      address: data.address,
      clinicName: data.clinicName,
      clinic_name: data.clinicName,
      licenseNumber: data.licenseNumber,
      license_number: data.licenseNumber,
      experience: Number(data.experience || 0),
      years_experience: Number(data.experience || 0),
      about: data.about,
      bio: data.about,
      consultationFee: Number(data.consultationFee || 0),
      consultation_fee: Number(data.consultationFee || 0),
    });

    setFormData(data);
    setProfile((prev: any) => ({ ...prev, ...data }));
    await refreshProfileFromApi();
  };

  return (
    <div className="mb-6">
      {/* Alert */}
      <div
        className={`backdrop-blur-xl border rounded-3xl shadow-2xl p-6 relative overflow-hidden ${
          isComplete
            ? isDark
              ? "bg-emerald-500/10 border-emerald-400/30"
              : "bg-emerald-50 border-emerald-200"
            : isDark
              ? "bg-gradient-to-r from-amber-500/5 via-orange-400/5 to-amber-500/5 border-amber-400/20"
              : "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-amber-400/20"
        }`}
      >
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl ${isComplete ? "bg-emerald-400/10" : "bg-amber-400/10 animate-pulse"}`} />
        <div className={`absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl ${isComplete ? "bg-emerald-400/15" : "bg-orange-400/15"}`} />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isComplete ? "bg-emerald-500/20" : "bg-amber-500/10"}`}>
              {isComplete ? <CheckCircle className="w-8 h-8 text-emerald-600" /> : <AlertCircle className="w-8 h-8 text-amber-600" />}
            </div>

            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${isDark ? (isComplete ? "text-emerald-100" : "text-amber-100") : "text-[#0f427d]"}`}>
                {isComplete ? "ملفك الشخصي مكتمل" : "يرجى استكمال البيانات"}
              </h3>
              <p className={`text-sm ${isDark ? (isComplete ? "text-emerald-100" : "text-amber-100") : "text-[#0f427d]/80"}`}>
                {isComplete
                  ? "تم الحفظ بنجاح. يمكنك فتح النموذج وتعديل بياناتك في أي وقت ثم الضغط على حفظ."
                  : "أكمل بياناتك لتحسين ظهورك للمرضى"}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isDark ? "bg-white/20 hover:bg-white/30" : "bg-amber-100 hover:bg-amber-200 text-[#0f427d]"}`}
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${isDark ? (isComplete ? "text-emerald-100" : "text-amber-100") : "text-[#0f427d]"}`}>نسبة الإكمال</span>
              <span className={`text-2xl font-bold ${isDark ? (isComplete ? "text-emerald-400" : "text-amber-400") : "text-[#0f427d]"}`}>{completion}%</span>
            </div>

            <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-white/40" : isComplete ? "bg-emerald-100" : "bg-amber-100"}`}>
              <div
                className={`h-full transition-all duration-500 ${isComplete ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-amber-500 to-orange-500"}`}
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className={`text-xs ${isDark ? (isComplete ? "text-emerald-100" : "text-amber-100") : "text-[#0f427d]/80"}`}>
              {isComplete ? "اكتمل الملف 100% ويمكنك الاستمرار في التعديل اليدوي عند الحاجة" : `باقي ${100 - completion}% لإكمال ملفك الشخصي`}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[1200px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <ProfileCompletionSection
          formData={formData}
          setFormData={handleSaveCompletion}   // هنا يتم الحفظ عند الضغط
          tempData={tempData}
          setTempData={setTempData}   // هنا يتحرك progress bar بدون autosave
        />
      </div>
    </div>
  );
};

export default ProfileCompletionAlert;