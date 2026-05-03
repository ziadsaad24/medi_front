import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { Clock, Star, CalendarCheck } from 'lucide-react'; 
import { motion } from 'framer-motion';
import ScrollToTop from '../Components/Layout/ScrollToTop';
import AppointmentBookingModal from './AppointmentBookingModal';
import { patientAPI } from '../services/api';

const normalizeDoctor = (doc = {}) => ({
  id: doc.id,
  name: doc.name || doc.full_name || 'دكتور',
  specialty: doc.specialty || doc.specialization || 'بدون تخصص',
  image: doc.image || doc.avatar_url || '',
  exp: String(doc.exp || doc.years_experience || doc.experience || '0'),
  clinic: doc.clinic || doc.clinic_name || 'عيادة غير محددة',
  clinicAddress: doc.clinicAddress || doc.clinic_address || 'العنوان غير متوفر',
  canBookNow: Boolean(doc.canBookNow ?? doc.can_book_now ?? true),
  unavailableReason: doc.unavailableReason || doc.unavailable_reason || '',
});

const DoctorsGridPage = ({ allDoctors }) => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingToast, setBookingToast] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      setLoading(true);
      try {
        const response = await patientAPI.getDoctors({ page: 1, per_page: 50 });
        const list = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : Array.isArray(response)
              ? response
              : [];

        if (!active) return;
        setDoctors(list.map(normalizeDoctor));
      } catch {
        if (!active) return;
        setDoctors([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setIsBookingOpen(true);
  };

  const handleBooked = (payload) => {
    const typeLabel = payload.appointment_type === 'new' ? 'كشف' : 'مراجعة';
    const sourceLabel = 'تم إرسال الطلب بنجاح';
    setBookingToast(`${sourceLabel}: ${typeLabel} مع ${payload.doctorName} - ${payload.requested_date} ${payload.requested_time}`);

    setTimeout(() => {
      setBookingToast('');
    }, 4500);
  };

  // أنيميشن ظهور الحاوية (Stagger effect)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  // أنيميشن ظهور كارت الطبيب
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  return (
    <div className="min-h-screen theme-page relative overflow-hidden">
      <Navbar />
      
      {/* عناصر خلفية ديكورية لتعزيز تأثير الزجاج */}
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />

      <div className="container mx-auto max-w-[1300px] px-6 pt-32 pb-20 relative z-10" dir="rtl">

        {bookingToast && (
          <div className="mb-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 text-emerald-100 px-4 py-3 text-sm font-semibold shadow-lg">
            {bookingToast}
          </div>
        )}
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black theme-title"
          >
            نخبة <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">أطبائنا</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="theme-text-muted text-lg max-w-xl mx-auto"
          >
            اختر من بين أفضل المتخصصين المعتمدين لرعاية صحتك وصحة عائلتك
          </motion.p>
        </div>

        {/* Doctors Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {doctors.map((doc) => (
            <motion.div 
              key={doc.id} 
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className="relative group"
            >
              {/* التوهج الخلفي للكارت عند الـ Hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-[2.5rem] blur opacity-0 group-hover:opacity-20 transition duration-500"></div>
              
              <div className="relative h-full theme-surface backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col items-center text-center shadow-2xl overflow-hidden">
                
                {/* صورة الطبيب داخل إطار زجاجي */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-0 group-hover:scale-125 transition-transform duration-500" />
        <img 
  src={doc.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'} 
  loading="lazy"
  className="w-28 h-28 rounded-3xl mx-auto object-cover border-2 border-white/10 relative z-10 group-hover:border-blue-400/50 transition-colors duration-300 shadow-xl" 
  alt={doc.name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
  }}
/>
                  {/* شارة التقييم */}
                  <div className="absolute -bottom-2 -right-2 px-2 py-1 rounded-lg flex items-center gap-1 z-20 shadow-lg theme-surface">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="theme-title text-[10px] font-bold">4.9</span>
                  </div>
                </div>

                <div className="flex-grow">
                  <h4 className="font-black theme-title text-xl mb-1 group-hover:text-blue-400 transition-colors">{doc.name}</h4>
                  <p className="text-emerald-400 font-bold text-sm mb-4 tracking-wide">{doc.specialty}</p>
                  <p className="theme-text-muted text-xs mb-3">{doc.clinic}</p>
                  <p className="theme-text-muted text-[11px] mb-4">{doc.clinicAddress}</p>
                  
                  {/* تفاصيل الخبرة بشكل زجاجي مصغر */}
                  <div className="flex items-center justify-center gap-3 theme-surface px-4 py-2 rounded-2xl theme-text-muted text-xs mb-6 transition-colors">
                    <Clock size={16} className="text-blue-400" />
                    <span>خبرة {doc.exp} سنة</span>
                  </div>
                </div>
                
                {/* زر الحجز بالانيميشن المستمر */}
                <button
                  onClick={() => openBooking(doc)}
                  disabled={!doc.canBookNow}
                  className="w-full relative overflow-hidden text-white py-4 rounded-2xl font-bold transition-all hover:brightness-110 active:scale-95 group/btn disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--app-primary)',
                    boxShadow: '0 12px 24px color-mix(in srgb, var(--app-primary) 30%, transparent)'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <CalendarCheck size={18} />
                    {doc.canBookNow ? 'حجز موعد الآن' : 'غير متاح الآن'}
                  </span>
                  {doc.canBookNow && (
                    <motion.div 
                      animate={{ x: ['100%', '-100%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    />
                  )}
                </button>
                {!doc.canBookNow && doc.unavailableReason && (
                  <p className="mt-2 text-[11px] text-amber-400">{doc.unavailableReason}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {!loading && doctors.length === 0 && (
          <div className="text-center mt-10 theme-text-muted">لا يوجد أطباء متاحون حالياً.</div>
        )}

        {loading && (
          <div className="text-center mt-10 theme-text-muted">جارٍ تحميل الأطباء من قاعدة البيانات...</div>
        )}
      </div>

      <ScrollToTop />
      <Footer />

      <AppointmentBookingModal
        isOpen={isBookingOpen}
        doctor={selectedDoctor}
        onClose={() => setIsBookingOpen(false)}
        onBooked={handleBooked}
      />
    </div>
  );
};

export default DoctorsGridPage;