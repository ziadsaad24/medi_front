import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck,
  User,
  LogOut,
  ClipboardList,
  FilePlus2
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { useDoctorWorkflow } from "../context/DoctorWorkflowContext";
import doctorApi from "../services/doctorApi";
import Swal from 'sweetalert2';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { logout } = useAuth();
  const { profile } = useProfile();
  const { requests, fetchRequests } = useDoctorWorkflow();
  const [completionCache, setCompletionCache] = useState({
    loaded: false,
    isComplete: false,
    completionPercent: 0,
    missingFields: [],
  });

  const menuItems = [
    { name: "لوحة التحكم", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { name: "سجلات المرضى", icon: Calendar, path: "/doctor/patients" },
    { name: "المواعيد", icon: CalendarCheck, path: "/doctor/settings" },
    { name: "الطلبات", icon: ClipboardList, path: "/doctor/requests" },
    { name: "سجل طبي جديد", icon: FilePlus2, path: "/doctor/medical-records/new" },
    { name: "الملف الشخصي", icon: User, path: "/doctor/profile" },
    { name: "تسجيل الخروج", icon: LogOut, action: "logout" },
  ];

  const pendingRequestsCount = useMemo(
    () => requests.filter((req) => String(req?.status || '').toLowerCase() === 'pending').length,
    [requests]
  );

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    let active = true;

    const preloadCompletion = async () => {
      try {
        const response = await doctorApi.getDoctorCompletionStatus();
        const data = response?.data || response || {};

        if (!active) return;

        setCompletionCache({
          loaded: true,
          isComplete: Boolean(data.isProfileComplete ?? data.is_profile_complete),
          completionPercent: Number(data.completionPercent ?? data.completion_percent ?? 0),
          missingFields: data.missingFields || data.missing_fields || [],
        });
      } catch {
        if (!active) return;
        setCompletionCache((prev) => ({ ...prev, loaded: true }));
      }
    };

    preloadCompletion();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadRequests = async () => {
      try {
        await fetchRequests({ page: 1, per_page: 50 });
      } catch {
        // Ignore transient sidebar refresh failures.
      }
    };

    loadRequests();

    const interval = window.setInterval(() => {
      if (!active) return;
      loadRequests();
    }, 15000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [fetchRequests]);

  const showIncompleteModal = async (completionPercent, missingFields) => {
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
        const confirmButton = modal.querySelector('.swal2-confirm');
        if (confirmButton) {
          confirmButton.style.borderRadius = '15px';
          confirmButton.style.padding = '12px 30px';
          confirmButton.style.fontWeight = 'bold';
          confirmButton.style.boxShadow = '0 4px 12px rgba(15, 67, 125, 0.3)';
        }
      }
    });

    navigate('/doctor/profile', {
      state: {
        forceComplete: true,
        completionError: {
          missingFields,
          completionPercent,
        },
      },
    });
  };

  const handleProtectedNavigation = async (path) => {
    if (path === '/doctor/medical-records/new') {
      await Swal.fire({
        title: 'ابدأ الكشف أولاً',
        text: 'فتح السجل الطبي الجديد يتم فقط من زر "ابدأ الكشف" بعد قبول الحجز.',
        icon: 'info',
        confirmButtonText: 'الذهاب إلى لوحة التحكم',
        confirmButtonColor: '#0f427d',
        background: isDark ? '#1e293b' : '#ffffff',
      });

      navigate('/doctor/dashboard');
      return;
    }

    if (path === '/doctor/profile') {
      navigate(path);
      return;
    }

    if (completionCache.loaded && completionCache.isComplete) {
      navigate(path);
      return;
    }

    if (completionCache.loaded && !completionCache.isComplete) {
      try {
        const response = await doctorApi.getDoctorCompletionStatus();
        const data = response?.data || response || {};
        const isComplete = Boolean(data.isProfileComplete ?? data.is_profile_complete);
        const completionPercent = Number(data.completionPercent ?? data.completion_percent ?? 0);
        const missingFields = data.missingFields || data.missing_fields || [];

        setCompletionCache({
          loaded: true,
          isComplete,
          completionPercent,
          missingFields,
        });

        if (isComplete) {
          navigate(path);
          return;
        }

        await showIncompleteModal(completionPercent, missingFields);
        return;
      } catch {
        await showIncompleteModal(completionCache.completionPercent, completionCache.missingFields);
        return;
      }
    }

    // Fast path: navigate immediately, then validate in background.
    navigate(path);

    try {
      const response = await doctorApi.getDoctorCompletionStatus();
      const data = response?.data || response || {};
      const isComplete = Boolean(data.isProfileComplete ?? data.is_profile_complete);
      const completionPercent = Number(data.completionPercent ?? data.completion_percent ?? 0);
      const missingFields = data.missingFields || data.missing_fields || [];

      setCompletionCache({
        loaded: true,
        isComplete,
        completionPercent,
        missingFields,
      });

      if (!isComplete) {
        await showIncompleteModal(completionPercent, missingFields);
      }
    } catch (error) {
      // On error, try again or show error
      const payload = error?.response?.data;
      if (payload?.code === 'PROFILE_INCOMPLETE') {
        const missingFields = payload?.errors?.missing_fields || [];
        const completionPercent = Number(payload?.errors?.completion_percent ?? 0);
        setCompletionCache({
          loaded: true,
          isComplete: false,
          completionPercent,
          missingFields,
        });

        await showIncompleteModal(completionPercent, missingFields);
      }
    }
  };

  return (
    <>
      {/* Sidebar Desktop Only */}
      <aside
        className={`hidden md:block w-64 p-6
          backdrop-blur-3xl border-l shadow-2xl 
          fixed top-0 right-0 h-screen overflow-hidden
          ${isDark
            ? "bg-gradient-to-b from-slate-950/95 via-slate-900/90 to-cyan-950/70 border-white/10"
            : "theme-surface border-[#0f427d]/20"
          }`}
        dir="rtl"
      >
        {/* Ambient Lights */}
        <div className="absolute top-[-10%] right-[-20%] w-64 h-64 bg-[#144A89]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-20%] w-64 h-64 bg-[#008080]/10 rounded-full blur-[120px]" />

        {/* Logo */}
        <div className="mb-12 relative z-10">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg border border-white/10">
              <svg width="28" height="28" viewBox="0 0 75 75" fill="none">
                <path
                  d="M57.5 27.5H52.54C51.66 27.49 50.81 27.78 50.11 28.3C49.42 28.83 48.91 29.57 48.68 30.42L43.98 47.14C43.94 47.24 43.88 47.33 43.8 47.4C43.71 47.46 43.6 47.5 43.5 47.5C43.39 47.5 43.28 47.46 43.2 47.4C43.11 47.33 43.05 47.24 43.02 47.14L31.98 7.86C31.94 7.75 31.88 7.66 31.8 7.6C31.71 7.53 31.6 7.5 31.5 7.5C31.39 7.5 31.28 7.53 31.2 7.6C31.11 7.66 31.05 7.75 31.02 7.86L26.32 24.58C26.08 25.41 25.58 26.15 24.88 26.68C24.19 27.21 23.35 27.49 22.48 27.5H17.5"
                  stroke="white"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className={`text-xl font-black ${isDark ? "text-white" : "theme-title"}`}>MediCare</h1>
              <p className="text-[9px] font-bold tracking-[1px] theme-accent uppercase">
                Health System
              </p>
            </div>
          </Link>
        </div>

        {/* Menu */}
        <nav className="space-y-2 relative z-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path ? location.pathname === item.path : false;
            const isRequestsItem = item.path === '/doctor/requests';

            if (item.action === 'logout') {
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={handleLogout}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                    isDark
                      ? 'text-white/60 hover:text-white hover:bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700'
                      : 'text-[#0f427d]/70 hover:text-[#0f427d] hover:bg-[#0f427d]/10'
                  }`}
                >
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="font-medium relative z-10 text-sm">{item.name}</span>
                </button>
              );
            }

            return (
              <button
                type="button"
                onClick={() => handleProtectedNavigation(item.path)}
                key={item.name}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 relative overflow-hidden group
                  ${isActive
                    ? "text-white shadow-lg"
                    : isDark
                      ? "text-white/60 hover:text-white hover:bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700"
                      : "text-[#0f427d]/70 hover:text-[#0f427d] hover:bg-[#0f427d]/10"
                  }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 opacity-50 backdrop-blur-lg" />
                )}
                <Icon className="w-5 h-5 relative z-10" />
                <div className="relative z-10 flex items-center w-full">
                  <span className="font-medium text-sm">{item.name}</span>
                  {isRequestsItem && pendingRequestsCount > 0 && (
                    <span className="mr-auto min-w-6 h-6 px-1.5 rounded-full bg-rose-500 text-white text-xs font-black flex items-center justify-center shadow-lg shadow-rose-900/35">
                      {pendingRequestsCount > 99 ? '99+' : pendingRequestsCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 📱 Bottom Navigation (Mobile Only) */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-xl ${
          isDark
            ? "bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border-white/10"
            : "theme-surface border-[#0f427d]/20"
        }`}
      >
        <div className="flex justify-around items-center py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path ? location.pathname === item.path : false;

            if (item.action === 'logout') {
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={handleLogout}
                  className="flex flex-col items-center justify-center"
                >
                  <Icon className={`w-6 h-6 ${isDark ? 'text-white/50' : 'text-[#0f427d]/50'}`} />
                </button>
              );
            }

            return (
              <button
                type="button"
                onClick={() => handleProtectedNavigation(item.path)}
                key={item.name}
                className="flex flex-col items-center justify-center"
              >
                <Icon className={`w-6 h-6 ${isActive ? "text-[#008080]" : isDark ? "text-white/50" : "text-[#0f427d]/50"}`} />
                {isActive && <div className="w-1 h-1 bg-[#008080] rounded-full mt-1" />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}