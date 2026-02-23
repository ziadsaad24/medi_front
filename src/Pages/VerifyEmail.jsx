import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // التحقق من success parameter (من Laravel redirect)
      const successParam = searchParams.get('success');
      
      if (successParam === 'true') {
        // Laravel بالفعل فعّل الحساب، فقط اعرض رسالة نجاح
        setStatus('success');
        setMessage('تم تفعيل حسابك بنجاح!');
        
        // احذف أي بيانات قديمة من localStorage (المستخدم محتاج يسجل دخول)
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('pending_verification_email');
        
        // توجيه للـ login بعد 3 ثوان
        setTimeout(() => {
          navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
        }, 3000);
        return;
      }

      // الحصول على المعاملات من URL (للتحقق المباشر من React)
      const id = searchParams.get('id');
      const hash = searchParams.get('hash');
      const expires = searchParams.get('expires');
      const signature = searchParams.get('signature');

      if (!id || !hash) {
        setStatus('error');
        setMessage('رابط التحقق غير صالح');
        return;
      }

      try {
        // إرسال طلب التحقق للـ Backend
        await authAPI.verifyEmail({ id, hash, expires, signature });
        
        setStatus('success');
        setMessage('تم تفعيل حسابك بنجاح!');
        
        // احذف أي بيانات قديمة من localStorage (المستخدم محتاج يسجل دخول)
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('pending_verification_email');
        
        // توجيه للـ login بعد 3 ثوان
        setTimeout(() => {
          navigate('/auth', { state: { role: 'patient', initialMode: 'login' } });
        }, 3000);
        
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'فشل التحقق من البريد الإلكتروني');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

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
      >
        {/* أيقونة حسب الحالة */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner ${
          status === 'verifying' ? 'bg-blue-100 text-blue-500' :
          status === 'success' ? 'bg-green-100 text-green-500' :
          'bg-red-100 text-red-500'
        }`}>
          {status === 'verifying' && <Loader2 size={48} className="animate-spin" />}
          {status === 'success' && <CheckCircle size={48} />}
          {status === 'error' && <XCircle size={48} />}
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-3">
          {status === 'verifying' && 'جارٍ التحقق...'}
          {status === 'success' && 'تم التفعيل بنجاح!'}
          {status === 'error' && 'فشل التفعيل'}
        </h2>
        
        <p className="text-gray-500 mb-8 px-4">
          {status === 'verifying' && 'يرجى الانتظار بينما نقوم بالتحقق من بريدك الإلكتروني...'}
          {status === 'success' && 'سيتم توجيهك لصفحة تسجيل الدخول خلال لحظات...'}
          {status === 'error' && message}
        </p>

        {status === 'success' && (
          <div className="bg-green-50/80 border border-green-100 rounded-3xl p-6 mb-8 text-right" dir="rtl">
            <h4 className="text-green-700 font-bold text-lg mb-2 flex items-center gap-2">
              <span>✓</span> حسابك جاهز الآن!
            </h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              يمكنك الآن تسجيل الدخول والاستفادة من جميع خدمات MediCare.
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col gap-4">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
            >
              العودة لتسجيل الدخول
            </button>
            
            <button 
              onClick={() => navigate('/pending-verification')}
              className="w-full py-4 border-2 border-blue-200 text-[#0F427D] rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95"
            >
              إعادة إرسال رسالة التحقق
            </button>
          </div>
        )}

        {status === 'verifying' && (
          <div className="flex items-center justify-center gap-2 text-gray-400 mt-4">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        )}
      </motion.div>
      
      <p className="mt-8 text-gray-400 text-xs">© 2024 MediCare. جميع الحقوق محفوظة</p>
    </div>
  );
};

export default VerifyEmail;
