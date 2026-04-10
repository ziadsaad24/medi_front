import { useEffect, useState } from "react";
import { useProfile } from "../context/ProfileContext";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { useLocation, useNavigate } from "react-router-dom";

export default function DoctorLayout({ children }) {
  const { profile } = useProfile(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // للتحكم في Sidebar في الموبايل
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onProfileIncomplete = (event) => {
      const details = event?.detail || {};

      if (location.pathname === '/doctor/profile') return;

      navigate('/doctor/profile', {
        replace: true,
        state: {
          forceComplete: true,
          completionError: {
            missingFields: details?.errors?.missing_fields || [],
            completionPercent: details?.errors?.completion_percent ?? 0,
            message: details?.message || 'يرجى استكمال بيانات الملف الشخصي أولاً.',
          },
        },
      });
    };

    window.addEventListener('doctor:profile-incomplete', onProfileIncomplete);
    return () => window.removeEventListener('doctor:profile-incomplete', onProfileIncomplete);
  }, [location.pathname, navigate]);

  useEffect(() => {
    const onUnauthenticated = () => {
      navigate('/auth', { replace: true, state: { role: 'doctor', initialMode: 'login' } });
    };

    window.addEventListener('auth:unauthenticated', onUnauthenticated);
    return () => window.removeEventListener('auth:unauthenticated', onUnauthenticated);
  }, [navigate]);

  return (
    <div dir="rtl" className="min-h-screen theme-page relative">

      {/* Sidebar Desktop + Mobile Overlay */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex flex-col min-h-screen md:mr-64">

        {/* Navbar ثابت مع السكرول */}
        <div className="fixed top-0 left-0 right-0 md:right-64 z-30">
          <Navbar
            profileImage={profile?.profileImage}
            fullName={profile?.fullName}
            specialization={profile?.specialization}
          />
        </div>

        {/* محتوى الصفحة يشارك نفس سكرول الصفحة */}
        <main className="flex-1 p-6 pt-28 md:pb-6 pb-20">
          {children}
        </main>

      </div>

    </div>
  );
}