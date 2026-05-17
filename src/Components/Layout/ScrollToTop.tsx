import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.innerWidth < 1024);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          whileHover={{ 
            scale: 1.1, 
            boxShadow: "0 0 30px rgba(37, 99, 235, 0.4)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          // تم إضافة bg-slate-900/10 لضمان وجود ظل خفيف خلف السهم دائماً
          className={`fixed z-[999] flex items-center justify-center rounded-2xl bg-white/20 backdrop-blur-2xl border border-blue-500/30 shadow-2xl transition-all group overflow-hidden ${
            isMobile ? "bottom-[160px] right-6 w-12 h-12" : "bottom-32 right-8 w-14 h-14"
          }`}
        >
          {/* طبقة سواد خفيفة جداً في الخلفية لزيادة التباين */}
          <div className="absolute inset-0 bg-slate-900/5 group-hover:bg-blue-600/10 transition-colors" />
          
          {/* السهم بلون أزرق متدرج ليكون واضحاً جداً */}
          <ChevronUp 
            size={isMobile ? 26 : 32} 
            className="relative z-10 text-[#0f427d] group-hover:text-blue-700 transition-transform duration-300 stroke-[3.5px] drop-shadow-sm" 
          />
          
          {/* تأثير ضوئي متحرك في الأسفل */}
          <motion.div 
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute bottom-0 w-full h-1 bg-blue-500/40 blur-sm"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;