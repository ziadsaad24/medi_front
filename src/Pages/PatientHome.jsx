import React, { useState, useEffect } from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import HeroSlider from '../Components/HeroSlider';
import ServicesSection from '../Components/ServicesSection';
import DoctorsSection from '../Components/DoctorsSection';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MedicalRecordsBanner } from '../Components/MedicalRecordsBanner';
import ScrollToTop from '../Components/Layout/ScrollToTop';
import MedicationWidget from './MedicationWidget';

const PatientHome = ({ allDoctors }) => {
  const { user } = useAuth();
  
  const [patientData] = useState({
    name: user?.name || "أحمد محمد المنسي",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "مريض محقق"
  });

  useEffect(() => {
    Swal.fire({
      html: `
        <div class="glass-popup-content" style="direction: rtl; font-family: 'Segoe UI', sans-serif;">
          <div style="position: relative; width: 100px; height: 100px; margin: 0 auto 25px;">
            <div class="avatar-glow"></div>
            <img src="${patientData.avatar}" class="glass-avatar" />
          </div>

          <h2 style="color: white; font-weight: 900; font-size: 24px; margin-bottom: 10px;">
            أهلاً بك مجدداً، <span style="color: #60a5fa;">${patientData.name.split(' ')[0]}</span> 
          </h2>

          <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            صحتك هي أولويتنا. <br/> جاهز لمتابعة جدولك الصحي اليوم؟
          </p>
        </div>
      `,
      confirmButtonText: 'ابدأ بمتابعة صحتك الآن',
      buttonsStyling: false,
      background: 'transparent', // نجعل الخلفية شفافة لنطبق الزجاج بأنفسنا
      customClass: {
        popup: 'glass-swal-container',
        confirmButton: 'infinite-pulse-btn'
      },
      showClass: {
        popup: 'animate__animated animate__zoomIn'
      },
      hideClass: {
        popup: 'animate__animated animate__zoomOut'
      },
      backdrop: `rgba(15, 23, 42, 0.7)` // خلفية داكنة لزيادة تباين الزجاج
    });
  }, [patientData.name]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCFDFE] via-[#F1F5F9] to-[#E2E8F0]">
      <ToastContainer rtl={true} />
      <Navbar patientData={patientData} />
      
      {/* ستايل إضافي للـ CSS الخاص بالبوب أب */}
      <style>{`
        .glass-swal-container {
          background: rgba(255, 255, 255, 0.05) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 40px !important;
          padding: 40px !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }

        .glass-avatar {
          width: 100%;
          height: 100%;
          border-radius: 30px;
          border: 2px solid rgba(255, 255, 255, 0.2);
          object-fit: cover;
          position: relative;
          z-index: 2;
        }

        .avatar-glow {
          position: absolute;
          inset: -10px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
          z-index: 1;
          animation: pulse 2s infinite;
        }

        /* زر الأنيميشن الذي لا ينتهي */
        .infinite-pulse-btn {
          background: linear-gradient(135deg, #2563eb, #0891b2) !important;
          color: white !important;
          padding: 16px 40px !important;
          border-radius: 20px !important;
          font-weight: bold !important;
          font-size: 16px !important;
          border: none !important;
          cursor: pointer !important;
          transition: all 0.3s !important;
          box-shadow: 0 10px 20px rgba(37, 99, 235, 0.3) !important;
          position: relative;
          animation: infinitePulse 2s infinite !important;
        }

        @keyframes infinitePulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(37, 99, 235, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
          }
        }

        .infinite-pulse-btn:hover {
          transform: scale(1.1) !important;
          filter: brightness(1.1);
        }

        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 0.5; transform: scale(1); }
        }
      `}</style>

      <HeroSlider />
      <ServicesSection />
      <MedicalRecordsBanner/>
      <MedicationWidget/>
      <DoctorsSection doctors={allDoctors} /> 
      <ScrollToTop /> 
      <Footer />
    </div>
  );
};

export default PatientHome;