import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderLogo from '../Components/HeaderLogo';
import { motion } from 'framer-motion';

const SuccessPage = () => {
  const navigate = useNavigate();

  // أنيميشن لظهور المحتوى
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
      {/* اللوجو العلوي */}
      <HeaderLogo />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={bounceIn}
        className="bg-white rounded-[40px] shadow-2xl p-10 w-full max-w-xl mt-8 border border-white"
      >
        {/* أيقونة النجاح */}
        <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          ✓
        </div>

        <h2 className="text-3xl font-black text-gray-800 mb-3">شكراً لتسجيلك</h2>
        <p className="text-gray-500 mb-8 px-4">
          تم استلام بياناتك بنجاح. نحن بصدد مراجعة حسابك الآن للتأكد من جودة الخدمة.
        </p>

        {/* كارت التنبيه الجانبي (زي اللي في الصورة) */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-3xl p-6 mb-10 text-right" dir="rtl">
          <h4 className="text-[#0F427D] font-bold text-lg mb-2 flex items-center gap-2">
            <span>⌛</span> انتظر تفعيل حسابك
          </h4>
          <p className="text-gray-600 text-sm leading-relaxed">
            سيتم مراجعة حسابك وتفعيل الحساب خلال أقرب وقت ممكن. لن تتمكن من تسجيل الدخول حتى يتم التفعيل من قبل الإدارة.
          </p>
        </div>

        {/* الأزرار */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => navigate('/auth')}
            className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            الذهاب لتسجيل الدخول
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 border-2 border-blue-200 text-[#0F427D] rounded-2xl font-bold hover:bg-blue-50 transition-all active:scale-95"
          >
            العودة للرئيسية
          </button>
        </div>
      </motion.div>
      
      <p className="mt-8 text-gray-400 text-xs">© 2024 MediaCare. جميع الحقوق محفوظة</p>
    </div>
  );
};

export default SuccessPage;