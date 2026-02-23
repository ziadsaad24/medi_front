import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import { authAPI } from '../services/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    // الحصول على token و email من URL
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (!tokenParam || !emailParam) {
      setError('رابط إعادة التعيين غير صالح أو منتهي الصلاحية');
    } else {
      setToken(tokenParam);
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة!');
      return;
    }
    
    // التحقق من طول كلمة المرور
    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    
    setLoading(true);
    
    try {
      // إرسال طلب لـ Laravel API
      await authAPI.resetPassword({
        token,
        email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      });
      
      // نجح الطلب
      setSuccess(true);
      
      // إعادة توجيه للـ login بعد 4 ثوان
      setTimeout(() => {
        navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
      }, 4000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في إعادة تعيين كلمة المرور. حاول مرة أخرى.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center">
      <HeaderLogo />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-md mt-8"
        dir="rtl"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-full bg-blue-50 mb-4">
            <KeyRound size={32} strokeWidth={2.5} className="text-[#0F427D]" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-3">إعادة تعيين كلمة المرور</h2>
         
        </div>

        {!success ? (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* عرض رسالة الخطأ */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            <div className="relative w-full">
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading || !token}
                className="w-full pr-12 pl-12 py-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
                placeholder="كلمة المرور الجديدة"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative w-full">
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading || !token}
                className="w-full pr-12 pl-12 py-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
                placeholder="تأكيد كلمة المرور"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-xs text-gray-500 mb-4 bg-blue-50 p-3 rounded-xl">
              <p className="font-semibold mb-2">متطلبات كلمة المرور:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>8 أحرف على الأقل</li>
                <li>يُفضل استخدام أحرف كبيرة وصغيرة</li>
                <li>يُفضل استخدام أرقام ورموز</li>
              </ul>
            </div>

            <button 
              type="submit" 
              disabled={loading || !token}
              className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جارٍ التحديث...
                </>
              ) : (
                <>
                  <Lock size={20} />
                  تحديث كلمة المرور
                </>
              )}
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 rounded-full bg-green-50">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-green-600 font-semibold mb-2">تم التحديث بنجاح!</p>
            <p className="text-gray-600 text-sm mb-6">
              تم تحديث كلمة المرور الخاصة بك بنجاح. يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
            </p>
            <div className="text-xs text-gray-500">
              جارٍ إعادة التوجيه لتسجيل الدخول...
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
