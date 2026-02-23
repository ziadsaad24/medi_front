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

const PatientHome = ({ allDoctors }) => { // استقبال الداتا من App.js
  const { user } = useAuth();
  
  const [patientData] = useState({
    name: user?.name || "أحمد محمد المنسي",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    role: "مريض محقق"
  });

  useEffect(() => {
    Swal.fire({
      html: `
        <div style="direction: rtl; font-family: 'Segoe UI', sans-serif; text-align: center;">
          <div c style="margin-bottom: 20px;display: flex; align-items: center; justify-content: center;">
            ${patientData.avatar 
              ? `<img src="${patientData.avatar}" style="width: 85px;height: 85px; border-radius: 5px; border: 2px solid #004060a8; object-fit: cover;">`
              : `<div style="width: 85px; height: 85px; background: #f0fdfa; border-radius: 25px; display: flex; align-items: center; justify-content: center; margin: 0 auto;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#008080" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>`
            }
          </div>

          <h2 style="color: #004060; font-weight: 900; font-size: 22px; display: flex; align-items: center; justify-content: center; gap: 10px;">
             أهلاً بك مجدداً، ${patientData.name.split(' ')[0]} 
             <span class="heart-mini">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="#ff4d4d"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
             </span>
          </h2>

          <p style="color: #4b5563; font-size: 15px; margin-top: 10px; line-height: 1.6;">
            نهتم بصحتك دائماً. <br/> لقد قمنا بتنظيم يومك الصحي بعناية.
          </p>
        </div>
      `,
      confirmButtonText: 'ابدأ بمتابعة صحتك',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[40px] p-8 border-none shadow-2xl bg-white',
        confirmButton: 'custom-btn px-10 py-3.5 rounded-2xl font-bold text-sm'
      },
      backdrop: `rgba(0,64,96,0.4)`
    });
  }, [patientData.name]);

  return (
    <div className="min-h-screen bg-[#FCFDFE]">
      <ToastContainer rtl={true} />
 <Navbar patientData={patientData} />
      <HeroSlider />
      <ServicesSection />
      
      {/* نمرر allDoctors التي استلمناها من App.js إلى السيكشن */}
      <DoctorsSection doctors={allDoctors} /> 
      
      <Footer />
    </div>
  );
};

export default PatientHome;