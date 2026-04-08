import React from "react";
import DoctorLayout from "../../Components/DoctorLayout";
import StatCard from "../../Components/StatCard";
import AppointmentCard from "../../Components/DocAppointmentCard";
import { CalendarDays, CalendarCheck, UserCheck, ClipboardCheck } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { Link } from "react-router-dom";


const appointments = [
  { id: 1, patientName: "سارة أحمد", time: "09:00 صباحاً", type: "جديد" },
  { id: 2, patientName: "محمد علي", time: "10:30 صباحاً", type: "مراجعة" },
  { id: 3, patientName: "فاطمة حسن", time: "02:00 مساءً", type: "جديد" },
  { id: 4, patientName: "يوسف إبراهيم", time: "03:30 مساءً", type: "مراجعة" },
  { id: 5, patientName: "ليلى محمود", time: "04:15 مساءً", type: "جديد" },
  { id: 6, patientName: "خالد سعيد", time: "05:00 مساءً", type: "مراجعة" },
  { id: 7, patientName: "منى عبد الرحمن", time: "06:30 مساءً", type: "جديد" },
  { id: 8, patientName: "عمر فاروق", time: "07:45 مساءً", type: "مراجعة" }
];

export default function Dashboard() {
  const { profile } = useProfile(); // جلب اسم الدكتور من الـ context

  const stats = [
    { title: "مواعيد اليوم", value: "6", icon: CalendarCheck, color: "from-blue-900 via-blue-800 to-cyan-700" },
    { title: "المواعيد القادمة", value: "18", icon: CalendarDays, color: "from-blue-900 via-blue-800 to-cyan-700" },
    { title: "المرضى النشطين", value: "42", icon: UserCheck, color: "from-blue-900 via-blue-800 to-cyan-700"},
    { title: "إجمالي المواعيد", value: "156", icon: ClipboardCheck, color: "from-blue-900 via-blue-800 to-cyan-700" }
  ];

  return (
    <DoctorLayout>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden theme-page">

    {/* Header */}
    <div className="mb-6 md:mb-10 mt-5 overflow-hidden rounded-3xl 
      backdrop-blur-2xl theme-card shadow-2xl 
      p-4 sm:p-8 md:p-8">

      <div className="absolute top-0 right-0 w-80 h-80 bg-[#008080]/20 rounded-full blur-[120px]" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-3 theme-title">
            مرحباً بعودتك، {profile?.fullName}
          </h2>
          <p className="theme-title text-sm sm:text-base md:text-lg">
            إليك ملخص مواعيدك اليوم - الثلاثاء، 10 مارس 2026
          </p>
        </div>

        <div className="hidden md:flex w-16 h-16 md:w-20 md:h-20 rounded-3xl 
          bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 
          items-center justify-center border border-white/20 shadow-lg">
          <CalendarDays className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>

      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
      {stats.map((stat, i) => (
        <StatCard key={i} {...stat} />
      ))}
    </div>

    {/* Appointments */}
    <div className="space-y-4 
      theme-card backdrop-blur-md p-4 sm:p-6 border rounded-3xl shadow-xl">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
        
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold theme-title pr-3 border-r-4 border-[#144A89]">
          مواعيد اليوم
        </h2>

        <Link to="/doctor/settings#appointments">
          <button className="px-4 sm:px-6 py-2 rounded-xl 
            bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-700 
            text-white hover:brightness-110 transition-all shadow-lg text-sm sm:text-base">
            عرض الكل
          </button>
        </Link>

      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {appointments.map((appointment) => (
          <AppointmentCard key={appointment.id} appointment={appointment} />
        ))}
      </div>
    </div>

  </div>
</DoctorLayout>
  );
}