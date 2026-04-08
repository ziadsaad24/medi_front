import { Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export function AppointmentsHeader() {
  const { isDark } = useTheme();

  return (
    <div className="relative backdrop-blur-xl theme-card rounded-3xl shadow-2xl overflow-hidden mb-8">
      
      {/* Decorative Background Gradient */}
      <div className={`absolute inset-0 backdrop-blur-md pointer-events-none ${isDark ? "bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-cyan-950/75" : "bg-gradient-to-b from-[#f8fbff]/85 via-[#ecf5ff]/85 to-[#e7f7f7]/85"}`} />
      
      <div className="relative p-5 sm:p-6 md:p-8 lg:p-10">
        
     <div className="flex flex-row flex-wrap items-center justify-between gap-4 md:gap-6">
          
          {/* Main Content */}
          <div className="flex items-start gap-4 md:gap-6 flex-1">
            
            {/* Text Content */}
            <div className="flex-1">
              <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-3 ${isDark ? "text-white" : "text-[#0f427d]"}`}>
                إدارة الجداول  المواعيد
              </h1>
              <p className={`text-sm sm:text-base md:text-lg ${isDark ? "text-white/80" : "text-[#0f427d]/80"}`}>
                نظم أوقات عملك بسهولة
              </p>
            </div>
          </div>
          
          {/* Icon */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-2xl md:rounded-3xl backdrop-blur-xl border flex items-center justify-center shadow-2xl flex-shrink-0 ${isDark ? "bg-white/10 border-white/20" : "bg-[#0f427d]/10 border-[#0f427d]/20"}`}>
              <Calendar className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${isDark ? "text-white" : "text-[#0f427d]"}`} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}