import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * مكون لحماية الصفحات التي تحتاج تسجيل دخول
 * 
 * @param {object} props
 * @param {React.ReactNode} props.children - المحتوى المراد حمايته
 * @param {string|string[]} props.allowedRoles - الأدوار المسموح بها (اختياري)
 * @param {string} props.redirectTo - صفحة التوجيه في حال عدم السماح (افتراضي: /)
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = null, 
  redirectTo = '/' 
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (user.role === 'patient' && !user.email_verified_at) {
    return <Navigate to="/pending-verification" replace />;
  }

  if (allowedRoles) {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      const roleRedirects = {
        patient: '/patient/home',
        doctor: '/doctor/dashboard',
        admin: '/admin/dashboard',
      };

      return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
