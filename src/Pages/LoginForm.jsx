import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginForm = ({ role }) => {
  const navigate = useNavigate();
  const { login, loading, error, setError } = useAuth();
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // إزالة الأخطاء عند الكتابة
    setLocalError('');
    setError(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    
    try {
      const result = await login({
        email: loginData.email,
        password: loginData.password,
      });
      
      if (result.success) {
        // توجيه المستخدم حسب role
        if (result.user.role === 'patient') {
          navigate('/patient/home');
        } else if (result.user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (result.user.role === 'admin') {
          navigate('/admin/dashboard');
        }
      } else {
        // التحقق من حاجة المستخدم لتفعيل الإيميل
        if (result.needsEmailVerification) {
          navigate('/pending-verification');
        } else {
          setLocalError(result.message);
        }
      }
    } catch (err) {
      setLocalError('حدث خطأ في تسجيل الدخول. حاول مرة أخرى.');
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 animate-fadeIn" dir="rtl">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">مرحباً بعودتك</h2>
      
      {/* عرض رسالة الخطأ */}
      {(localError || error) && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
          {localError || error}
        </div>
      )}
      
      <form className="space-y-6 text-right" onSubmit={handleLogin}>
        <div>
          <label className="block text-xs font-bold mb-2">البريد الإلكتروني *</label>
          <input 
            name="email" 
            type="email" 
            value={loginData.email} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="w-full p-3 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-[#008080] disabled:opacity-50" 
            placeholder="doctor@example.com" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold mb-2">كلمة المرور *</label>
          <input 
            name="password" 
            type="password" 
            value={loginData.password} 
            onChange={handleChange} 
            required 
            disabled={loading}
            className="w-full p-3 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:border-[#008080] disabled:opacity-50" 
            placeholder="********" 
          />
        </div>
        <div className="flex justify-between items-center text-xs">
          <label className="flex items-center gap-2 text-gray-500">
            <input 
              name="rememberMe" 
              type="checkbox" 
              checked={loginData.rememberMe} 
              onChange={handleChange} 
              disabled={loading}
              className="accent-[#008080]" 
            />
            تذكرني لمدة 30 يوماً
          </label>
          <button 
            type="button"
            onClick={() => navigate('/forgot-password')} 
            className="text-blue-500 font-bold hover:underline"
          >
            نسيت كلمة المرور؟
          </button>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-xl font-bold shadow-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جارٍ تسجيل الدخول...
            </>
          ) : (
            'تسجيل الدخول'
          )}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;