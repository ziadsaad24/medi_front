import React from 'react';
import { Users, Calendar, Pill, FileText, PhoneCall, Info, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // استيراد Link للربط بين الصفحات

const services = [
  { name: 'الأطباء', desc: 'تواصل مع نخبة من الأطباء المتخصصين', icon: <Users size={32} />, color: 'blue', path: '/doctors' },
  { name: 'المواعيد الطبية', desc: 'إدارة وحجز مواعيدك بكل سهولة', icon: <Calendar size={32} />, color: 'purple', path: '/appointments' },
  { name: 'تذكير الأدوية', desc: 'جدولك اليومي لتنظيم جرعات الدواء', icon: <Pill size={32} />, color: 'teal', path: '/medicine' },
  { name: 'السجلات الطبية', desc: 'الوصول لتقاريرك وفحوصاتك بأمان', icon: <FileText size={32} />, color: 'indigo', path: '/records' },
  { name: 'اتصل بنا', desc: 'نحن هنا للإجابة على استفساراتك', icon: <PhoneCall size={32} />, color: 'red', path: '/contact' },
  { name: 'من نحن', desc: 'تعرف على رؤيتنا في تقديم الرعاية', icon: <Info size={32} />, color: 'emerald', path: '/about' },
];

const ServicesSection = () => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600',
    teal: 'bg-teal-50 text-teal-600 group-hover:bg-teal-600',
    indigo: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    red: 'bg-red-50 text-red-600 group-hover:bg-red-600',
    emerald: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600',
  };

  // تحويل كلاسات motion لتعمل مع Link
  const MotionLink = motion(Link);

  return (
    <section className="py-24 bg-gradient-to-b from-[#FCFDFE] via-[#F1F5F9] to-[#E2E8F0]">
      <div className="container mx-auto max-w-[1300px] px-6">
        
        {/* Header */}
        <div className="text-right mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-[#004060] mb-4">الخدمات الطبية الرقمية</h2>
          <p className="text-gray-500 font-bold max-w-2xl ml-auto leading-relaxed">
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
              className="group relative bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 block overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-teal-900/10"
            >
              {/* أيقونة خلفية خافتة للزينة */}
              <div className="absolute -bottom-6 -left-6 text-gray-50 opacity-[0.03] group-hover:opacity-[0.08] group-hover:scale-150 transition-all duration-700 rotate-12">
                {service.icon}
              </div>

              <div className="flex flex-row-reverse items-start gap-6 relative z-10">
                {/* الحاوية الملونة للأيقونة */}
                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm ${colorMap[service.color]} group-hover:text-white group-hover:rotate-[360deg] group-hover:shadow-lg`}>
                  {service.icon}
                </div>

                {/* المحتوى النصي */}
                <div className="text-right flex-1">
                  <h3 className="text-xl font-black text-[#004060] mb-2 group-hover:text-[#008080] transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-4">
                    {service.desc}
                  </p>
                  
                  {/* زر الانتقال */}
                  <div className="flex items-center justify-end gap-2 text-[#008080] font-bold text-xs opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                    <span>انتقال الآن</span>
                    <ArrowLeft size={14} />
                  </div>
                </div>
              </div>

              {/* خط تجميلي أسفل الكارت */}
              <div className="absolute bottom-0 right-0 h-1 bg-gradient-to-l from-[#008080] to-transparent w-0 group-hover:w-full transition-all duration-500"></div>
            </MotionLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;