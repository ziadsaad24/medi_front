import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // تم تصحيح الاستيراد
import { ChevronLeft, ChevronRight, Circle, Play, Pause, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// import { ImageWithFallback } from './figma/ImageWithFallback'; // لو عندك مكون ImageWithFallback
import photo1 from '../assets/images/photo-1.jpg';
import photo2 from '../assets/images/photo-2.jpg';
import photo3 from '../assets/images/photo-3.jpg';
import photo4 from '../assets/images/photo-4.jpg';

const slides = [
  {
    id: 1,
    title: 'سجلك الطبي الإلكتروني',
    subtitle: 'معلوماتك في مكان واحد',
    description: 'احتفظ بسجلك الطبي الكامل، تقاريرك، وتاريخك المرضي بشكل آمن ومنظم يمكن الوصول إليه في أي وقت',
    image: photo1,
    cta: 'سجلي الطبي',
    link: '/recorded'
  },
  {
    id: 2,
    title: 'تعرف على أطبائنا المتخصصين',
    subtitle: 'اختر طبيبك المناسب',
    description: 'تصفح قائمة الأطباء المتخصصين لدينا واختر الطبيب المناسب لحالتك الصحية بكل سهولة ويسر',
    image: photo2,
    cta: 'تصفح الأطباء',
    link: '/patient/doctors'
  },
  {
    id: 3,
    title: 'احجز موعدك بسهولة',
    subtitle: 'حجز سريع ومرن',
    description: 'احجز موعد استشارتك الطبية في الوقت المناسب لك من خلال نظامنا الإلكتروني السهل والسريع',
      image: photo3,
    cta: 'احجز الآن',
    link: '/patient/doctors'
  },
  {
    id: 4,
    title: 'تذكير بمواعيد الأدوية',
    subtitle: 'لن تنسى دواءك مرة أخرى',
    description: 'سجل أدويتك واحصل على تنبيهات تلقائية لتذكيرك بمواعيد تناول الدواء والجرعات المحددة',
     image: photo4,
    cta: 'إضافة دواء',
    link: '/medications'
  }
];

export default function HeroSlider() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isAutoPlaying]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const textVariants = {
    enter: { y: 50, opacity: 0 },
    center: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden" dir="rtl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 }
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0">
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'var(--hero-home-overlay)' }} />
          </div>

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
              <div className="max-w-3xl">
                <motion.div
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span
                    className="inline-block px-4 py-2 mb-6 backdrop-blur-sm border rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--app-primary) 22%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--app-primary) 45%, transparent)',
                      color: 'var(--app-primary)'
                    }}
                  >
                    {slides[currentSlide].subtitle}
                  </span>
                </motion.div>

                <motion.h1
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                >
                  {currentSlide === 0 && (
                    <div className="flex items-center gap-4 mb-2">
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
                        className="p-4 backdrop-blur-sm rounded-2xl border-2"
                        style={{
                          backgroundColor: 'color-mix(in srgb, var(--app-primary) 30%, transparent)',
                          borderColor: 'color-mix(in srgb, var(--app-primary) 55%, transparent)'
                        }}
                      >
                        <QrCode className="w-12 h-12 md:w-16 md:h-16" style={{ color: 'var(--app-primary)' }} />
                      </motion.div>
                    </div>
                  )}
                  {slides[currentSlide].title}
                </motion.h1>

                <motion.p
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed"
                >
                  {slides[currentSlide].description}
                </motion.p>

                <motion.div
                  variants={textVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap gap-4"
                >
                  <button
                    onClick={() => navigate(slides[currentSlide].link)}
                    className="px-8 py-4 text-white rounded-lg font-medium transition-all duration-300 hover:brightness-110 hover:scale-105"
                    style={{
                      backgroundColor: 'var(--app-primary)',
                      boxShadow: '0 12px 24px color-mix(in srgb, var(--app-primary) 30%, transparent)'
                    }}
                  >
                    {slides[currentSlide].cta}
                  </button>
                  <button className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-medium border border-white/20 transition-all duration-300 hover:scale-105">
                    تواصل معنا
                  </button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-8 z-20">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <Circle
                className={`w-3 h-3 transition-all duration-300 ${
                  currentSlide === index
                    ? 'scale-125'
                    : 'fill-white/50 text-white/50 hover:fill-white hover:text-white'
                }`}
                style={currentSlide === index ? { fill: 'var(--app-primary)', color: 'var(--app-primary)' } : undefined}
              />
              {currentSlide === index && (
                <motion.div
                  layoutId="activeSlide"
                  className="absolute -inset-2 rounded-full"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--app-primary) 25%, transparent)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all duration-300 border border-white/20"
          aria-label={isAutoPlaying ? 'Pause autoplay' : 'Play autoplay'}
        >
          {isAutoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      <button
        onClick={prevSlide}
        className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all duration-300 border border-white/20 hover:scale-110 z-20 group"
        aria-label="الشريحة السابقة"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:block absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full transition-all duration-300 border border-white/20 hover:scale-110 z-20 group"
        aria-label="الشريحة التالية"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
        <motion.div
          key={currentSlide}
          className="h-full"
          style={{ backgroundColor: 'var(--app-primary)' }}
          initial={{ width: '0%' }}
          animate={{ width: isAutoPlaying ? '100%' : '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
        />
      </div>

      <div className="absolute top-22 left-8 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 text-white font-medium z-20">
        <span className="text-xl">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="text-white/60 mx-2">/</span>
        <span className="text-white/60">{String(slides.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}