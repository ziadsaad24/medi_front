import { Calendar, Clock, Video, MessageCircle, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface AppointmentCardProps {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: string;
  avatarUrl: string;
  index: number;
}

export function AppointmentCard({
  doctorName,
  specialty,
  date,
  time,
  type,
  status,
  avatarUrl,
  index,
}: AppointmentCardProps) {
  const { isDark } = useTheme();

  const statusBadgeClass =
    status === "مؤكد"
      ? (isDark
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
          : "bg-emerald-100 text-emerald-700 border border-emerald-200")
      : (isDark
          ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
          : "bg-amber-100 text-amber-700 border border-amber-200");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.03, y: -5 }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <div className={`relative h-full overflow-hidden rounded-[20px] p-6 shadow-[0_8px_32px_0_rgba(15,66,125,0.1)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(15,66,125,0.2)] ${isDark ? 'bg-slate-900/75 border border-slate-700/60' : 'bg-white/70 border border-white/70'}`}>
        {/* Floating Animation */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
          className="h-full"
        >
          {/* Status Badge */}
          <div className="mb-4 flex items-start justify-between">
            <div
              className={`rounded-full px-4 py-1.5 text-sm ${statusBadgeClass} backdrop-blur-sm`}
            >
              {status}
            </div>
            {/* Doctor Avatar */}
            <div className="relative">
              <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg">
                <img
                  src={avatarUrl}
                  alt={doctorName}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-white bg-green-400"></div>
            </div>
          </div>

          {/* Doctor Info */}
          <div className="mb-5 text-right">
            <h3 className={`mb-1 ${isDark ? 'text-slate-100' : 'text-[#0F427D]'}`}>{doctorName}</h3>
            <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{specialty}</p>
          </div>

          {/* Appointment Details */}
          <div className="mb-6 space-y-3">
            {/* Date */}
            <div className="flex items-center justify-end gap-3">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{date}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${isDark ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' : 'bg-gradient-to-br from-[#0F427D]/10 to-[#008080]/10 group-hover:from-[#0F427D]/20 group-hover:to-[#008080]/20'}`}>
                <Calendar className="h-4 w-4 text-[#0F427D]" />
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center justify-end gap-3">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{time}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${isDark ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' : 'bg-gradient-to-br from-[#0F427D]/10 to-[#008080]/10 group-hover:from-[#0F427D]/20 group-hover:to-[#008080]/20'}`}>
                <Clock className="h-4 w-4 text-[#008080]" />
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center justify-end gap-3">
              <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{type}</span>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${isDark ? 'bg-cyan-500/10 group-hover:bg-cyan-500/20' : 'bg-gradient-to-br from-[#0F427D]/10 to-[#008080]/10 group-hover:from-[#0F427D]/20 group-hover:to-[#008080]/20'}`}>
                <Video className="h-4 w-4 text-[#008080]" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Icon Buttons */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm transition-all hover:border-[#008080] hover:bg-[#008080]/10 hover:shadow-[0_0_15px_rgba(0,128,128,0.3)] ${isDark ? 'border border-cyan-400/30 bg-slate-800/80' : 'border border-[#008080]/30 bg-white/60'}`}
            >
              <MessageCircle className="h-5 w-5 text-[#008080]" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm transition-all hover:border-[#0F427D] hover:bg-[#0F427D]/10 hover:shadow-[0_0_15px_rgba(15,66,125,0.3)] ${isDark ? 'border border-blue-400/30 bg-slate-800/80' : 'border border-[#0F427D]/30 bg-white/60'}`}
            >
              <Phone className="h-5 w-5 text-[#0F427D]" />
            </motion.button>

            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex-1 overflow-hidden rounded-xl px-5 py-2.5 text-white shadow-lg transition-all hover:shadow-xl"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[#0F427D] to-[#008080]"
                whileHover={{
                  background: [
                    "linear-gradient(to right, #0F427D, #008080)",
                    "linear-gradient(to right, #008080, #0F427D)",
                    "linear-gradient(to right, #0F427D, #008080)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative">عرض التفاصيل</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
