import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderLogo from '../Components/HeaderLogo';
import BackButton from '../Components/BackButton';
import LoginForm from './LoginForm'; 
import SignupDoctor from './SignupDoctor';
import SignupPatient from './SignupPatient';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // استلام البيانات من صفحة اختيار الدور
  const { role, initialMode } = location.state || { role: 'patient', initialMode: 'signup' };
  
  // الحالة بتبدأ بناءً على الزرار اللي داس عليه في أول صفحة (دخول أو إنشاء)
  const [isLogin, setIsLogin] = useState(initialMode === 'login');

  // تحديد مسار العودة حسب الـ initialMode
  const backPath = initialMode === 'login' ? '/' : '/role-selection';

  // دالة للتعامل مع زر "إنشاء حساب"
  const handleSignupClick = () => {
    // لو جاي من صفحة تسجيل دخول، روح لاختيار الدور
    if (initialMode === 'login') {
      navigate('/role-selection', { state: { mode: 'signup' } });
    } else {
      // لو جاي من role-selection أصلاً، غير الحالة عادي
      setIsLogin(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6 pt-4">
      <BackButton path={backPath} />
      <HeaderLogo />

      {/* السويتش المقتبس من التصميم */}
      <div className="flex bg-[#E8F0FE] p-1 rounded-2xl w-full max-w-[400px] mb-8 mt-4 shadow-sm" dir="rtl">
        <button 
          onClick={handleSignupClick}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${!isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
        >
          إنشاء حساب
        </button>
        <button 
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all duration-300 ${isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
        >
          تسجيل دخول
        </button>
      </div>

    {/* داخل الـ return في AuthPage.jsx */}
<div className="w-full flex justify-center animate-fadeIn">
  {isLogin ? (
    <LoginForm role={role} /> 
  ) : (
    role === 'doctor' ? <SignupDoctor /> : <SignupPatient />
  )}
</div>
    </div>
  );
};

export default AuthPage;