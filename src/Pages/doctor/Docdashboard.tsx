import React, { useEffect, useState } from "react";
import DoctorLayout from "../../Components/DoctorLayout";
import StatCard from "../../Components/StatCard";
import AppointmentCard from "../../Components/DocAppointmentCard";
import CancelReasonModal from "../../Components/CancelReasonModal";
import { CalendarDays, CalendarCheck, UserCheck, ClipboardCheck } from "lucide-react";
import { useProfile } from "../../context/ProfileContext";
import { useTheme } from "../../context/ThemeContext";
import { Link, useNavigate } from "react-router-dom";
import { useDoctorWorkflow } from '../../context/DoctorWorkflowContext';
import doctorApi from '../../services/doctorApi';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const { profile } = useProfile(); // جلب اسم الدكتور من الـ context
  const { isDark } = useTheme();
  const workflow = useDoctorWorkflow() as any;
  const { actionableAppointments, dashboardStats, loading, error, cancelAppointment } = workflow;
  const [cancelTarget, setCancelTarget] = useState<{ id: string } | null>(null);
  const [isCancellingOne, setIsCancellingOne] = useState(false);

  const handleCancelRequest = (appointment: { id: string }) => {
    setCancelTarget({ id: appointment.id });
  };

  const handleConfirmCancel = async (reason: string) => {
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
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkCompletion = async () => {
      try {
        const response = await doctorApi.getDoctorCompletionStatus();
        const data = response?.data || response || {};
        const isComplete = Boolean(data.isProfileComplete ?? data.is_profile_complete);
        const completionPercent = Number(data.completionPercent ?? data.completion_percent ?? 0);
        const missingFields = data.missingFields || data.missing_fields || [];

        if (isMounted && !isComplete) {
          const firstName = profile?.fullName?.trim().split(/\s+/)[0] || 'الدكتور';

          await Swal.fire({
            html: `
              <div style="direction: rtl; text-align: center; font-family: 'Segoe UI', sans-serif;">
                <div style="font-size: 60px; margin-bottom: 25px;">ℹ️</div>
                
                <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 30px; color: ${isDark ? '#ffffff' : '#0f427d'};">
                  مرحباً بك في Medicare<br/><span style="font-size: 20px;">د. ${firstName}</span>
                </h2>

                <div style="background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15, 67, 125, 0.08)'}; border-radius: 20px; padding: 18px; margin-bottom: 20px; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 67, 125, 0.2)'};">
                  <p style="margin: 0; font-size: 14px; line-height: 1.8; color: ${isDark ? '#cbd5e1' : '#0f427d'};">
                    أهلاً بك معنا! نتمنى لك تجربة مميزة في إدارة عيادتك
                  </p>
                </div>

                <div style="background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15, 67, 125, 0.08)'}; border-radius: 20px; padding: 18px; margin-bottom: 30px; border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(15, 67, 125, 0.2)'};">
                  <p style="margin: 0; font-size: 14px; line-height: 1.8; color: ${isDark ? '#cbd5e1' : '#0f427d'};">
                    قبل استخدام لوحة التحكم بشكل كامل، يرجى استكمال جميع بيانات البروفايل<br/>
                    <strong>مهم:</strong> رفع صورة شخصية مناسبة وواضحة للحساب
                  </p>
                </div>

                <div style="font-size: 12px; color: ${isDark ? '#94a3b8' : '#0f427d'}; margin-bottom: 10px;">
                  نسبة الإكمال: <strong style="font-size: 18px; color: ${isDark ? '#60a5fa' : '#0f427d'};">${completionPercent}%</strong>
                </div>
              </div>
            `,
            confirmButtonText: 'الانتقال إلى البروفايل الآن',
            confirmButtonColor: '#0f427d',
            allowOutsideClick: false,
            background: isDark ? '#1e293b' : '#ffffff',
            didOpen: (modal) => {
              const confirmButton = modal.querySelector('.swal2-confirm') as HTMLButtonElement | null;
              if (confirmButton) {
                confirmButton.style.borderRadius = '15px';
                confirmButton.style.padding = '12px 30px';
                confirmButton.style.fontWeight = 'bold';
                confirmButton.style.boxShadow = '0 4px 12px rgba(15, 67, 125, 0.3)';
              }
            }
          });

          navigate('/doctor/profile', {
            replace: true,
            state: {
              forceComplete: true,
              completionError: {
                missingFields,
                completionPercent,
              },
            },
          });
        }
      } catch {
        // Ignore here; global endpoint guard handles PROFILE_INCOMPLETE and routing.
      }
    };

    checkCompletion();

    return () => {
      isMounted = false;
    };
  }, [navigate, isDark, profile?.fullName]);

  const stats = [
    { title: "مواعيد اليوم", value: String(dashboardStats.todayAppointmentsCount), icon: CalendarCheck, color: "from-blue-900 via-blue-800 to-cyan-700" },
    { title: "المواعيد القادمة", value: String(dashboardStats.upcomingAppointmentsCount), icon: CalendarDays, color: "from-blue-900 via-blue-800 to-cyan-700" },
    { title: "المرضى النشطين", value: String(dashboardStats.activePatientsCount), icon: UserCheck, color: "from-blue-900 via-blue-800 to-cyan-700"},
    { title: "إجمالي المواعيد", value: String(dashboardStats.totalAppointmentsCount), icon: ClipboardCheck, color: "from-blue-900 via-blue-800 to-cyan-700" }
  ];

  return (
    <DoctorLayout>
      <div className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 overflow-x-hidden theme-page">

    {loading && (
      <div className={`rounded-2xl border p-4 mb-4 text-center ${isDark ? 'bg-slate-900/60 border-white/15 text-white/80' : 'bg-white border-[#0f427d]/15 text-[#0f427d]/80'}`}>
        جارٍ تحميل بيانات لوحة التحكم...
      </div>
    )}

    {error && (
      <div className={`rounded-2xl border p-4 mb-4 text-center ${isDark ? 'bg-rose-900/30 border-rose-400/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
        {error}
      </div>
    )}

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
            إليك ملخص مواعيدك اليوم - {new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
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

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/doctor/settings#appointments">
            <button className="px-4 sm:px-6 py-2 rounded-xl 
              bg-gradient-to-b from-blue-900 via-blue-800 to-cyan-700 
              text-white hover:brightness-110 transition-all shadow-lg text-sm sm:text-base">
              عرض الكل
            </button>
          </Link>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {actionableAppointments.slice(0, 6).map((appointment: any) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onCancelRequest={handleCancelRequest}
            isCancelling={isCancellingOne && cancelTarget?.id === appointment.id}
          />
        ))}

        {actionableAppointments.length === 0 && (
          <div className={`rounded-2xl border p-6 text-center ${isDark ? 'bg-slate-900/60 border-white/15 text-white/70' : 'bg-white border-[#0f427d]/15 text-[#0f427d]/70'}`}>
            لا توجد مواعيد جارية حالياً. المواعيد المكتملة انتقلت إلى سجلات المرضى.
          </div>
        )}
      </div>
    </div>

  </div>

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