import { useEffect } from "react";
import DoctorLayout from '../../Components/DoctorLayout';
import { AppointmentsHeader } from '../../Components/AppointmentsHeader';
import { WorkingHours } from '../../Components/WorkingHours';
import DocAppointmentCard from "../../Components/DocAppointmentCard";
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useDoctorWorkflow } from '../../context/DoctorWorkflowContext';

export default function SettingsPage() {
  const location = useLocation();
  const { isDark } = useTheme();
  const { actionableAppointments } = useDoctorWorkflow();

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

          <p className={`text-xs sm:text-sm mt-2 sm:mt-0 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>
            يتم إخفاء الكشوفات المكتملة تلقائيًا ونقلها إلى سجلات المرضى.
          </p>
        </div>

        {/* Appointments Grid */}
        <div id="appointments" className="space-y-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {actionableAppointments.map((appointment) => (
            <DocAppointmentCard key={appointment.id} appointment={appointment} />
          ))}

          {actionableAppointments.length === 0 && (
            <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-900/60 border-white/15 text-white/70' : 'bg-white border-[#0f427d]/15 text-[#0f427d]/70'}`}>
              لا توجد مواعيد نشطة حالياً.
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
}