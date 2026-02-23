import React, { useState, useEffect, useRef } from 'react';
import { Bell, User, Menu, X, Home, Users, Calendar, Pill, FileText, PhoneCall, Info, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useNavigate } from 'react-router-dom'; // إضافة React Router
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ patientData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // إغلاق dropdown عند الضغط خارجه
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { name: 'الرئيسية', icon: <Home size={18} />, path: '/' },
    { name: 'من نحن', icon: <Info size={18} />, path: '/about' },
    { name: 'الأطباء', icon: <Users size={18} />, path: '/doctors' },
    { name: 'المواعيد', icon: <Calendar size={18} />, path: '/appointments' },
    { name: 'جدول الأدوية', icon: <Pill size={18} />, path: '/meds' },
    { name: 'السجلات الطبية', icon: <FileText size={18} />, path: '/records' },
    { name: 'اتصل بنا', icon: <PhoneCall size={18} />, path: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-4 md:px-10 py-4 ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-100' : 'bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto flex items-center justify-between flex-row-reverse">
          
          {/* اللوجو - جعله قابل للضغط للعودة للرئيسية */}
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right flex flex-col items-end">
              <h1 className="text-2xl font-black text-[#004060] animate-typing">MediCare</h1>
              <p className="text-[10px] text-[#008080] font-bold tracking-[2px] mt-1 uppercase">Health System</p>
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
                    ${isActive ? 'text-[#008080]' : 'text-gray-500 hover:text-[#0F427D]'}
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
            <button onClick={() => setIsMobileMenuOpen(true)} className="xl:hidden p-2 bg-white rounded-xl border border-gray-100 shadow-sm text-[#004060]">
              <Menu size={24} />
            </button>

            <div className="relative p-2 md:p-2.5 bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <div 
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 md:gap-3 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm cursor-pointer group hover:border-[#008080] transition-all"
              >
                <div className="text-right hidden md:block pr-2">
                  <p className="text-xs font-black text-[#004060]">
                    {user?.name || patientData?.name || "زائر"}
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">
                    {user?.role === 'patient' ? 'مريض' : user?.role === 'doctor' ? 'طبيب' : 'زائر'}
                  </p>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-gray-400 hidden md:block transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                />
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-teal-50 border-2 border-white overflow-hidden flex items-center justify-center">
                  {patientData?.avatar ? (
                    <img src={patientData.avatar} alt="user" className="w-full h-full object-cover" />
                  ) : ( <User size={20} className="text-[#008080]" /> )}
                </div>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 z-50"
                    dir="rtl"
                  >
                    {/* User Info في الـ Dropdown */}
                    <div className="p-3 border-b border-gray-100 mb-2">
                      <p className="text-sm font-bold text-[#004060] mb-1">
                        {user?.name || "زائر"}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email || ""}</p>
                    </div>

                    {/* Profile Button - Static */}
                    <button
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-right text-gray-600 hover:bg-gray-50 transition-all duration-200 group"
                    >
                      <UserCircle size={20} className="text-[#008080] group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">الملف الشخصي</span>
                      <span className="mr-auto text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500">قريباً</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-3 rounded-xl text-right text-red-500 hover:bg-red-50 transition-all duration-200 group"
                    >
                      <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-bold">تسجيل الخروج</span>
                    </button>
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
                    onClick={() => setIsMobileMenuOpen(false)} // يغلق القائمة عند اختيار رابط
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

              <div className="mt-auto border-t border-gray-100 pt-6">
                 <div className="flex items-center justify-end gap-3 text-right">
                    <p className="text-sm font-black text-[#004060]">{patientData?.name || "زائر"}</p>
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><User size={20} className="text-gray-400" /></div>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;