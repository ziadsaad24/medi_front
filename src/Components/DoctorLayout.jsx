import { useState } from "react";
import { useProfile } from "../context/ProfileContext";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function DoctorLayout({ children }) {
  const { profile } = useProfile(); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // للتحكم في Sidebar في الموبايل

  return (
    <div dir="rtl" className="min-h-screen flex theme-page relative">

      {/* Sidebar Desktop + Mobile Overlay */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* المحتوى الرئيسي */}
      <div className="flex-1 flex flex-col">

        {/* Navbar ثابت فوق */}
        <div className="sticky top-0 z-20">
          <Navbar
            profileImage={profile?.profileImage}
            fullName={profile?.fullName}
            specialization={profile?.specialization}
          />
        </div>

        {/* محتوى الصفحة قابل للتمرير فقط */}
        <main className="flex-1 overflow-auto p-6 md:pb-6 pb-20">
          {children}
        </main>

      </div>

    </div>
  );
}