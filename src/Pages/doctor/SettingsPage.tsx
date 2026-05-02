import { useEffect, useState } from "react";
import DoctorLayout from '../../Components/DoctorLayout';
import { AppointmentsHeader } from '../../Components/AppointmentsHeader';
import { WorkingHours } from '../../Components/WorkingHours';
import DocAppointmentCard from "../../Components/DocAppointmentCard";
import CancelReasonModal from '../../Components/CancelReasonModal';
import { useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useDoctorWorkflow } from '../../context/DoctorWorkflowContext';

export default function SettingsPage() {
  const location = useLocation();
  const { isDark } = useTheme();
  const { actionableAppointments, cancelTodayAppointments, cancelAppointment } = useDoctorWorkflow();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancellingToday, setIsCancellingToday] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancellingOne, setIsCancellingOne] = useState(false);

  const handleCancelToday = async (reason) => {
    setIsCancellingToday(true);
    try {
      await cancelTodayAppointments(reason);
      setIsCancelModalOpen(false);
    } catch (error: any) {
      window.alert(error?.response?.data?.message || 'تعذر إلغاء مواعيد اليوم حالياً.');
    } finally {
      setIsCancellingToday(false);
    }
  };

  const handleCancelRequest = (appointment) => {
    setCancelTarget(appointment);
  };

  const handleConfirmCancel = async (reason) => {
    if (!cancelTarget) return;
    setIsCancellingOne(true);
    try {
      await cancelAppointment(cancelTarget.id, reason);
      setCancelTarget(null);
    } catch (error: any) {
      window.alert(error?.response?.data?.message || 'تعذر إلغاء الموعد حالياً.');
    } finally {
      setIsCancellingOne(false);
    }
  };

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold pr-2 sm:pr-4 border-r-4 border-[#144A89] ${isDark ? "text-white/80" : "text-[#0f427d]/80"}`}>
            المواعيد
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <p className={`text-xs sm:text-sm ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>
              يتم إخفاء الكشوفات المكتملة تلقائيًا ونقلها إلى سجلات المرضى.
            </p>
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="px-3 py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:brightness-110 transition-all"
            >
              إلغاء مواعيد اليوم
            </button>
          </div>
        </div>

        {/* Appointments Grid */}
        <div id="appointments" className="space-y-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
          {actionableAppointments.map((appointment) => (
            <DocAppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCancelRequest={handleCancelRequest}
              isCancelling={isCancellingOne && cancelTarget?.id === appointment.id}
            />
          ))}

          {actionableAppointments.length === 0 && (
            <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-900/60 border-white/15 text-white/70' : 'bg-white border-[#0f427d]/15 text-[#0f427d]/70'}`}>
              لا توجد مواعيد نشطة حالياً.
            </div>
          )}
        </div>
      </div>

      <CancelReasonModal
        isOpen={isCancelModalOpen}
        title="تأكيد إلغاء مواعيد اليوم"
        description="سيتم إلغاء كل مواعيد اليوم للحالات النشطة وإرسال إشعار لكل مريض."
        confirmLabel={isCancellingToday ? 'جارٍ الإلغاء...' : 'تأكيد الإلغاء'}
        requireReason={false}
        onClose={() => !isCancellingToday && setIsCancelModalOpen(false)}
        onConfirm={handleCancelToday}
      />
      <CancelReasonModal
        isOpen={Boolean(cancelTarget)}
        title="تأكيد إلغاء الحجز"
        description="هل أنت متأكد من إلغاء هذا الحجز؟ سيتم إرسال إشعار للمريض بسبب الإلغاء."
        confirmLabel={isCancellingOne ? 'جارٍ الإلغاء...' : 'تأكيد الإلغاء'}
        requireReason
        onClose={() => !isCancellingOne && setCancelTarget(null)}
        onConfirm={handleConfirmCancel}
      />
    </DoctorLayout>
  );
}