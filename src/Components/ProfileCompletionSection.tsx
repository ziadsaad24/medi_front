import { useState } from 'react';
import { MapPin, Briefcase, FileText, DollarSign, Building2, BadgeCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProfileCompletionSectionProps {
  formData: any;
  setFormData: any;
  tempData: any;
  setTempData: any;
}

export function ProfileCompletionSection({ formData, setFormData, tempData, setTempData }: ProfileCompletionSectionProps) {
  const { isDark } = useTheme();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setTempData({ ...tempData, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!tempData.address) newErrors.address = 'العنوان مطلوب';
    if (!tempData.clinicName) newErrors.clinicName = 'اسم العيادة مطلوب';
    if (!tempData.licenseNumber) newErrors.licenseNumber = 'رقم الترخيص مطلوب';
    if (!tempData.experience) newErrors.experience = 'سنوات الخبرة مطلوبة';
    if (!tempData.about) newErrors.about = 'نبذة مطلوبة';
    if (!tempData.consultationFee) newErrors.consultationFee = 'سعر الكشف مطلوب';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSaving(true);
      await Promise.resolve(setFormData(tempData));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error: any) {
      const responseErrors = error?.response?.data?.errors || {};
      const mapped: Record<string, string> = {};

      Object.entries(responseErrors).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          mapped[key] = value[0] as string;
        } else if (typeof value === 'string') {
          mapped[key] = value;
        }
      });

      if (Object.keys(mapped).length === 0) {
        mapped.address = error?.response?.data?.message || 'تعذر حفظ البيانات حالياً';
      }

      setErrors(mapped);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`mt-4 p-6 rounded-2xl backdrop-blur-xl shadow-lg border ${isDark ? "text-white bg-blue-900/20 border-white/40" : "text-[#0f427d] bg-white border-[#0f427d]/16"}`}>
      {showSuccess && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-100">
          تم حفظ البيانات بنجاح ✅
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <MapPin className="w-4 h-4" />
            العنوان
          </div>
          <input
            value={tempData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.address && <p className="text-red-400 text-sm">{errors.address}</p>}
        </div>

        {/* Clinic Name */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <Building2 className="w-4 h-4" />
            اسم العيادة / المركز
          </div>
          <input
            value={tempData.clinicName}
            onChange={(e) => handleChange('clinicName', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.clinicName && <p className="text-red-400 text-sm">{errors.clinicName}</p>}
        </div>

        {/* License Number */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <BadgeCheck className="w-4 h-4" />
            رقم الترخيص المهني
          </div>
          <input
            value={tempData.licenseNumber}
            onChange={(e) => handleChange('licenseNumber', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.licenseNumber && <p className="text-red-400 text-sm">{errors.licenseNumber}</p>}
        </div>

        {/* Experience */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <Briefcase className="w-4 h-4" />
            سنوات الخبرة
          </div>
          <input
            type="number"
            value={tempData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.experience && <p className="text-red-400 text-sm">{errors.experience}</p>}
        </div>

        {/* About */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <FileText className="w-4 h-4" />
            نبذة
          </div>
          <textarea
            value={tempData.about}
            onChange={(e) => handleChange('about', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.about && <p className="text-red-400 text-sm">{errors.about}</p>}
        </div>

        {/* Fee */}
        <div>
          <div className={`flex items-center gap-2 mb-1 text-sm ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            <DollarSign className="w-4 h-4" />
            سعر الكشف
          </div>
          <input
            type="number"
            value={tempData.consultationFee}
            onChange={(e) => handleChange('consultationFee', e.target.value)}
            className="w-full p-3 rounded-xl theme-input"
          />
          {errors.consultationFee && <p className="text-red-400 text-sm">{errors.consultationFee}</p>}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-800 to-cyan-700 text-white"
        >
          {isSaving ? 'جارٍ الحفظ...' : 'حفظ البيانات'}
        </button>
      </form>
    </div>
  );
}