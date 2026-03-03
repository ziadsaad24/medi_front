import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Clock, 
  Shield,
  Settings,
  LogOut,
  FileText,
  AlertCircle,
  ChevronLeft,
  BarChart3
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      title: 'لوحة التحكم',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      badge: null
    },
    {
      title: 'طلبات الأطباء',
      icon: Clock,
      path: '/admin/doctor-requests',
      badge: 12,
      badgeColor: 'bg-amber-500'
    },
    {
      title: 'إدارة المستخدمين',
      icon: Users,
      path: '/admin/users',
      badge: null
    },
    {
      title: 'إدارة الأطباء',
      icon: UserCheck,
      path: '/admin/doctors',
      badge: null
    },
    {
      title: 'الشكاوى والبلاغات',
      icon: AlertCircle,
      path: '/admin/complaints',
      badge: 3,
      badgeColor: 'bg-red-500'
    },
    {
      title: 'الإعدادات',
      icon: Settings,
      path: '/admin/settings',
      badge: null
    }
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div
      className={`fixed right-0 top-0 h-screen bg-white border-l border-gray-200 shadow-lg z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      dir="rtl"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0F427D] to-[#008080] rounded-xl flex items-center justify-center shadow-md">
                <svg width="50" height="50" viewBox="0 0 75 75" fill="none">
                  <path 
                    className="logo-path-draw"
                    d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5" 
                    stroke="#00BBA7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F427D]">MediCare</h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Admin Panel</p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="w-12 h-12 bg-gradient-to-br from-[#0F427D] to-[#008080] rounded-xl flex items-center justify-center mx-auto shadow-md">
              <svg width="50" height="50" viewBox="0 0 75 75" fill="none">
                <path 
                  className="logo-path-draw"
                  d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5" 
                  stroke="#00BBA7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <ul className="space-y-1">
          {menuItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={idx}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0F427D] text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                  
                  {!isCollapsed && (
                    <>
                      <span className="font-semibold text-sm">{item.title}</span>
                      {item.badge && (
                        <span className={`mr-auto px-2 py-0.5 rounded-full text-xs font-bold text-white ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {isCollapsed && item.badge && (
                    <span className={`absolute -top-1 -left-1 w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer - Logout */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 font-semibold"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>تسجيل الخروج</span>}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
      >
        <ChevronLeft 
          size={14} 
          className={`text-gray-600 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
        />
      </button>
    </div>
  );
};

export default AdminSidebar;
