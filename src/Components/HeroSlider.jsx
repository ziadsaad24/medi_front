import React, { useEffect } from 'react';
import { Calendar, ArrowRight, ShieldCheck, MessageCircle } from 'lucide-react';

// استيراد الصور المحلية
import Doctor from '../assets/images/doctor.png';

const HeroSlider = () => {
  useEffect(() => {
    // التأكد من أن السويبر متاح عالمياً من الـ index.html
    if (window.Swiper) {
      new window.Swiper('.mySwiper', {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true }, // لضمان عدم تداخل السلايدات
        speed: 1000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
      });
    }
  }, []);

  const slides = [
    {
      title: "مستقبل الرعاية الصحية بين يديك الآن",
      desc: "نجمع بين الذكاء الاصطناعي المتطور والخبرة الطبية الرائدة لتقديم تجربة رعاية صحية استثنائية تليق بك.",
      img: Doctor,
      badge: "تقنيات الجيل الخامس"
    },
    {
      title: "أفضل الأطباء المتخصصين في خدمتك",
      desc: "احجز موعدك الآن مع نخبة من الاستشاريين في كافة التخصصات الطبية بأعلى معايير الجودة العالمية.",
      img: Doctor,
      badge: "أكثر من 500 طبيب"
    }
  ];

  return (
    <div className="relative h-[600px] md:h-[750px] w-full bg-[#FCFDFE] overflow-hidden pt-20">
      <div className="swiper mySwiper h-full w-full">
        <div className="swiper-wrapper">
          {slides.map((slide, idx) => (
            <div className="swiper-slide bg-[#FCFDFE]" key={idx}>
              <div className="container mx-auto h-full px-6 flex flex-col lg:flex-row-reverse items-center justify-between gap-10">
                
                {/* النصوص */}
                <div className="flex-1 text-right z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#008080]/10 text-[#008080] px-4 py-2 rounded-full text-xs font-bold hero-title">
                    <ShieldCheck size={16} />
                    {slide.badge}
                  </div>
                  
                  <h1 className="text-4xl md:text-7xl font-black text-[#004060] leading-[1.1] hero-title">
                    {slide.title}
                  </h1>
                  
                  <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl hero-text">
                    {slide.desc}
                  </p>

                  <div className=" flex flex-row-reverse items-center gap-4 pt-4 hero-btns">
                    <button className="custom-btn px-10 py-4 rounded-2xl font-bold flex items-center gap-2 text-sm shadow-xl shadow-blue-900/20">
                      <Calendar size={20} />
                      احجز موعدك الآن
                    </button>
                    <button className="px-8 py-4 border-2 border-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2 text-sm">
                      استكشف خدماتنا
                      <ArrowRight size={18} className="rotate-180" />
                    </button>
                  </div>
                </div>

                {/* صورة الطبيب والدائرة */}
                <div className="flex-1 relative h-full flex items-end justify-center">
                  {/* الدائرة الخلفية العائمة */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-gradient-to-tr from-[#0F427D]/5 to-[#008080]/10 rounded-full blur-3xl"></div>
                  
                  {/* كارت الاستشارات بدلاً من النبض */}
                  <div className="absolute top-1/3 left-0 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-20 border border-white/50 floating-card">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#008080]/10 rounded-xl flex items-center justify-center text-[#008080]">
                           <MessageCircle size={20} />
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-gray-400 font-bold uppercase">متاح الآن</p>
                           <p className="text-sm font-black text-[#004060]">استشارات مجانية</p>
                        </div>
                     </div>
                  </div>

                  {/* الطبيب مع كلاس الحركة */}
                  <img 
                    src={slide.img} 
                    alt="Doctor" 
                    className="relative z-10 w-full max-w-[550px] object-contain drop-shadow-2xl hero-doctor-img"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </div>
  );
};

export default HeroSlider;