import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-lg"
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[140px] font-black leading-none bg-gradient-to-r from-[#0F427D] to-[#008080] bg-clip-text text-transparent mb-0"
        >
          404
        </motion.h1>

        {/* Pulse Line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-32 h-1 bg-gradient-to-r from-[#0F427D] to-[#008080] mx-auto rounded-full mb-8"
        />

        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          الصفحة غير موجودة
        </h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
          <br />
          يمكنك العودة للصفحة الرئيسية.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold shadow-lg hover:brightness-110 transition-all"
          >
            <Home size={20} />
            العودة للرئيسية
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0F427D] border border-blue-200 rounded-2xl font-bold shadow-sm hover:bg-blue-50 transition-all"
          >
            <ArrowRight size={20} />
            الرجوع للخلف
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
