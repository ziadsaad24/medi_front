import { CalendarCheck, Clock, User } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const AppointmentCard = ({ appointment }) => {
  const isNew = appointment.type === "جديد";
  const { isDark } = useTheme();

  return (
    <div
      className={`group w-full flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4
      p-3 md:p-4 theme-card backdrop-blur-md rounded-2xl
      shadow-[0_8px_30px_rgba(0,0,0,0.25)] border transition-all duration-300 hover:scale-[1.01] cursor-pointer
      ${isDark ? "hover:bg-white/10" : "hover:bg-[#0f427d]/5"}`}
    >

      {/* 👤 أيقونة */}
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full 
        bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 
        flex items-center justify-center 
        shadow-lg border border-white/10">
        <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
      </div>

      {/* 📋 البيانات */}
      <div className="flex-1 min-w-[120px]">
        <h4 className="theme-title text-sm md:text-lg font-bold mb-1">
          {appointment.patientName}
        </h4>

        <div className="flex items-center theme-title text-xs md:text-sm font-medium gap-2">
          <Clock className={`w-3 h-3 md:w-4 md:h-4 ${isDark ? "text-white/80" : "text-[#0f427d]"}`} />
          {appointment.time}
        </div>
      </div>

      {/* 🏷️ النوع */}
      <div
        className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border
        ${isNew
          ? "bg-[#008080]/20 text-[#0f427d] border-[#008080]/30"
          : isDark
            ? "bg-[#144A89]/20 text-blue-200 border-[#144A89]/30"
            : "bg-[#144A89]/12 text-[#0f427d] border-[#144A89]/25"
        }`}
      >
        {appointment.type === "جديد" ? "كشف جديد" : "مراجعة"}
      </div>

      {/* 📅 أيقونة */}
      <CalendarCheck className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? "text-white" : "text-[#0f427d]"} group-hover:text-[#00a9a9] transition-colors`} />
    </div>
  );
};

export default AppointmentCard;