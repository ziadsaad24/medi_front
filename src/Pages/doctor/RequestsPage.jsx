import { useEffect } from "react";
import DoctorLayout from "../../Components/DoctorLayout";
import { BookingRequests } from "../../Components/BookingRequests";
import { useDoctorWorkflow } from "../../context/DoctorWorkflowContext";
import { useTheme } from "../../context/ThemeContext";

export default function RequestsPage() {
  const { fetchRequests } = useDoctorWorkflow();
  const { isDark } = useTheme();

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        await fetchRequests({ page: 1, per_page: 50 });
      } catch {
        // UI handles errors via context state.
      }
    };

    load();

    const interval = window.setInterval(() => {
      if (!active) return;
      load();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [fetchRequests]);

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-full theme-page">
        <div className={isDark ? "mb-4 rounded-2xl border border-cyan-300/30 bg-cyan-500/10 px-4 py-3 text-cyan-100" : "mb-4 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3 shadow-sm"}>
          <p className={isDark ? "text-sm md:text-base font-bold" : "text-sm md:text-base font-bold theme-title"}>ملاحظة قبل تأكيد الحجز</p>
          <p className={isDark ? "text-xs md:text-sm mt-1 text-cyan-50/90 leading-6" : "text-xs md:text-sm mt-1 text-slate-700 leading-6"}>
            يفضل التواصل مع رقم المريض أولاً لتأكيد التفاصيل ووقت الزيارة قبل الضغط على زر تأكيد الطلب.
          </p>
        </div>
        <BookingRequests />
      </div>
    </DoctorLayout>
  );
}