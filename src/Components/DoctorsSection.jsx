import React, { useEffect, useMemo, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Autoplay } from 'swiper/modules';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import { useTheme } from '../context/ThemeContext';

const DoctorsSection = ({ doctors = [], loading = false }) => {
  const { isDark } = useTheme();
  const swiperRef = useRef(null);
  const displayDoctors = doctors?.slice(0, 6) || [];
  const sliderDoctors = useMemo(() => {
    if (!displayDoctors.length) return [];

    // Swiper loop gets unstable with very small datasets.
    // Repeat items so vertical autoplay remains truly infinite.
    const minSlidesForLoop = 8;
    const total = Math.max(displayDoctors.length, minSlidesForLoop);

    return Array.from({ length: total }, (_, index) => {
      const base = displayDoctors[index % displayDoctors.length];
      return {
        ...base,
        __slideKey: `${base.id}-${index}`,
      };
    });
  }, [displayDoctors]);

  useEffect(() => {
    if (!swiperRef.current || sliderDoctors.length === 0) return;

    const swiper = swiperRef.current;
    const frame = window.requestAnimationFrame(() => {
      if (swiper.destroyed) return;
      if (swiper.autoplay) {
        swiper.autoplay.stop();
        swiper.autoplay.start();
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [sliderDoctors.length]);

  if (!loading && displayDoctors.length === 0) return null;

  return (
    <section className={`py-20 relative overflow-hidden ${isDark ? 'bg-gradient-to-b from-[#06142f] to-[#020617]' : 'bg-gradient-to-b from-white to-[#f0fafa]'}`} dir="rtl">
      {isDark && (
        <>
          <div className="absolute top-10 right-[-8%] w-[340px] h-[340px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
          <div className="absolute bottom-0 left-[-10%] w-[300px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />
        </>
      )}
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* الجانب الأيمن: السلايدر */}
          {/* زيادة h-[500px] تعطي مساحة أكبر للكروت لتطول */}
          <div className="md:w-[45%] h-[500px] w-full relative flex items-center justify-center">
            <div className="w-full h-full overflow-hidden py-4"> 
              {sliderDoctors.length > 0 ? (
                <Swiper
                key={`doctors-slider-${sliderDoctors.length}`}
                direction={'vertical'}
                // تقليل الرقم هنا (مثلاً 2.2 بدل 3) يجعل الكارت الواحد يأخذ مساحة طولية أكبر
                slidesPerView={2.2} 
                spaceBetween={25}
                centeredSlides={true}
                loop={true}
                mousewheel={{ forceToAxis: true }}
                autoplay={{ 
                    delay: 2500, 
                    disableOnInteraction: false 
                }}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                modules={[Mousewheel, Autoplay]}
                className="h-full w-full"
                >
                {sliderDoctors.map((doc) => (
                  <SwiperSlide key={doc.__slideKey} className="flex items-center justify-center">
                    {({ isActive }) => (
                        <div className={`
                        relative flex flex-row items-center gap-6 p-6 rounded-[2rem] border transition-all duration-500 w-[90%] mx-auto
                        ${isActive 
                          ? `${isDark ? 'bg-slate-900/90 border-cyan-400/30 shadow-[0_18px_45px_rgba(34,211,238,0.16)]' : 'bg-white border-teal-50 shadow-[0_15px_35px_rgba(0,128,128,0.15)]'} scale-105 z-50 h-[160px]`
                          : `${isDark ? 'bg-slate-900/55 border-slate-700/40 opacity-60' : 'bg-white border-transparent opacity-55'} scale-90 blur-[0.5px] h-[140px]`}
                        `}>
                        {/* الشرطة الجانبية جهة اليمين */}
                        <div className={`absolute right-0 top-1/4 w-1.5 h-1/2 rounded-r-full bg-[#008080] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <div className="text-right flex-1 pr-4">
                          <h4 className={`font-black text-lg md:text-xl mb-1 ${isDark ? 'text-slate-100' : 'text-[#004060]'}`}>{doc.name}</h4>
                          <p className={`font-bold text-xs md:text-sm ${isDark ? 'text-cyan-300' : 'text-[#008080]'}`}>{doc.specialty}</p>
                            {/* إضافة وصف بسيط أو عيادة لجعل الكارت يمتلئ طولياً */}
                          <p className={`text-[10px] mt-2 font-medium italic ${isDark ? 'text-slate-400' : 'text-gray-400'}`}>{doc.clinic || "المركز الطبي التخصصي"}</p>
                        </div>

                        <div className={`w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden border-2 shadow-sm transition-transform duration-500 group ${isDark ? 'border-slate-700' : 'border-slate-50'}`}>
                            <img 
                          src={doc.image || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80'} 
                            alt={doc.name} 
                            loading="lazy"
                            className="w-full h-full object-cover object-top"
                            onError={(event) => {
                              event.currentTarget.onerror = null;
                              event.currentTarget.src = 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
                            }}
                            />
                        </div>
                        </div>
                    )}
                    </SwiperSlide>
                ))}
                </Swiper>
              ) : (
                <div className={`absolute inset-0 flex items-center justify-center text-sm ${isDark ? 'text-slate-300' : 'text-[#0f427d]/70'}`}>
                  جارٍ تحميل الأطباء...
                </div>
              )}

                {loading && (
                  <div className={`absolute inset-0 flex items-center justify-center text-sm ${isDark ? 'text-slate-300' : 'text-[#0f427d]/70'}`}>
                    جارٍ تحميل الأطباء...
                  </div>
                )}
            </div>
          </div>

          {/* الجانب الأيسر: المحتوى النصي كما هو */}
          <div className="md:w-1/2 text-right z-10">
            <h2 className={`text-3xl md:text-4xl font-black mb-6 leading-tight ${isDark ? 'text-slate-100' : 'text-[#004060]'}`}>
              لماذا تختار <span className={isDark ? 'text-cyan-300' : 'text-[#008080]'}>أطباءنا؟</span>
            </h2>
            <p className={`text-sm md:text-base mb-10 leading-relaxed max-w-md ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
                نحن نضمن لك الوصول إلى أفضل الكفاءات الطبية المختارة بعناية، مع خبرات واسعة في كافة التخصصات لضمان سلامتك.
            </p>
            
            <Link 
              to="/doctors" 
              className={`group inline-flex items-center gap-3 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg ${isDark ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-[#004060] hover:bg-[#008080]'}`}
            >
              <span>تصفح كافة الأطباء</span>
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;