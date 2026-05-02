import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * يمنع الوصول لصفحات تسجيل الدخول/التسجيل عندما يكون المستخدم مسجل دخول.
 */
const PublicRoute = ({ children }) => {
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

  if (user) {
    const homeRoutes = {
      patient: '/patient/home',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard',
    };

    return <Navigate to={homeRoutes[user.role] || '/'} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
