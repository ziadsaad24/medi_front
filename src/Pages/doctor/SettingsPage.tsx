import { useEffect } from "react";
import DoctorLayout from '../../Components/DoctorLayout';
import { AppointmentsHeader } from '../../Components/AppointmentsHeader';
import { WorkingHours } from '../../Components/WorkingHours';
import DocAppointmentCard from "../../Components/DocAppointmentCard";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const dummyAppointments = [
  { id: 1, patientName: "أحمد علي", time: "10:00 صباحاً", type: "جديد" },
  { id: 2, patientName: "سارة أحمد", time: "09:00 صباحاً", type: "جديد" },
  { id: 3, patientName: "محمد علي", time: "10:30 صباحاً", type: "مراجعة" },
  { id: 4, patientName: "فاطمة حسن", time: "02:00 مساءً", type: "جديد" }, 
  { id: 5, patientName: "يوسف إبراهيم", time: "03:30 مساءً", type: "مراجعة" },
  { id: 6, patientName: "ليلى محمود", time: "04:15 مساءً", type: "جديد" },
  { id: 7, patientName: "خالد سعيد", time: "05:00 مساءً", type: "مراجعة" }, 
  { id: 8, patientName: "منى عبد الرحمن", time: "06:30 مساءً", type: "جديد" },
  { id: 9, patientName: "عمر فاروق", time: "07:45 مساءً", type: "مراجعة" }
];

export default function SettingsPage() {
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    if (location.hash === "#appointments") {
      const element = document.getElementById("appointments");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 min-h-full theme-page">
        
        {/* Header Sections */}
        <AppointmentsHeader />
        <WorkingHours />

        {/* Section Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold pr-2 sm:pr-4 border-r-4 border-[#144A89] ${isDark ? "text-white/80" : "text-[#0f427d]/80"}`}>
            المواعيد
          </h2>
        </div>

        {/* Appointments Grid */}
        <div id="appointments" className="space-y-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {dummyAppointments.map((appointment) => (
            <DocAppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      </div>
    </DoctorLayout>
  );
}