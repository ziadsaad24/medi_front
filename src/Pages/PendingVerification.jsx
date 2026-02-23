import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, RefreshCw, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const PendingVerification = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  // الحصول على email من user أو من localStorage
  const userEmail = user?.email || localStorage.getItem('pending_verification_email');

  // إذا لم يكن هناك email، وجّه للـ login
  React.useEffect(() => {
    if (!userEmail) {
      navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
    }
  }, [userEmail, navigate]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);
    setResendError('');

    try {
      await authAPI.resendVerificationEmail(userEmail);
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 5000);
    } catch (error) {
      setResendError('حدث خطأ في إعادة الإرسال. حاول مرة أخرى.');
      setTimeout(() => setResendError(''), 5000);
    } finally {
      setIsResending(false);
    }
  };

  const bounceIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6 text-center">
      <HeaderLogo />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={bounceIn}
        className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-xl mt-8 border border-white"
        dir="rtl"
      >
        {/* أيقونة البريد */}
        <div className="w-24 h-24 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <Mail size={48} />
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-3">تحقق من بريدك الإلكتروني</h2>
        <p className="text-gray-500 mb-4 px-4 leading-relaxed">
          تم إرسال رسالة تحقق إلى بريدك الإلكتروني:
        </p>
        <p className="text-[#0F427D] font-bold text-lg mb-8">
          {userEmail}
        </p>

        {/* رسائل النجاح والخطأ */}
        {resendSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-3 text-green-700"
          >
            <CheckCircle size={20} />
            <span className="text-sm font-bold">تم إعادة إرسال رسالة التحقق بنجاح!</span>
          </motion.div>
        )}

        {resendError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{resendError}</span>
          </motion.div>
        )}

        {/* كارت التنبيه */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-6 mb-8 text-right">
          <h4 className="text-[#0F427D] font-bold text-lg mb-2 flex items-center gap-2">
            <span>📧</span> خطوات التفعيل
          </h4>
          <ul className="text-gray-600 text-sm leading-relaxed space-y-2 list-disc list-inside">
            <li>افتح بريدك الإلكتروني</li>
            <li>ابحث عن رسالة من MediCare</li>
            <li>اضغط على رابط التفعيل</li>
            <li>سيتم توجيهك تلقائياً لتسجيل الدخول</li>
          </ul>
          <p className="text-gray-500 text-xs mt-4">
            💡 تحقق من مجلد الرسائل غير المرغوب فيها (Spam) إذا لم تجد الرسالة
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isResending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جارٍ الإرسال...</span>
              </>
            ) : (
              <>
                <RefreshCw size={20} />
                <span>إعادة إرسال رسالة التحقق</span>
              </>
            )}
          </button>
          
          <button 
            onClick={() => navigate('/auth', { state: { role: 'patient', initialMode: 'login' } })}
            className="w-full py-4 border-2 border-blue-200 text-[#0F427D] rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            <span>العودة لتسجيل الدخول</span>
          </button>
        </div>

        <p className="mt-6 text-gray-400 text-xs">
          لم تستلم الرسالة؟ تحقق من البريد المزعج أو أعد إرسال الرسالة
        </p>
      </motion.div>
      
      <p className="mt-8 text-gray-400 text-xs">© 2024 MediCare. جميع الحقوق محفوظة</p>
    </div>
  );
};

export default PendingVerification;
