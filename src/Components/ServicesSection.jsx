import React from 'react';
import { Users, Calendar, Pill, FileText, PhoneCall, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // استيراد Link للربط بين الصفحات
import { useTheme } from '../context/ThemeContext';

const services = [
  { name: 'الأطباء', desc: 'تواصل مع نخبة من الأطباء المتخصصين', icon: <Users size={32} />, color: 'blue', path: '/doctors' },
  { name: 'المواعيد الطبية', desc: 'إدارة وحجز مواعيدك بكل سهولة', icon: <Calendar size={32} />, color: 'purple', path: '/appointments' },
  { name: 'تذكير الأدوية', desc: 'جدولك اليومي لتنظيم جرعات الدواء', icon: <Pill size={32} />, color: 'teal', path: '/medications' },
  { name: 'السجلات الطبية', desc: 'الوصول لتقاريرك وفحوصاتك بأمان', icon: <FileText size={32} />, color: 'indigo', path: '/recorded' },
  { name: 'اتصل بنا', desc: 'نحن هنا للإجابة على استفساراتك', icon: <PhoneCall size={32} />, color: 'red', path: '/contact' },
  { name: 'من نحن', desc: 'تعرف على رؤيتنا في تقديم الرعاية', icon: <Info size={32} />, color: 'emerald', path: '/about' },
];

const ServicesSection = () => {
  const { isDark } = useTheme();

  const colorMap = {
    blue: isDark ? 'bg-blue-500/15 text-blue-300 group-hover:bg-blue-500' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    purple: isDark ? 'bg-purple-500/15 text-purple-300 group-hover:bg-purple-500' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    teal: isDark ? 'bg-teal-500/15 text-teal-300 group-hover:bg-teal-500' : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600',
    indigo: isDark ? 'bg-indigo-500/15 text-indigo-300 group-hover:bg-indigo-500' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    red: isDark ? 'bg-rose-500/15 text-rose-300 group-hover:bg-rose-500' : 'bg-red-50 text-red-600 group-hover:bg-red-600',
    emerald: isDark ? 'bg-emerald-500/15 text-emerald-300 group-hover:bg-emerald-500' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
  };

  // تحويل كلاسات motion لتعمل مع Link
  const MotionLink = motion(Link);

  return (
    <section className={`py-24 relative ${isDark ? 'bg-[#020b1f]' : 'bg-transparent'}`}>
      {isDark && (
        <>
          <div className="absolute -top-10 right-0 w-[320px] h-[320px] rounded-full blur-[110px] pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
          <div className="absolute -bottom-10 left-0 w-[320px] h-[320px] rounded-full blur-[110px] pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />
        </>
      )}
      <div className="container mx-auto max-w-[1300px] px-6">
        
        {/* Header */}
        <div className="text-right mb-16">
          <h2 className={`text-3xl md:text-5xl font-black mb-4 ${isDark ? 'text-cyan-200' : 'text-[#004060]'}`}>الخدمات الطبية الرقمية</h2>
          <p className={`font-bold max-w-2xl ml-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-500'}`}>
            وصول سريع وشامل لكافة أدوات الرعاية الصحية الخاصة بك في مكان واحد، مصممة لتسهيل رحلتك العلاجية.
          </p>
        </div>

        {/* Grid الأيقونات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <MotionLink
              to={service.path} // هنا يتم التوجيه بناءً على الـ path في المصفوفة
              key={idx}
              whileHover={{ y: -10 }}
              className={`group relative p-8 rounded-[32px] shadow-sm border block overflow-hidden transition-all duration-500 hover:shadow-2xl ${isDark ? 'bg-slate-900/80 border-slate-700/60 hover:border-cyan-400/40 hover:shadow-cyan-950/20' : 'bg-white border-gray-100 hover:shadow-teal-900/10'}`}
            >
              {/* أيقونة خلفية خافتة للزينة */}
              <div className={`absolute -bottom-6 -left-6 opacity-[0.05] group-hover:opacity-[0.12] group-hover:scale-150 transition-all duration-700 rotate-12 ${isDark ? 'text-cyan-300/30' : 'text-gray-50'}`}>
                {service.icon}
              </div>

              <div className="flex flex-row-reverse items-start gap-6 relative z-10">
                {/* الحاوية الملونة للأيقونة */}
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${colorMap[service.color]} group-hover:text-white group-hover:rotate-[360deg] group-hover:shadow-lg`}>
                  {service.icon}
                </div>

                {/* المحتوى النصي */}
                <div className="text-right flex-1">
                  <h3 className={`text-xl font-black mb-2 transition-colors ${isDark ? 'text-slate-100 group-hover:text-cyan-300' : 'text-[#004060] group-hover:text-[#008080]'}`}>
                    {service.name}
                  </h3>
                  <p className={`text-sm font-medium leading-relaxed mb-4 ${isDark ? 'text-slate-300/90' : 'text-gray-400'}`}>
                    {service.desc}
                  </p>
                  
                  {/* زر الانتقال */}
                  <div className={`flex items-center justify-end gap-2 font-bold text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 ${isDark ? 'text-cyan-300' : 'text-[#008080]'}`}>
                    <span>انتقال الآن</span>
                    <ArrowLeft size={14} />
                  </div>
                </div>
              </div>

              {/* خط تجميلي أسفل الكارت */}
              <div className={`absolute bottom-0 right-0 h-1 w-0 group-hover:w-full transition-all duration-500 ${isDark ? 'bg-gradient-to-l from-cyan-400 to-transparent' : 'bg-gradient-to-l from-[#008080] to-transparent'}`}></div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;