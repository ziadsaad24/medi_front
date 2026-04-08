import React, { useState } from "react";
import { Bell, Search, Sun, Moon, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

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
          <button className="relative p-2  md:p-3 rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 border border-white/10  hover:brightness-110 transition-all">
            <Bell className="w-4 md:w-5 h-4 md:h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-[#144A89]"></span>
          </button>

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