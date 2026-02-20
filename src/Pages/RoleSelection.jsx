import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/Login.css';
import BackButton from '../Components/BackButton';
import HeaderLogo from '../Components/HeaderLogo';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('patient');
  const navigate = useNavigate();

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };
// داخل ملف RoleSelection.jsx
const location = useLocation();
const mode = location.state?.mode || 'signup'; // بنعرف هو جاي من زرار دخول ولا إنشاء

const handleContinue = () => {
  // بننقل المستخدم لصفحة الـ Auth الموحدة وبنبعت له البيانات
  navigate('/auth', { 
    state: { 
      role: selectedRole, 
      initialMode: mode 
    } 
  });
};

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6 text-right font-sans overflow-x-hidden">
      <BackButton path="/" />
      <HeaderLogo />
  

      {/* باقي الكود يظل كما هو (العنوان والكروت) */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-10">
        <h2 className="text-[#006D85] text-3xl font-bold mb-3">ابدأ رحلتك الصحية معنا</h2>
        <p className="text-gray-500 text-sm px-4">اختر نوع حسابك للوصول إلى منصة الرعاية الصحية الأكثر تطوراً في المنطقة</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center items-stretch mb-12 px-4">
        {/* كارت مريض وكارت طبيب يظلان كما هما */}
        <motion.div 
          onClick={() => setSelectedRole('patient')}
          className={`relative flex-1 p-8 rounded-[32px] cursor-pointer transition-all duration-300 shadow-xl flex flex-col bg-white border-2 border-transparent
            ${selectedRole === 'patient' ? 'patient-active scale-105 z-10' : 'opacity-80'}`}
        >
          {selectedRole === 'patient' && (
            <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-[#34B18A] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg font-bold z-20">✓</div>
          )}
          <div className="flex flex-col items-center mb-6">
            <div className="icon-box bg-[#34B18A]/10 mb-4">
              <svg className="w-10 h-10 text-[#34B18A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">مريض</h3>
            <p className="text-gray-400 text-xs">سجل كمريض</p>
          </div>
          <ul className="space-y-4 text-sm flex-grow">
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">حجز المواعيد <span className="w-2 h-2 rounded-full bg-[#34B18A]"></span></li>
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">عرض السجل الطبي <span className="w-2 h-2 rounded-full bg-[#34B18A]"></span></li>
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">التواصل مع الأطباء <span className="w-2 h-2 rounded-full bg-[#34B18A]"></span></li>
          </ul>
        </motion.div>

        <motion.div 
          onClick={() => setSelectedRole('doctor')}
          className={`relative flex-1 p-8 rounded-[32px] cursor-pointer transition-all duration-300 shadow-xl flex flex-col bg-white border-2 border-transparent
            ${selectedRole === 'doctor' ? 'doctor-active scale-105 z-10' : 'opacity-80'}`}
        >
          {selectedRole === 'doctor' && (
            <div className="absolute -top-3 right-1/2 translate-x-1/2 bg-gradient-to-r from-[#2B7FFF] to-[#4F39F6] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg font-bold z-20">✓</div>
          )}
          <div className="flex flex-col items-center mb-6">
            <div className="icon-box bg-blue-50 mb-4">
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4V8" stroke="#4F39F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 4V8" stroke="#4F39F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 6H8C6.93913 6 5.92172 6.42143 5.17157 7.17157C4.42143 7.92172 4 8.93913 4 10V18C4 21.1826 5.26428 24.2348 7.51472 26.4853C9.76516 28.7357 12.8174 30 16 30C19.1826 30 22.2348 28.7357 24.4853 26.4853C26.7357 24.2348 28 21.1826 28 18V10C28 8.93913 27.5786 7.92172 26.8284 7.17157C26.0783 6.42143 25.0609 6 24 6H22" stroke="#4F39F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 30C16 33.1826 17.2643 36.2348 19.5147 38.4853C21.7652 40.7357 24.8174 42 28 42C31.1826 42 34.2348 40.7357 36.4853 38.4853C38.7357 36.2348 40 33.1826 40 30V24" stroke="#4F39F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M40 24C42.2091 24 44 22.2091 44 20C44 17.7909 42.2091 16 40 16C37.7909 16 36 17.7909 36 20C36 22.2091 37.7909 24 40 24Z" stroke="#4F39F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">طبيب</h3>
            <p className="text-gray-400 text-xs">سجل كأخصائي رعاية صحية</p>
          </div>
          <ul className="space-y-4 text-sm flex-grow">
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">إدارة مواعيد المرضى <span className="w-2 h-2 rounded-full bg-[#4F39F6]"></span></li>
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">الوصول إلى السجلات الطبية <span className="w-2 h-2 rounded-full bg-[#4F39F6]"></span></li>
            <li className="flex items-center justify-end gap-2 font-medium text-gray-600">تقديم الاستشارات <span className="w-2 h-2 rounded-full bg-[#4F39F6]"></span></li>
          </ul>
        </motion.div>
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={handleContinue}
        className="bg-[#00BBA7] text-white px-16 py-4 rounded-full font-bold shadow-lg hover:shadow-2xl transition-all hover:brightness-110 mb-10"
      >
        متابعة التسجيل
      </motion.button>
    </div>
  );
};

export default RoleSelection;
 