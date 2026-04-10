import { useState } from "react";
import { Calendar, Clock, Video, Phone, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

interface AppointmentCardProps {
  id: string;
  doctorName: string;
  specialty: string;
  doctorPhone?: string;
  clinicName?: string;
  clinicAddress?: string;
  date: string;
  time: string;
  type: string;
  rawStatus?: string;
  status: string;
  reason?: string;
  consultationFee?: string;
  doctorNote?: string;
  rejectReason?: string;
  avatarUrl: string;
  index: number;
}

export function AppointmentCard({
  id,
  doctorName,
  specialty,
  doctorPhone,
  clinicName,
  clinicAddress,
  date,
  time,
  type,
  rawStatus,
  status,
  reason,
  consultationFee,
  doctorNote,
  rejectReason,
  avatarUrl,
  index,
}: AppointmentCardProps) {
  const { isDark } = useTheme();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const statusBadgeClass =
    status === "مؤكد"
      ? (isDark
          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
          : "bg-emerald-100 text-emerald-700 border border-emerald-200")
      : status === 'مرفوض'
        ? (isDark
            ? 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
            : 'bg-rose-100 text-rose-700 border border-rose-200')
      : (isDark
          ? "bg-amber-500/20 text-amber-300 border border-amber-400/30"
          : "bg-amber-100 text-amber-700 border border-amber-200");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Glassmorphism Card */}
      <motion.div
        whileHover={{ scale: 1.03, y: -5 }}
        className={`relative h-full overflow-hidden rounded-[20px] p-6 shadow-[0_8px_32px_0_rgba(15,66,125,0.1)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_12px_48px_0_rgba(15,66,125,0.2)] ${isDark ? 'bg-slate-900/75 border border-slate-700/60' : 'bg-white/70 border border-white/70'}`}
      >
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
          {/* Header: status left + doctor block right */}
          <div className="mb-5 flex items-start justify-between" dir="rtl">
            <div className="relative flex items-start gap-3 text-right">
              <div className="relative shrink-0">
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-lg">
                  <img
                    src={avatarUrl}
                    alt={doctorName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-white bg-green-400"></div>
              </div>

              <div>
                <h3 className={`mb-1 ${isDark ? 'text-slate-100' : 'text-[#0F427D]'}`}>{doctorName}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>{specialty}</p>
                {clinicName && (
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{clinicName}</p>
                )}
                {clinicAddress && (
                  <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{clinicAddress}</p>
                )}
              </div>
            </div>

            <div
              className={`rounded-full px-4 py-1.5 text-sm ${statusBadgeClass} backdrop-blur-sm`}
            >
              {status}
            </div>
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
            <motion.a
              href={doctorPhone ? `tel:${doctorPhone}` : undefined}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-11 w-11 items-center justify-center rounded-xl backdrop-blur-sm transition-all hover:border-[#0F427D] hover:bg-[#0F427D]/10 hover:shadow-[0_0_15px_rgba(15,66,125,0.3)] ${isDark ? 'border border-blue-400/30 bg-slate-800/80' : 'border border-[#0F427D]/30 bg-white/60'} ${!doctorPhone ? 'pointer-events-none opacity-40' : ''}`}
            >
              <Phone className="h-5 w-5 text-[#0F427D]" />
            </motion.a>

            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsDetailsOpen(true)}
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
              <span className="relative flex items-center justify-center gap-1">عرض التفاصيل</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isDetailsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsDetailsOpen(false)}
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              className={`w-full max-w-lg rounded-2xl border shadow-2xl p-5 ${isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-[#0F427D]/15 text-[#0F427D]'}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-black">تفاصيل الكشف</h4>
                <button
                  onClick={() => setIsDetailsOpen(false)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-[#0F427D]/10 hover:bg-[#0F427D]/20'}`}
                >
                  <X size={18} />
                </button>
              </div>

              <div className={`rounded-xl border p-4 space-y-2 text-sm ${isDark ? 'border-slate-700 bg-slate-800/60' : 'border-[#0F427D]/15 bg-[#0F427D]/[0.03]'}`}>
                <p><span className="font-bold">الطبيب:</span> {doctorName}</p>
                <p><span className="font-bold">التخصص:</span> {specialty}</p>
                {clinicName && <p><span className="font-bold">العيادة:</span> {clinicName}</p>}
                {clinicAddress && <p><span className="font-bold">العنوان:</span> {clinicAddress}</p>}
                <p><span className="font-bold">نوع الكشف:</span> {type}</p>
                <p><span className="font-bold">الموعد:</span> {date} - {time}</p>
                {reason && <p><span className="font-bold">سبب الزيارة:</span> {reason}</p>}
                {consultationFee && <p><span className="font-bold">سعر الكشف:</span> {consultationFee} جنيه</p>}
                {doctorNote && <p><span className="font-bold">ملاحظة الطبيب:</span> {doctorNote}</p>}
                {rejectReason && <p className="text-rose-400"><span className="font-bold">سبب الرفض:</span> {rejectReason}</p>}
                <p><span className="font-bold">رقم الحجز:</span> #{id}</p>
                <p><span className="font-bold">الحالة:</span> {status} ({rawStatus || '-'})</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
