import React, { useState, useEffect } from 'react';
import { Bell, User, Menu, X, Home, Users, Calendar, Pill, FileText, PhoneCall, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, Link, useLocation } from 'react-router-dom'; // أضفنا useLocation

const Navbar = ({ patientData }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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

  const navLinks = [
    { name: 'الرئيسية', icon: <Home size={18} />, path: '/' },
    { name: 'من نحن', icon: <Info size={18} />, path: '/about' },
    { name: 'الأطباء', icon: <Users size={18} />, path: '/doctors' },
    { name: 'المواعيد', icon: <Calendar size={18} />, path: '/appointments' },
    { name: 'جدول الأدوية', icon: <Pill size={18} />, path: '/meds' },
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
            <button onClick={() => setIsMobileMenuOpen(true)} className={`xl:hidden p-2 rounded-xl border shadow-sm transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 text-[#004060]' : 'bg-white/20 border-white/20 text-white'}`}>
              <Menu size={24} />
            </button>

            <div className={`relative p-2 md:p-2.5 rounded-2xl border shadow-sm cursor-pointer transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50' : 'bg-white/20 border-white/20 text-white hover:bg-white/30'}`}>
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            </div>

            <div className={`flex items-center gap-2 md:gap-3 p-1 rounded-2xl border shadow-sm cursor-pointer group transition-all ${!isHomePage || isScrolled ? 'bg-white border-gray-100' : 'bg-white/20 border-white/20'}`}>
              <div className="text-right hidden md:block pr-2">
                <p className={`text-xs font-black transition-colors ${!isHomePage || isScrolled ? 'text-[#004060]' : 'text-white'}`}>{patientData?.name || "زائر"}</p>
                <p className={`text-[10px] font-bold uppercase transition-colors ${!isHomePage || isScrolled ? 'text-gray-400' : 'text-teal-200/70'}`}>مريض محقق</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-teal-50 border-2 border-white overflow-hidden flex items-center justify-center">
                {patientData?.avatar ? (
                  <img src={patientData.avatar} alt="user" className="w-full h-full object-cover" />
                ) : ( <User size={20} className="text-[#008080]" /> )}
              </div>
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