import { useTheme } from "../context/ThemeContext";

export default function StatCard({ title, value, icon: Icon }) {
  const brandGradient = "from-blue-900 via-blue-800 to-cyan-700";
  const { isDark } = useTheme();

  return (
    <div className="stat-card-enter relative overflow-hidden mb-10 mt-10 p-6 rounded-3xl 
      theme-card backdrop-blur-xl shadow-lg 
      transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl group
      flex flex-row items-center justify-between gap-4">

      {/* خلفية جمالية */}
      <div className={`absolute inset-0 bg-gradient-to-br ${brandGradient} 
        opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

      <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-[380%] transition-all duration-700" />

      {/* النصوص */}
      <div>
        <h3 className="theme-title text-sm font-semibold mb-1">{title}</h3>
        <p className="theme-title text-3xl font-bold tracking-tight">+{value}</p>
      </div>

      {/* الأيقونة */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${brandGradient} 
        flex items-center justify-center shadow-lg border ${isDark ? "border-white/10" : "border-[#0f427d]/10"}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* الخط السفلي */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 w-full scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}