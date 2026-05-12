import React, { useEffect, useRef, useState } from "react";
import { Bell, Search, Sun, Moon, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useDoctorNotifications } from "../hooks/use-doctor-notifications";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  profileImage: string | null;
  fullName?: string;
  specialization?: string;
}

export default function Navbar({
  profileImage,
  fullName,
  specialization,
}: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useDoctorNotifications();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={`backdrop-blur-2xl border-b px-4 md:px-8 py-3 md:py-4 shadow-lg ${
        isDark
          ? "bg-gradient-to-r from-slate-950/95 via-slate-900/90 to-cyan-950/80 border-white/10"
          : "theme-surface border-[#0f427d]/20"
      }`}
    >
      <div className="flex items-center justify-between gap-3">

        {/* 🔍 Search */}
        <div className="hidden md:flex items-center gap-3 md:gap-4 flex-1 max-w-full md:max-w-xl">
          <div className="relative flex-1">
            <Search className={`absolute mr-sm-8 md:mr-2 right-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 ${isDark ? "text-white/50" : "text-[#0f427d]/50"}`} />
            <input
              type="text"
              placeholder="البحث عن المرضى، المواعيد..."
              className="w-full pr-10 pl-3 py-2 md:py-3 rounded-2xl theme-input focus:outline-none transition-all text-sm md:text-base"
            />
          </div>
        </div>

        <button
          onClick={() => setIsSearchOpen((prev) => !prev)}
          className={`md:hidden relative p-2 rounded-2xl border transition-all ${
            isDark
              ? "bg-white/10 border-white/20 text-white"
              : "bg-white border-[#0f427d]/20 text-[#0f427d]"
          }`}
          title="البحث"
          aria-label="Open search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* 🔔 Right Side */}
        <div className="flex items-center gap-2 md:gap-6">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`relative p-2 md:p-3 rounded-2xl border transition-all ${
              isDark
                ? "bg-white/10 border-white/20 text-amber-300 hover:bg-white/20"
                : "bg-[#0f427d]/10 border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/15"
            }`}
            title={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="w-4 md:w-5 h-4 md:h-5" /> : <Moon className="w-4 md:w-5 h-4 md:h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsNotificationsOpen((prev) => !prev)}
              className="relative p-2 md:p-3 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 border border-white/10 hover:brightness-110 transition-all"
              aria-label="notifications"
            >
              <Bell className="w-4 md:w-5 h-4 md:h-5 text-white" />
              {unreadCount > 0 && (
                <>
                  <span className="absolute top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-[#144A89] flex items-center justify-center leading-none">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-[#144A89] animate-pulse"></span>
                </>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <>
                {/* Mobile overlay - no blur */}
                <div
                  className="fixed inset-0 bg-black/30 z-[140] md:hidden"
                  onClick={() => setIsNotificationsOpen(false)}
                />
                <div
                  className={`fixed md:absolute left-2 right-2 top-16 md:top-auto md:left-0 md:right-auto md:mt-2 w-auto md:w-[340px] max-w-sm md:max-w-none mx-auto md:mx-0 rounded-2xl shadow-2xl border overflow-hidden z-[150] ${
                    isDark
                      ? 'bg-slate-900 border-white/15'
                      : 'bg-white border-slate-100'
                  }`}
                  dir="rtl"
                >
                  {/* Header */}
                  <div className={`px-4 py-3 border-b ${
                    isDark
                      ? 'border-white/10 bg-gradient-to-l from-blue-900/30 to-cyan-900/30'
                      : 'border-slate-100 bg-gradient-to-l from-cyan-50 to-blue-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-[#004060]'}`}>التنبيهات</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            type="button"
                            onClick={markAllAsRead}
                            className={`text-[11px] font-bold rounded-full px-2 py-0.5 transition-colors ${
                              isDark
                                ? 'text-blue-300 bg-blue-900/40 border border-blue-700/40 hover:bg-blue-900/60'
                                : 'text-[#0F427D] bg-white border border-blue-100 hover:bg-blue-50'
                            }`}
                          >
                            قراءة الكل
                          </button>
                        )}
                        <span className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${
                          isDark
                            ? 'text-teal-300 bg-teal-900/40 border border-teal-700/40'
                            : 'text-[#008080] bg-white border border-teal-100'
                        }`}>
                          {unreadCount} جديد
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="max-h-[50vh] md:max-h-[340px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className={`p-8 text-center text-sm font-bold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                        لا توجد تنبيهات حالياً
                      </div>
                    ) : (
                      notifications.map((item: any) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            markAsRead(item.id);
                            navigate(item.route || '/doctor/dashboard');
                            setIsNotificationsOpen(false);
                          }}
                          className={`w-full text-right px-4 py-3 border-b last:border-b-0 transition-colors ${
                            isDark
                              ? `border-white/5 hover:bg-white/5 ${item.isRead ? 'opacity-60' : ''}`
                              : `border-slate-100 hover:bg-slate-50 ${item.isRead ? 'opacity-70' : ''}`
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-700'}`}>{item.title}</p>
                              <p className={`text-xs mt-1 leading-5 ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{item.message}</p>
                              {item.meta && (
                                <p className={`text-[11px] font-bold mt-1 ${isDark ? 'text-teal-400' : 'text-[#008080]'}`}>{item.meta}</p>
                              )}
                            </div>
                            <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                              item.isRead
                                ? (isDark ? 'bg-white/20' : 'bg-slate-300')
                                : (item.priority === 'urgent' ? 'bg-rose-500' : 'bg-emerald-500')
                            }`}></span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 👤 Profile */}
          <div className={`flex items-center gap-3 md:gap-6 px-3 md:px-5 py-1 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "theme-card"}`}>

            {/* Name */}
            <div className="text-right">
              <span className={`font-medium text-sm md:text-base ${isDark ? "text-white" : "theme-title"}`}>{fullName}</span>
              <p className={`text-[10px] md:text-[11px] font-medium ${isDark ? "text-white/50" : "theme-text-muted"}`}>{specialization}</p>
            </div>

            {/* Image */}
            <div className={`relative w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-full p-[2px] border-2 ${isDark ? "bg-white/10 border-white/20" : "bg-white border-[#0f427d]/20"}`}>
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Doctor"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className={`w-5 md:w-6 h-5 md:h-6 ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`} />
              )}
              <span className={`absolute bottom-0 left-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-2 ${isDark ? "border-[#144A89]" : "border-white"} rounded-full`}></span>
            </div>

          </div>
        </div>
      </div>

      {isSearchOpen && (
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-white/50" : "text-[#0f427d]/50"}`} />
            <input
              type="text"
              placeholder="البحث عن المرضى، المواعيد..."
              autoFocus
              className="w-full pr-10 pl-3 py-2.5 rounded-2xl theme-input focus:outline-none transition-all text-sm"
            />
          </div>
        </div>
      )}
    </header>
  );
}