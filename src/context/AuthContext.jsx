import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI, clearApiCache } from '../services/api';

// إنشاء Context
const AuthContext = createContext(null);
const PRESERVED_LOCAL_STORAGE_KEYS = new Set(['medicare-theme']);

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

  const extractAuthPayload = (response) => {
    const root = response || {};
    const data = root?.data || {};

    const token =
      root?.token ||
      root?.access_token ||
      data?.token ||
      data?.access_token ||
      null;

    const user = root?.user || data?.user || null;

    return { token, user };
  };

  const sanitizeToken = (rawToken) => {
    if (!rawToken || rawToken === 'undefined' || rawToken === 'null') return null;
    return String(rawToken).replace(/^Bearer\s+/i, '').trim();
  };

  const clearClientSession = () => {
    clearApiCache();

    Object.keys(localStorage).forEach((key) => {
      if (PRESERVED_LOCAL_STORAGE_KEYS.has(key)) return;
      localStorage.removeItem(key);
    });

    Object.keys(sessionStorage).forEach((key) => {
      sessionStorage.removeItem(key);
    });
  };

  // التحقق من وجود token عند تحميل الصفحة
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      const validToken = sanitizeToken(token);

      if (validToken && savedUser) {
        try {
          // 🚫 TEMPORARILY DISABLED - API validation - RESTORE: See RESTORE_INSTRUCTIONS.md
          // const response = await authAPI.getCurrentUser();
          // setUser(response.user);
          
          // ⚠️ FRONTEND DEVELOPMENT MODE: Use localStorage directly
          setUser(JSON.parse(savedUser));
        } catch (err) {
          // Token غير صالح، احذفه
          clearClientSession();
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
      const { token, user } = extractAuthPayload(response);
      const validToken = sanitizeToken(token);
      const userData = user || {};

      const isDoctorApproved = () => {
        // بعض نسخ الباكيند تستخدم status (active/pending) بدل is_active.
        if (typeof userData.status === 'string') {
          return userData.status.toLowerCase() === 'active';
        }

        if (userData.is_active === undefined || userData.is_active === null) {
          return true;
        }

        return !(
          userData.is_active === false ||
          userData.is_active === 0 ||
          userData.is_active === '0' ||
          userData.is_active === 'false'
        );
      };
      
      // تحقق من تفعيل الإيميل (للمريض فقط)
      if (userData.role === 'patient' && !userData.email_verified_at) {
        clearClientSession();
        // لا تحفظ token - فقط احفظ email للسماح بإعادة إرسال رسالة التحقق
        localStorage.setItem('pending_verification_email', userData.email);
        setLoading(false);
        return { success: false, message: 'يرجى تفعيل بريدك الإلكتروني أولاً', needsEmailVerification: true };
      }
      
      // تحقق من أن الطبيب مفعّل
      if (userData.role === 'doctor' && !isDoctorApproved()) {
        setError('حسابك قيد المراجعة من قبل الإدارة. سيتم إشعارك عند التفعيل.');
        setLoading(false);
        return { success: false, message: 'حسابك قيد المراجعة' };
      }

      // احفظ البيانات
      if (!validToken) {
        setLoading(false);
        return { success: false, message: 'تعذر إتمام تسجيل الدخول: التوكن غير موجود في استجابة الخادم' };
      }

      // نظّف أي بيانات جلسة قديمة قبل حفظ الحساب الجديد (role switch safe).
      clearClientSession();

      localStorage.setItem('token', validToken);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
      
      return { success: true, user: userData };
    } catch (err) {
      clearClientSession();
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
      const { token, user } = extractAuthPayload(response);
      const validToken = sanitizeToken(token);
      
      // التحقق من email verification
      const needsVerification = !user?.email_verified_at;
      
      if (needsVerification) {
        clearClientSession();
        // لا تحفظ token - فقط احفظ email للسماح بإعادة الإرسال
        localStorage.setItem('pending_verification_email', user?.email || '');
        // لا تعيّن user في state
        setUser(null);
      } else {
        clearClientSession();
        // الحساب مفعّل، احفظ token والمستخدم
        if (validToken) {
          localStorage.setItem('token', validToken);
        }
        localStorage.setItem('user', JSON.stringify(user || {}));
        setUser(user || null);
      }
      
      setLoading(false);
      
      return { 
        success: true, 
        user: user || null,
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
      clearClientSession();
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
    const token = sanitizeToken(localStorage.getItem('token'));
    return Boolean(user && token);
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