import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  User,
  LogOut,
  ClipboardList
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { name: "لوحة التحكم", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { name: "سجلات المرضى", icon: Calendar, path: "/doctor/patients" },
    { name: "المواعيد", icon: CalendarCheck, path: "/doctor/settings" },
    { name: "الطلبات", icon: ClipboardList, path: "/doctor/requests" },
    { name: "الملف الشخصي", icon: User, path: "/doctor/profile" },
    { name: "تسجيل الخروج", icon: LogOut, path: "/" },
  ];

  return (
    <>
      {/* Sidebar Desktop Only */}
      <aside
        className="hidden md:block w-64 p-6
          bg-gradient-to-b from-blue-950/95 via-blue-900/90 to-cyan-800/85
          backdrop-blur-3xl border-l border-white/5 shadow-2xl 
          sticky top-0 h-screen"
        dir="rtl"
      >
        {/* Ambient Lights */}
        <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#144A89]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-20%] w-64 h-64 bg-[#008080]/10 rounded-full blur-[120px]" />

        {/* Logo */}
        <div className="mb-12 relative z-10">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-[#144A89] to-[#008080] rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <svg width="28" height="28" viewBox="0 0 75 75" fill="none">
                <path
                  d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white">MediCare</h1>
              <p className="text-[9px] font-bold tracking-[1px] text-[#008080] uppercase">
                Health System
              </p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="space-y-2 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                to={item.path}
                key={item.name}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden group
                  ${isActive
                    ? "text-white shadow-lg"
                    : "text-white/50 hover:text-white hover:bg-gradient-to-r from-[#144A89] to-[#008080]"
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-[#144A89] to-[#008080] opacity-50 backdrop-blur-lg" />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10 text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 📱 Bottom Navigation (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 border-t border-white/10 backdrop-blur-xl">
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                to={item.path}
                key={item.name}
                className="flex flex-col items-center justify-center"
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-white" : "text-white/50"}`} />
                {isActive && <div className="w-1 h-1 bg-white rounded-full mt-1" />}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}