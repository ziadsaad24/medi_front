import { useTheme } from "../context/ThemeContext";

export default function StatCard({ title, value, icon: Icon }) {
  const brandGradient = "from-blue-900 via-blue-800 to-cyan-700";
  const { isDark } = useTheme();

  return (
    <div className="stat-card-enter stat-card relative overflow-hidden p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl 
      theme-card backdrop-blur-xl shadow-lg group
      flex flex-row items-center justify-between gap-3 sm:gap-4">

      {/* Ambient glow - يظهر بشكل ناعم عند الهوفر */}
      <div className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-[80px]
        bg-gradient-to-br ${brandGradient} opacity-0 group-hover:opacity-[0.07]
        transition-opacity duration-700 ease-out pointer-events-none`} />

      {/* Shimmer light sweep - خط نور بيمشي مرة واحدة */}
      <div className="pointer-events-none absolute inset-0 stat-shimmer" />

      {/* النصوص */}
      <div className="relative z-10">
        <h3 className="theme-title text-xs sm:text-sm font-semibold mb-0.5 sm:mb-1 
          transition-transform duration-500 ease-out group-hover:translate-x-[-4px]">{title}</h3>
        <p className="theme-title text-2xl sm:text-3xl font-bold tracking-tight
          transition-transform duration-500 ease-out group-hover:translate-x-[-6px]">+{value}</p>
      </div>

      {/* الأيقونة */}
      <div className={`relative z-10 w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${brandGradient} 
        flex items-center justify-center shadow-lg border flex-shrink-0
        ${isDark ? "border-white/10" : "border-[#0f427d]/10"}
        transition-all duration-500 ease-out
        group-hover:scale-110 group-hover:rotate-[-6deg] group-hover:shadow-xl
        group-hover:shadow-cyan-700/20`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-500 ease-out group-hover:scale-110" />
      </div>

      {/* الخط السفلي - sweep واحد شيك من اليمين للشمال عند الهوفر */}
      <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden">
        <div className="h-full w-full stat-line-sweep rounded-full"
          style={{
            background: 'linear-gradient(270deg, #1e3a5f, #1e60a0, #0e7490, #06b6d4)',
          }}
        />
      </div>

      {/* Styles */}
      <style>{`
        .stat-card {
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.5s cubic-bezier(0.22, 1, 0.36, 1),
                      border-color 0.4s ease;
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -12px ${isDark ? 'rgba(6, 182, 212, 0.12)' : 'rgba(15, 66, 125, 0.15)'},
                      0 8px 16px -8px ${isDark ? 'rgba(6, 182, 212, 0.08)' : 'rgba(15, 66, 125, 0.1)'};
        }

        /* الخط السفلي */
        .stat-line-sweep {
          transform: scaleX(0);
          transform-origin: right;
        }
        .stat-card:hover .stat-line-sweep {
          animation: sweepRTL 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes sweepRTL {
          0% {
            transform: scaleX(0);
            transform-origin: right;
          }
          100% {
            transform: scaleX(1);
            transform-origin: right;
          }
        }

        /* Shimmer sweep */
        .stat-shimmer::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 60%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.5)'},
            transparent
          );
          transform: skewX(-20deg);
          transition: none;
        }
        .stat-card:hover .stat-shimmer::before {
          animation: shimmerSweep 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes shimmerSweep {
          0% { left: -100%; }
          100% { left: 130%; }
        }
      `}</style>
    </div>
  );
}