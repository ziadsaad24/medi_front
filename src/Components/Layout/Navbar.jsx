import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, X, Home, Users, Calendar, Pill, FileText, PhoneCall, Info, LogOut, UserCircle, ChevronDown, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks/use-notifications';
import { useTheme } from '../../context/ThemeContext';

const Navbar = (props = {}) => {
  const { patientData } = props;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  // 1. الحصول على المسار الحالي
  const location = useLocation();

  // 2. تحديد ما إذا كانت الصفحة الحالية هي الرئيسية
  // سنفترض أن '/' هي home و '/patient/home' هي المسار الآخر
  const isHomePage = location.pathname === '/' || location.pathname === '/patient/home' || location.pathname === '/home';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق الـ dropdown لما تضغط برة
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserMenuOpen && !event.target.closest('.user-dropdown-container')) {
        setIsUserMenuOpen(false);
      }

      if (isNotificationsOpen && !event.target.closest('.notifications-dropdown-container')) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen, isNotificationsOpen]);

  const navLinks = [
    { name: 'الرئيسية', icon: <Home size={18} />, path: '/home' },
    { name: 'من نحن', icon: <Info size={18} />, path: '/about' },
    { name: 'الأطباء', icon: <Users size={18} />, path: '/doctors' },
    { name: 'المواعيد', icon: <Calendar size={18} />, path: '/appointments' },
    { name: 'جدول الأدوية', icon: <Pill size={18} />, path: '/medications' },
    { name: 'السجلات الطبية', icon: <FileText size={18} />, path: '/recorded' },
    { name: 'اتصل بنا', icon: <PhoneCall size={18} />, path: '/contact' },
  ];

  return (
    <>
      {/* 3. تحديث الكلاسات بناءً على الصفحة والسكول */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-10 py-4 ${
        isHomePage 
          ? (isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-transparent')
          : 'bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200/50' 
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between flex-row-reverse">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right flex flex-col items-end">
              {/* تغيير لون النص بناءً على الخلفية في الصفحة الرئيسية */}
              <h1 className={`text-2xl font-black transition-colors duration-500 ${!isHomePage || isScrolled ? 'text-[#004060]' : 'text-white'}`}>MediCare</h1>
              <p className={`text-[10px] font-bold tracking-[2px] mt-1 uppercase transition-colors duration-500 ${!isHomePage || isScrolled ? 'text-[#008080]' : 'text-teal-200'}`}>Health System</p>
            </div>
            <div className="w-11 h-11 bg-gradient-to-br from-[#0F427D] to-[#008080] rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden">
              <svg width="50" height="50" viewBox="0 0 75 75" fill="none">
                <path 
                  className="logo-path-draw"
                  d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5" 
                  stroke="#00BBA7" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"
                />
              </svg>
            </div>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden xl:flex items-center gap-6 flex-row-reverse">
            {navLinks.map((link, idx) => (
              <li key={idx}>
                <NavLink 
                  to={link.path}
                  className={({ isActive }) => `
                    text-[13px] font-bold transition-all duration-300 relative group
                    ${isActive 
                      ? 'text-[#008080]' 
                      : (!isHomePage || isScrolled ? 'text-gray-500 hover:text-[#0F427D]' : 'text-white/80 hover:text-white')}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {link.name}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#008080] transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User Actions */}
          <div className="flex items-center gap-3 flex-row-reverse">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border shadow-sm transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 text-[#004060]' : 'bg-white/20 border-white/20 text-white'}`}
              title={isDark ? 'تفعيل الوضع الفاتح' : 'تفعيل الوضع الداكن'}
              aria-label="toggle-theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setIsMobileMenuOpen(true)} className={`xl:hidden p-2 rounded-xl border shadow-sm transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 text-[#004060]' : 'bg-white/20 border-white/20 text-white'}`}>
              <Menu size={24} />
            </button>

            <div className="relative notifications-dropdown-container">
              <button
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className={`relative p-2 md:p-2.5 rounded-2xl border shadow-sm cursor-pointer transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50' : 'bg-white/20 border-white/20 text-white hover:bg-white/30'}`}
                aria-label="notifications"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute top-1 right-1 min-w-[19px] h-[19px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[150]"
                    dir="rtl"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 bg-gradient-to-l from-cyan-50 to-blue-50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-[#004060]">التنبيهات</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={markAllAsRead}
                              className="text-[11px] font-bold text-[#0F427D] bg-white border border-blue-100 rounded-full px-2 py-0.5 hover:bg-blue-50 transition-colors"
                            >
                              قراءة الكل
                            </button>
                          )}
                          <span className="text-[11px] font-bold text-[#008080] bg-white border border-teal-100 rounded-full px-2 py-0.5">
                            {unreadCount} جديد
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-[340px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-sm font-bold">
                          لا توجد تنبيهات حالياً
                        </div>
                      ) : (
                        notifications.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              markAsRead(item.id);
                              navigate(item.route || '/medications');
                              setIsNotificationsOpen(false);
                            }}
                            className={`w-full text-right px-4 py-3 border-b last:border-b-0 border-slate-100 hover:bg-slate-50 transition-colors ${item.isRead ? 'opacity-70' : ''}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="text-sm font-black text-slate-700">{item.title}</p>
                                <p className="text-xs text-slate-500 mt-1 leading-5">{item.message}</p>
                                <p className="text-[11px] text-[#008080] font-bold mt-1">{item.meta}</p>
                              </div>
                              <span className={`mt-1 w-2.5 h-2.5 rounded-full ${item.isRead ? 'bg-slate-300' : (item.priority === 'urgent' ? 'bg-rose-500' : 'bg-emerald-500')}`}></span>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User Dropdown */}
            <div className="relative user-dropdown-container">
              <div 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex items-center gap-2 md:gap-3 p-1 rounded-2xl border shadow-sm cursor-pointer group transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 hover:border-gray-200' : 'bg-white/20 border-white/20 hover:bg-white/30'}`}
              >
                <ChevronDown 
                  size={16} 
                  className={`transition-all duration-300 hidden md:block ${isUserMenuOpen ? 'rotate-180' : ''} ${!isHomePage || isScrolled ? 'text-gray-400' : 'text-white/70'}`} 
                />
                <div className="text-right hidden md:block pr-2">
                  <p className={`text-xs font-black transition-colors ${!isHomePage || isScrolled ? 'text-[#004060]' : 'text-white'}`}>
                    {user?.name || patientData?.name || "زائر"}
                  </p>
                  <p className={`text-[10px] font-bold uppercase transition-colors ${!isHomePage || isScrolled ? 'text-gray-400' : 'text-teal-200/70'}`}>
                    مريض محقق
                  </p>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-teal-50 border-2 border-white overflow-hidden flex items-center justify-center">
                  <User size={20} className="text-[#008080]" />
                </div>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[150]"
                    dir="rtl"
                  >
                    {/* User Info في الـ Dropdown */}
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-br from-[#0F427D]/5 to-[#008080]/5">
                      <p className="text-sm font-black text-[#004060]">{user?.name || patientData?.name || "زائر"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user?.email || "guest@medicare.com"}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-teal-50 text-[#008080] text-[10px] font-bold rounded-full border border-teal-100">
                        مريض محقق
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/patient/profile');
                        }}
                        className="w-full flex items-center justify-end gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <span className="text-sm font-bold text-gray-700 group-hover:text-[#0F427D]">الملف الشخصي</span>
                        <UserCircle size={20} className="text-gray-400 group-hover:text-[#0F427D]" />
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center justify-end gap-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                      >
                        <span className="text-sm font-bold text-gray-700 group-hover:text-red-600">تسجيل خروج</span>
                        <LogOut size={20} className="text-gray-400 group-hover:text-red-600" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* --- Mobile Menu --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] xl:hidden" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-[280px] bg-white z-[201] shadow-2xl xl:hidden flex flex-col p-6">
              <div className="flex items-center justify-between flex-row-reverse mb-10">
                <h2 className="text-xl font-black text-[#004060]">القائمة</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-lg text-gray-400"><X size={20} /></button>
              </div>
              <div className="flex flex-col gap-2">
                {navLinks.map((link, idx) => (
                  <NavLink 
                    key={idx}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center justify-end gap-4 p-4 rounded-2xl font-bold transition-all duration-300 group
                      ${isActive 
                        ? 'bg-gradient-to-l from-[#008080] to-[#0F427D] text-white shadow-lg shadow-teal-900/20' 
                        : 'text-gray-500 hover:bg-gray-50 hover:pr-6 hover:text-[#008080]'}
                    `}
                  >
                    <span>{link.name}</span>
                    <span className="shrink-0">{link.icon}</span>
                  </NavLink>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;