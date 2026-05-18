import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import '../Styles/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6, ease: "easeOut" }
    })
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 overflow-hidden">

      {/* 1. اللوجو العلوي مع أنيميشن الرسم */}
      <motion.div
        custom={0} initial="hidden" animate="visible" variants={fadeInUp}
        className="flex flex-col items-center mb-6 text-center"
      >
        <div className="logo-box shadow-xl mb-4">
          <svg width="50" height="55" viewBox="0 0 50 55" fill="none" className="drawing-svg">
            {/* مسار الدرع */}
            <path
              className="logo-path-draw"
              d="M42.0513 28.5964C42.0513 41.5942 33.8263 48.0931 24.0503 51.8625C23.5384 52.0544 22.9823 52.0452 22.4758 51.8365C12.6763 48.0931 4.45128 41.5942 4.45128 28.5964V10.3994C4.45128 9.70998 4.69887 9.04877 5.13958 8.56126C5.58029 8.07374 6.17802 7.79986 6.80128 7.79986C11.5013 7.79986 17.3763 4.68038 21.4653 0.729047C21.9631 0.258522 22.5965 0 23.2513 0C23.9061 0 24.5394 0.258522 25.0373 0.729047C29.1498 4.70638 35.0013 7.79986 39.7013 7.79986C40.3245 7.79986 40.9223 8.07374 41.363 8.56126C41.8037 9.04877 42.0513 9.70998 42.0513 10.3994V28.5964Z"
              stroke="white" strokeOpacity="0.3" strokeWidth="2.5" strokeLinecap="round"
            />
            {/* مسار النبض */}
            <path
              className="logo-path-draw pulse-line"
              d="M46.7513 25.9969H40.9233C39.8963 25.9945 38.8968 26.3642 38.0777 27.0496C37.2587 27.735 36.6651 28.6984 36.3878 29.7923L30.8653 51.5246C30.8297 51.6596 30.7555 51.7782 30.6538 51.8626C30.5521 51.9469 30.4284 51.9925 30.3013 51.9925C30.1742 51.9925 30.0505 51.9469 29.9488 51.8626C29.8471 51.7782 29.7729 51.6596 29.7373 51.5246L16.7653 0.469173C16.7297 0.334181 16.6555 0.2156 16.5538 0.131229C16.4521 0.0468591 16.3284 0.00125122 16.2013 0.00125122C16.0742 0.00125122 15.9505 0.0468591 15.8488 0.131229C15.7471 0.2156 15.6729 0.334181 15.6373 0.469173L10.1148 22.2015C9.8386 23.2911 9.24856 24.2513 8.43424 24.9363C7.61993 25.6213 6.62581 25.9937 5.60281 25.9969H-0.248688"
              stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#004060]">MediCare</h1>
        <p className="text-gray-400 text-sm font-medium">شريكك الصحي الموثوق</p>
      </motion.div>

      {/* 2. الكارد الرئيسي مع الإسبينر والرسم الداخلي */}
      <motion.div
        custom={1} initial="hidden" animate="visible" variants={fadeInUp}
        className="w-full max-w-md bg-gradient-to-r from-blue-800 to-teal-600 rounded-[35px] p-8 text-white flex items-center justify-between shadow-2xl mb-8 relative"
      >
        <div className="spinner-wrapper">
          <svg className="spinner-svg" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r="50" className="spinner-path" />
          </svg>
          <div className="inner-pulse-logo">
            <svg width="55" height="55" viewBox="5 0 65 55" fill="none">
              <path
                className="logo-path-draw"
                d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5"
                stroke="#00BBA7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold mb-1">مرحباً بك في</h2>
          <h3 className="text-2xl font-black mb-1 italic">MediCare</h3>
          <p className="text-xs opacity-80 leading-relaxed">نربط المرضى بالرعاية الصحية الجيدة</p>
        </div>
      </motion.div>

      {/* 3. الأزرار */}
      <motion.div
        custom={2} initial="hidden" animate="visible" variants={fadeInUp}
        className="w-full max-w-md space-y-4"
      >
        <button
          className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all"
          onClick={() => navigate('/auth', { state: { role: 'patient', initialMode: 'login' } })}
        >
          تسجيل الدخول
        </button>
        <button
          className="w-full py-4 bg-white text-[#0F427D] border border-blue-100 rounded-2xl font-bold shadow-md hover:bg-blue-50 active:scale-95 transition-all"
          onClick={() => navigate('/role-selection', { state: { mode: 'signup' } })}
        >
          إنشاء حساب جديد
        </button>
      </motion.div>
    </div>
  );
};

export default Login;