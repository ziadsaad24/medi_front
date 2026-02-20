import React, { useEffect } from 'react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion'; // استيراد framer-motion

const DoctorsGridPage = ({ allDoctors }) => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  // إعدادات الانيميشن للحاوية (الأب)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // المسافة الزمنية بين ظهور كل كارت والآخر
      }
    }
  };

  // إعدادات الانيميشن لكل كارت (الابن)
  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 // يبدأ من أسفل قليلاً
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar /> 
      <div className="container mx-auto max-w-[1300px] px-6 py-28" dir="rtl">
        <div className="text-right mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black text-[#004060]"
          >
            كادرنا الطبي
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 mt-2"
          >
            تصفح قائمة الأطباء المتخصصين
          </motion.p>
        </div>

        {/* تحويل الـ div العادي إلى motion.div لتطبيق الـ stagger */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          {allDoctors.map((doc) => (
            <motion.div 
              key={doc.id} 
              variants={itemVariants}
              whileHover={{ y: -5 }} // حركة بسيطة عند تمرير الماوس
              className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow text-center group"
            >
              <img 
                src={doc.image} 
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-slate-50 group-hover:border-[#008080] transition-all duration-300" 
                alt={doc.name} 
              />
              <h4 className="font-black text-[#004060] text-lg">{doc.name}</h4>
              <p className="text-[#008080] font-bold text-xs mb-4">{doc.specialty}</p>
              
              <div className="flex items-center justify-center gap-2 bg-slate-50 py-2 rounded-xl text-gray-500 text-[10px] mb-6">
                <Clock size={14} /> <span>خبرة {doc.exp}</span>
              </div>
              
              <button className="custom-btn w-full bg-[#004060] text-white py-3 rounded-xl font-bold hover:bg-[#008080] transition-all">
                حجز موعد
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorsGridPage;