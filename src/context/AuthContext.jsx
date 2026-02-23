import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

// إنشاء Context
const AuthContext = createContext(null);

// Custom Hook للوصول للـ Context بسهولة
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // التحقق من وجود token عند تحميل الصفحة
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');

      if (token && savedUser) {
        try {
          // 🚫 TEMPORARILY DISABLED - API validation - RESTORE: See RESTORE_INSTRUCTIONS.md
          // const response = await authAPI.getCurrentUser();
          // setUser(response.user);
          
          // ⚠️ FRONTEND DEVELOPMENT MODE: Use localStorage directly
          setUser(JSON.parse(savedUser));
        } catch (err) {
          // Token غير صالح، احذفه
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        // لو مش فيه token، تأكد إن مفيش user في localStorage
        localStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // تسجيل دخول
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.login(credentials);
      
      // تحقق من تفعيل الإيميل
      if (!response.user.email_verified_at) {
        // لا تحفظ token - فقط احفظ email للسماح بإعادة إرسال رسالة التحقق
        localStorage.setItem('pending_verification_email', response.user.email);
        setLoading(false);
        return { success: false, message: 'يرجى تفعيل بريدك الإلكتروني أولاً', needsEmailVerification: true };
      }
      
      // تحقق من أن الطبيب مفعّل
      if (response.user.role === 'doctor' && !response.user.is_active) {
        setError('حسابك قيد المراجعة من قبل الإدارة. سيتم إشعارك عند التفعيل.');
        setLoading(false);
        return { success: false, message: 'حسابك قيد المراجعة' };
      }

      // احفظ البيانات
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setLoading(false);
      
      return { success: true, user: response.user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'خطأ في تسجيل الدخول';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  // تسجيل مستخدم جديد (Patient)
  const registerPatient = async (data) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.registerPatient(data);
      
      // التحقق من email verification
      const needsVerification = !response.user.email_verified_at;
      
      if (needsVerification) {
        // لا تحفظ token - فقط احفظ email للسماح بإعادة الإرسال
        localStorage.setItem('pending_verification_email', response.user.email);
        // لا تعيّن user في state
        setUser(null);
      } else {
        // الحساب مفعّل، احفظ token والمستخدم
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
      }
      
      setLoading(false);
      
      return { 
        success: true, 
        user: response.user,
        needsEmailVerification: needsVerification
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'خطأ في التسجيل';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage, errors: err.response?.data?.errors };
    }
  };

  // تسجيل طبيب جديد (Doctor)
  const registerDoctor = async (formData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await authAPI.registerDoctor(formData);
      
      // الطبيب يحتاج موافقة، لا تسجل دخول تلقائي
      setLoading(false);
      
      return { 
        success: true, 
        message: 'تم التسجيل بنجاح. سيتم مراجعة حسابك قريباً.',
        needsApproval: true 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'خطأ في التسجيل';
      setError(errorMessage);
      setLoading(false);
      return { success: false, message: errorMessage, errors: err.response?.data?.errors };
    }
  };

  // تسجيل خروج
  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // احذف البيانات المحلية في جميع الأحوال
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('pending_verification_email');
      setUser(null);
    }
  };

  // تحديث معلومات المستخدم
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // التحقق من role معين
  const hasRole = (role) => {
    return user?.role === role;
  };

  // التحقق من تسجيل الدخول
  const isAuthenticated = () => {
    return !!user;
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    registerPatient,
    registerDoctor,
    updateUser,
    hasRole,
    isAuthenticated,
    setError, // لإزالة الأخطاء يدوياً
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
