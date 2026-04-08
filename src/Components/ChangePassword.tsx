import { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, Edit2, X } from 'lucide-react';

export function ChangePassword() {
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!passwords.current) newErrors.current = 'كلمة المرور الحالية مطلوبة';
    if (!passwords.new) newErrors.new = 'كلمة المرور الجديدة مطلوبة';
    if (!passwords.confirm) newErrors.confirm = 'تأكيد كلمة المرور مطلوب';
    if (passwords.new && passwords.new.length < 8) {
      newErrors.new = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }
    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = 'كلمة المرور غير متطابقة';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsEditing(false);
    setShowSuccess(true);
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleChange = (field: string, value: string) => {
    setPasswords({ ...passwords, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-b from-blue-950/95 via-blue-900/90 to-cyan-800/85 border border-white/30 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 relative group max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-200">
              تغيير كلمة المرور
            </h3>
            <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 text-gray-300">
              حافظ على أمان حسابك بتحديث كلمة المرور
            </p>
          </div>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-10 h-10 rounded-xl backdrop-blur-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white hover:shadow-lg transition-all flex items-center justify-center"
            title="تعديل"
          >
            <Edit2 className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(false)}
            className="w-10 h-10 rounded-xl backdrop-blur-xl bg-white/60 border border-white/60 text-gray-600 hover:bg-white/80 transition-all flex items-center justify-center"
            title="إلغاء التعديل"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* رسالة النجاح */}
      {showSuccess && (
        <div className="mb-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-700 font-medium flex items-center gap-2 sm:gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          تم تغيير كلمة المرور بنجاح!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
        {/* كلمة المرور الحالية */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 font-semibold mb-2 sm:mb-3">
            <Lock className="w-5 h-5 text-gray-300" />
            كلمة المرور الحالية <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => handleChange('current', e.target.value)}
              placeholder="أدخل كلمة المرور الحالية"
              disabled={!isEditing}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl ${
                isEditing ? 'bg-white/10' : 'bg-white/20'
              } border ${errors.current ? 'border-red-400' : 'border-white/60'} text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 pl-10 sm:pl-12 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.current && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.current}</p>}
        </div>

        {/* كلمة المرور الجديدة */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 font-semibold mb-2 sm:mb-3">
            <Lock className="w-5 h-5 text-gray-300" />
            كلمة المرور الجديدة <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => handleChange('new', e.target.value)}
              placeholder="أدخل كلمة المرور الجديدة"
              disabled={!isEditing}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl ${
                isEditing ? 'bg-white/10' : 'bg-white/20'
              } border ${errors.new ? 'border-red-400' : 'border-white/60'} text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 pl-10 sm:pl-12 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.new && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.new}</p>}
          <p className="text-xs sm:text-sm text-gray-400 mt-1">يجب أن تحتوي على 8 أحرف على الأقل</p>
        </div>

        {/* تأكيد كلمة المرور */}
        <div>
          <label className="flex items-center gap-2 text-gray-300 font-semibold mb-2 sm:mb-3">
            <Lock className="w-5 h-5 text-gray-300" />
            تأكيد كلمة المرور <span className="text-red-300">*</span>
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => handleChange('confirm', e.target.value)}
              placeholder="أعد إدخال كلمة المرور الجديدة"
              disabled={!isEditing}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl backdrop-blur-xl ${
                isEditing ? 'bg-white/10' : 'bg-white/20'
              } border ${errors.confirm ? 'border-red-400' : 'border-white/60'} text-sm sm:text-base md:text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-600/50 pl-10 sm:pl-12 ${
                !isEditing ? 'cursor-not-allowed' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirm && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirm}</p>}
        </div>

        {/* زر التغيير */}
        {isEditing && (
          <button
            type="submit"
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 md:py-4 rounded-2xl bg-gradient-to-r from-blue-900/55 via-blue-800 to-cyan-700 text-sm sm:text-base md:text-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-lg"
          >
            <Shield className="w-5 h-5 text-white" />
            <span className='text-white'>تغيير كلمة المرور</span>
          </button>
        )}
      </form>
    </div>
  );
}