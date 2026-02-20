import React, { useState } from 'react';

const LoginForm = ({ role }) => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log(`محاولة تسجيل دخول (${role}):`, loginData);
    // الربط مع الباكند هنا
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-fadeIn" dir="rtl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">مرحباً بعودتك</h2>
      <form className="space-y-6 text-right" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-bold mb-2">البريد الإلكتروني *</label>
          <input name="email" type="email" value={loginData.email} onChange={handleChange} required className="w-full p-3 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-[#008080]" placeholder="doctor@example.com" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2">كلمة المرور *</label>
          <input name="password" type="password" value={loginData.password} onChange={handleChange} required className="w-full p-3 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-[#008080]" placeholder="********" />
        </div>
        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2 text-gray-500">
            <input name="rememberMe" type="checkbox" checked={loginData.rememberMe} onChange={handleChange} className="accent-[#008080]" />
            تذكرني لمدة 30 يوماً
          </label>
          <a href="#" className="text-blue-500 font-bold hover:underline">نسيت كلمة المرور؟</a>
        </div>
        <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-xl font-bold shadow-lg mt-4">تسجيل الدخول</button>
      </form>
    </div>
  );
};

export default LoginForm;