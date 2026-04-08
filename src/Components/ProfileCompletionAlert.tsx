import { useState } from "react";
import { AlertCircle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { ProfileCompletionSection } from "./ProfileCompletionSection";

const ProfileCompletionAlert = () => {
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
      <div className="backdrop-blur-xl bg-emerald-500/10 border border-emerald-400/30 rounded-3xl shadow-2xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">ملفك الشخصي مكتمل!</h3>
            <p className="text-sm text-emerald-100">جميع بياناتك محدثة ومكتملة</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      {/* Alert */}
      <div className="backdrop-blur-xl bg-gradient-to-r from-amber-500/5 via-orange-400/5 to-amber-500/5 border border-amber-400/20 rounded-3xl shadow-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-400/15 rounded-full blur-xl" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-amber-600" />
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold text-amber-100 mb-1">
                يرجى استكمال البيانات
              </h3>
              <p className="text-sm text-amber-100">
                أكمل بياناتك لتحسين ظهورك للمرضى
              </p>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            >
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-amber-100">نسبة الإكمال</span>
              <span className="text-2xl font-bold text-amber-400">{completion}%</span>
            </div>

            <div className="w-full h-3 bg-white/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>

            <p className="text-xs text-amber-100">
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