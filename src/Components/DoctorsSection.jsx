import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Autoplay } from 'swiper/modules';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'swiper/css';

const DoctorsSection = ({ doctors = [] }) => {
  const displayDoctors = doctors?.slice(0, 6) || [];

  if (displayDoctors.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#f0fafa] relative overflow-hidden" dir="rtl">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* الجانب الأيمن: السلايدر */}
          {/* زيادة h-[500px] تعطي مساحة أكبر للكروت لتطول */}
          <div className="md:w-[45%] h-[500px] w-full relative flex items-center justify-center">
            <div className="w-full h-full overflow-hidden py-4"> 
                <Swiper
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
                modules={[Mousewheel, Autoplay]}
                className="h-full w-full"
                >
                {displayDoctors.map((doc) => (
                    <SwiperSlide key={doc.id} className="flex items-center justify-center">
                    {({ isActive }) => (
                        <div className={`
                        relative flex flex-row items-center gap-6 p-6 rounded-[2rem] border bg-white transition-all duration-500 w-[90%] mx-auto
                        ${isActive 
                            ? 'shadow-[0_15px_35px_rgba(0,128,128,0.15)] scale-105 z-50 border-teal-50 h-[160px]' // تحكمت في الارتفاع هنا h-[160px]
                            : 'opacity-40 scale-90 blur-[0.5px] border-transparent h-[140px]'}
                        `}>
                        {/* الشرطة الجانبية جهة اليمين */}
                        <div className={`absolute right-0 top-1/4 w-1.5 h-1/2 rounded-r-full bg-[#008080] transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                        
                        <div className="text-right flex-1 pr-4">
                            <h4 className="font-black text-[#004060] text-lg md:text-xl mb-1">{doc.name}</h4>
                            <p className="text-[#008080] font-bold text-xs md:text-sm">{doc.specialty}</p>
                            {/* إضافة وصف بسيط أو عيادة لجعل الكارت يمتلئ طولياً */}
                            <p className="text-gray-400 text-[10px] mt-2 font-medium italic">{doc.clinic || "المركز الطبي التخصصي"}</p>
                        </div>

                        <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl overflow-hidden border-2 border-slate-50 shadow-sm transition-transform duration-500 group">
                            <img 
                            src={doc.image} 
                            alt={doc.name} 
                            className="w-full h-full object-cover object-top" 
                            />
                        </div>
                        </div>
                    )}
                    </SwiperSlide>
                ))}
                </Swiper>
            </div>
          </div>

          {/* الجانب الأيسر: المحتوى النصي كما هو */}
          <div className="md:w-1/2 text-right z-10">
            <h2 className="text-[#004060] text-3xl md:text-4xl font-black mb-6 leading-tight">
              لماذا تختار <span className="text-[#008080]">أطباءنا؟</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-10 leading-relaxed max-w-md">
                نحن نضمن لك الوصول إلى أفضل الكفاءات الطبية المختارة بعناية، مع خبرات واسعة في كافة التخصصات لضمان سلامتك.
            </p>
            
            <Link 
              to="/doctors" 
              className="group inline-flex items-center gap-3 bg-[#004060] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#008080] transition-all shadow-lg"
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