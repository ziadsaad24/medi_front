import React, { useEffect, useState } from 'react';
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
import { patientAPI } from '../services/api';
import '../Styles/PatientHome.css';

const API_BASE = String(import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
const PATIENT_HOME_DOCTORS_CACHE_KEY = 'patient-home-doctors-cache';
const PATIENT_HOME_DOCTORS_CACHE_TTL = 2 * 60 * 1000;

const resolveDoctorImage = (rawImage) => {
  if (!rawImage) return '';

  const value = String(rawImage).trim();
  if (!value) return '';

  if (value.startsWith('http://') || value.startsWith('https://')) return value;

  return `${API_BASE}${value.startsWith('/') ? value : `/${value}`}`;
};

const normalizeDoctor = (doc = {}) => ({
  id: doc.id,
  name: doc.name || doc.full_name || 'دكتور',
  specialty: doc.specialty || doc.specialization || 'بدون تخصص',
  image: resolveDoctorImage(doc.image || doc.avatar_url || doc.avatar || doc.profile_image),
  exp: String(doc.exp || doc.years_experience || doc.experience || '0'),
  clinic: doc.clinic || doc.clinic_name || 'عيادة غير محددة',
  canBookNow: Boolean(doc.canBookNow ?? doc.can_book_now ?? true),
  unavailableReason: doc.unavailableReason || doc.unavailable_reason || '',
});

const PatientHome = ({ allDoctors }) => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);

  const patientData = {
    name: user?.name || "زائر",
    role: "مريض محقق"
  };

  const firstName = (patientData.name || "زائر").trim().split(/\s+/)[0] || "زائر";

  useEffect(() => {
    if (!user?.id) return;

    // نتحقق إذا المستخدم الحالي شاف رسالة الترحيب في الـ session الحالي
    const welcomeKey = `hasSeenWelcome-${user.id}`;
    const hasSeenWelcome = sessionStorage.getItem(welcomeKey);
    
    // نعرض الرسالة بس لو مشفهاش قبل كده
    if (!hasSeenWelcome) {
      Swal.fire({
        html: `
          <div class="glass-popup-content" style="direction: rtl; font-family: 'Segoe UI', sans-serif;">
            <h2 style="color: white; font-weight: 900; font-size: 24px; margin-bottom: 10px;">
              أهلاً بك مجدداً، <span style="color: #60a5fa;">${firstName}</span>
            </h2>

            <p style="color: #cbd5e1; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              صحتك هي أولويتنا. <br/> جاهز لمتابعة جدولك الصحي اليوم؟
            </p>
          </div>
        `,
        confirmButtonText: 'ابدأ بمتابعة صحتك الآن',
        buttonsStyling: false,
        background: 'transparent',
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
        backdrop: `rgba(15, 23, 42, 0.7)`
      });
      
      // نحفظ إن المستخدم شاف الرسالة
      sessionStorage.setItem(welcomeKey, 'true');
    }
  }, [firstName, user?.id]);

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      let hasFreshCache = false;

      try {
        const cachedRaw = sessionStorage.getItem(PATIENT_HOME_DOCTORS_CACHE_KEY);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          const isFresh = Date.now() - Number(cached?.timestamp || 0) < PATIENT_HOME_DOCTORS_CACHE_TTL;

          if (isFresh && Array.isArray(cached?.data) && cached.data.length > 0) {
            hasFreshCache = true;
            setDoctors(cached.data);
          }
        }
      } catch {
        // Ignore cache parsing errors and continue with API.
      }

      setDoctorsLoading(!hasFreshCache);

      try {
        const response = await patientAPI.getDoctors({ page: 1, per_page: 12 });
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response)
              ? response
              : [];

        if (!active) return;
        const normalized = list.map(normalizeDoctor);
        setDoctors(normalized);

        try {
          sessionStorage.setItem(
            PATIENT_HOME_DOCTORS_CACHE_KEY,
            JSON.stringify({ timestamp: Date.now(), data: normalized })
          );
        } catch {
          // Ignore cache write issues.
        }
      } catch {
        if (!active) return;
        if (!hasFreshCache) setDoctors([]);
      } finally {
        if (active) setDoctorsLoading(false);
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen theme-page"> {/* تغيير لون الخلفية ليتماشى مع الثيم الداكن الزجاجي */}
      <ToastContainer rtl={true} />
      <Navbar patientData={patientData} />
      
      {/* ستايل إضافي للـ CSS الخاص بالبوب أب */}
      <style>{`/* Styles moved to /src/Styles/PatientHome.css */`}</style>

      <HeroSlider />
      <ServicesSection />
      <MedicalRecordsBanner/>
      <MedicationWidget/>
      <DoctorsSection doctors={doctors} loading={doctorsLoading} /> 
      <ScrollToTop /> 
      <Footer />
    </div>
  );
};

export default PatientHome;