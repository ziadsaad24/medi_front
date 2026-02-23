import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import { authAPI } from '../services/api';

const ForgetPassword = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    
    try {
      // إرسال طلب لـ Laravel API
      const response = await authAPI.forgotPassword(email);
      
      // نجح الطلب
      setSuccess(true);
      setMessage(response.message || 'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد.');
      
      // إعادة توجيه للـ login بعد 4 ثوان
      setTimeout(() => {
        navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
      }, 4000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'حدث خطأ في إرسال الطلب. حاول مرة أخرى.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
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
          <h2 className="text-3xl font-black text-gray-800 mb-3">نسيت كلمة المرور؟</h2>
          <p className="text-gray-500 text-base leading-relaxed">
            أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور
          </p>
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
                <Mail size={20} />
              </div>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="w-full pr-12 pl-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100 transition-all disabled:opacity-50"
                placeholder="البريد الإلكتروني"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جارٍ الإرسال...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  إرسال رابط الاستعادة
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
            <p className="text-green-600 font-semibold mb-2">تم الإرسال بنجاح!</p>
            <p className="text-gray-600 text-sm mb-6">{message}</p>
            <div className="text-xs text-gray-500">
              جارٍ إعادة التوجيه لتسجيل الدخول...
            </div>
          </motion.div>
        )}

        {!success && (
          <div className="mt-6">
            <button
              onClick={handleBackToLogin}
              className="w-full flex items-center justify-center gap-2 text-[#0F427D] hover:text-[#008080] font-semibold transition-colors"
            >
              <ArrowLeft size={18} />
              العودة لتسجيل الدخول
            </button>
          </div>
        )}
      </motion.div>

      {/* ملاحظة إرشادية */}
      {!success && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500 max-w-md"
        >
          <p>
            💡 تأكد من التحقق من صندوق البريد الوارد وصندوق الرسائل المزعجة (Spam)
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ForgetPassword;
