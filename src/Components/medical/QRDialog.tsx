import React from "react";
import QRCode from "react-qr-code";
import { Copy, Download, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const QRDialog = ({ isOpen, onClose, url }: { isOpen: boolean; onClose: any; url: string }) => {
  if (!isOpen) return null;

  // حل مشكلة الـ Object في مكتبة QRCode
  const QRComp = (QRCode as any).default ? (QRCode as any).default : QRCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    // يمكنك استبدال الـ alert بـ toast إذا كنت تستخدمها
    alert("تم نسخ الرابط بنجاح! 🎉");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop (خلفية ضبابية) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onClose(false)}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Content (النافذة الزجاجية) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-8 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.6)] overflow-hidden"
        >
          {/* لمسة ديكورية علوية */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          {/* زر الإغلاق */}
          <button 
            onClick={() => onClose(false)} 
            className="absolute top-6 left-6 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X size={24} />
          </button>
          
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="space-y-2 mt-4">
              <h3 className="text-3xl font-black text-white tracking-tight">جاهز للمشاركة!</h3>
              <p className="text-slate-400 text-sm">كود QR آمن يحتوي على جميع بياناتك</p>
            </div>
            
            {/* إطار الـ QR Code الزجاجي */}
            <motion.div 
              whileHover={{ rotate: 2 }}
              className="p-6 bg-white rounded-[2.5rem] shadow-[0_0_50px_rgba(59,130,246,0.3)] relative group"
            >
              <div className="relative z-10">
                <QRComp 
                  value={url} 
                  size={200} 
                  fgColor="#0f172a" // لون الكود نفسه ليكون متناسق
                  level="H" 
                />
              </div>
              {/* تأثير نبضي خلف الكود */}
              <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
            </motion.div>

            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-slate-300 text-xs font-mono truncate max-w-[200px]">{url}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={handleCopy} 
                className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Copy size={18}/> نسخ
              </button>
              <button 
                onClick={() => window.print()} 
                className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-900/20"
              >
                <Download size={18}/> طباعة
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};