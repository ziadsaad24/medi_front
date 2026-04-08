import React from "react";
import { Bell, Search, User } from "lucide-react";

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
  return (
    <header className="bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-cyan-800/85 backdrop-blur-2xl border-b border-white/10 px-4 md:px-8 py-3 md:py-4 shadow-lg">
      <div className="flex items-center justify-between">

        {/* 🔍 Search */}
        <div className="flex items-center gap-3 md:gap-4 flex-1 max-w-full  md:max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute mr-sm-8 md:mr-2 right-3 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-white/50" />
            <input
              type="text"
              placeholder="البحث عن المرضى، المواعيد..."
              className="w-full pr-10 pl-3 py-2 md:py-3 rounded-2xl bg-gradient-to-l from-blue-950/55 via-blue-900/90 to-cyan-800/85 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-all text-sm md:text-base"
            />
          </div>
        </div>

        {/* 🔔 Right Side */}
        <div className="flex items-center gap-3 md:gap-6">

          {/* Notifications */}
          <button className="relative p-2  md:p-3 rounded-2xl bg-gradient-to-r from-[#144A89] to-[#008080] border border-white/10  hover:bg-white/20 transition-all">
            <Bell className="w-4 md:w-5 h-4 md:h-5 text-white" />
            <span className="absolute top-1 right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-red-500 rounded-full border-2 border-[#144A89]"></span>
          </button>

          {/* 👤 Profile */}
          <div className="flex items-center gap-3 md:gap-6 px-3 md:px-5 py-1 rounded-2xl bg-gradient-to-l from-blue-950/95 via-blue-900/90 to-cyan-800/85 border border-white/10">

            {/* Name */}
            <div className="text-right">
              <span className="text-white font-medium text-sm md:text-base">{fullName}</span>
              <p className="text-white/50 text-[10px] md:text-[11px] font-medium">{specialization}</p>
            </div>

            {/* Image */}
            <div className="relative w-10 md:w-12 h-10 md:h-12 flex items-center justify-center rounded-full p-[2px] bg-white/10 border-2 border-white/20">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Doctor"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <User className="w-5 md:w-6 h-5 md:h-6 text-white/70" />
              )}
              <span className="absolute bottom-0 left-0 w-3 h-3 md:w-3.5 md:h-3.5 bg-green-500 border-2 border-[#144A89] rounded-full"></span>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}