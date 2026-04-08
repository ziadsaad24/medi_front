import { useState } from "react";
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ProfileCompletionSection } from "./ProfileCompletionSection";
import { useTheme } from "../context/ThemeContext";

const ProfileCompletionAlert = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // بيانات حقيقية يتم حفظها عند الضغط على زر الحفظ فقط
  const [formData, setFormData] = useState({
    address: '',
    experience: '',
    about: '',
    consultationFee: '',
  });

  // بيانات مؤقتة للتعديل و progress bar
  const [tempData, setTempData] = useState({ ...formData });

  // دالة لحساب نسبة الاكمال حسب tempData فقط
  const calculateCompletion = () => {
    let filled = 0;
    if (tempData.address) filled += 25;
    if (tempData.experience) filled += 25;
    if (tempData.about) filled += 25;
    if (tempData.consultationFee) filled += 25;
    return filled;
  };

  const completion = calculateCompletion();
  const isComplete = Object.values(formData).every(v => v) && completion === 100;

  if (isComplete) {
    return (
      <div className={`backdrop-blur-xl bg-emerald-500/10 border border-emerald-400/30 rounded-3xl shadow-2xl p-6 mb-6 ${!isDark ? "text-[#0f427d]" : ""}`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-white" : "text-[#0f427d]"}`}>ملفك الشخصي مكتمل!</h3>
            <p className={`text-sm ${isDark ? "text-emerald-100" : "text-[#0f427d]/80"}`}>جميع بياناتك محدثة ومكتملة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Alert */}
      <div className={`backdrop-blur-xl border border-amber-400/20 rounded-3xl shadow-2xl p-6 relative overflow-hidden ${isDark ? "bg-gradient-to-r from-amber-500/5 via-orange-400/5 to-amber-500/5" : "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50"}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/15 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>

            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-1 ${isDark ? "text-amber-100" : "text-[#0f427d]"}`}>
                يرجى استكمال البيانات
              </h3>
              <p className={`text-sm ${isDark ? "text-amber-100" : "text-[#0f427d]/80"}`}>
                أكمل بياناتك لتحسين ظهورك للمرضى
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
              <span className={`text-sm font-semibold ${isDark ? "text-amber-100" : "text-[#0f427d]"}`}>نسبة الإكمال</span>
              <span className={`text-2xl font-bold ${isDark ? "text-amber-400" : "text-[#0f427d]"}`}>{completion}%</span>
            </div>

            <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? "bg-white/40" : "bg-amber-100"}`}>
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className={`text-xs ${isDark ? "text-amber-100" : "text-[#0f427d]/80"}`}>
              باقي {100 - completion}% لإكمال ملفك الشخصي
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className={`transition-all duration-500 overflow-hidden ${isOpen ? "max-h-[1200px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
        <ProfileCompletionSection
          formData={formData}
          setFormData={setFormData}   // هنا يتم الحفظ عند الضغط
          tempData={tempData}
          setTempData={setTempData}   // هنا يتحرك progress bar بدون autosave
        />
      </div>
    </div>
  );
};

export default ProfileCompletionAlert;