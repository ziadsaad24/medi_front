import React from 'react';
import { Pill, Clock, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMedications } from '../hooks/use-medications';

const MedicationWidget = () => {
  const { medications } = useMedications();

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  const nextMed = medications
    .filter(m => !m.taken)
    .sort((a, b) => a.time.localeCompare(b.time))[0];

  return (
    <div className="w-full px-3 sm:px-4 md:px-10 my-6 md:my-10 flex justify-center">
      <motion.div
        style={{
          background: 'linear-gradient(270deg, #0f172a, #1e1b4b, #020617)',
          backgroundSize: '400% 400%',
        }}
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          y: [0, -6, 0] 
        }}
        transition={{ 
          backgroundPosition: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        dir="rtl"
        className="
          relative w-full max-w-[1400px] overflow-hidden
          border border-white/10 
          rounded-2xl md:rounded-[2.5rem] lg:rounded-[3rem]
          p-5 sm:p-6 md:p-10 lg:p-10
          shadow-2xl
          flex flex-col xl:flex-row
          items-stretch xl:items-center
          justify-between
          gap-6 md:gap-8 xl:gap-10
        "
      >

        {/* العنوان — فوق يمين */}
        <div className="flex items-center gap-4 md:gap-5 xl:gap-6 min-w-fit relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-3 md:p-5 bg-white/5 backdrop-blur-md rounded-2xl lg:rounded-3xl border border-white/10"
          >
            <Pill className="text-blue-400" size={24} />
          </motion.div>

          <div>
            <h3 className="text-xl md:text-3xl font-black text-white tracking-tighter italic">
              جدول الأدوية
            </h3>
            <p className="text-[8px] md:text-[10px] text-blue-300/40 uppercase tracking-[0.3em] font-bold">
              Health Flow
            </p>
          </div>
        </div>

        {/* الجرعة + الالتزام — جنب بعض على الآيباد */}
        <div className="flex flex-col sm:flex-row items-center gap-5 md:gap-8 w-full xl:w-auto relative z-10">
          
          {/* الجرعة القادمة */}
          <div className="
            relative group flex flex-col sm:flex-row items-center flex-1
            gap-4 sm:gap-6 md:gap-8
            bg-white/[0.03] border border-white/5 
            py-4 md:py-5 px-5 sm:px-8 md:px-10 xl:px-12 
            rounded-2xl md:rounded-[2.5rem] 
            w-full xl:w-fit
          ">
            <motion.div 
              animate={{ x: [-500, 700] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 7 }}
              className="hidden md:block absolute top-0 left-0 w-24 h-full bg-white/5 skew-x-12 blur-md"
            />

            <div className="flex items-center gap-3 md:gap-5">
              <Clock className="text-emerald-400/60" size={20} />
              <div>
                <p className="text-[8px] md:text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  القادمة
                </p>
                <p className="text-white font-bold text-base md:text-xl text-center sm:text-right">
                  {nextMed ? nextMed.name : 'تم الإنجاز'}
                </p>
              </div>
            </div>

            <p className="text-emerald-400 font-black text-2xl sm:text-3xl md:text-5xl tracking-tighter">
              {nextMed ? nextMed.time : '--:--'}
            </p>
          </div>

          {/* الالتزام */}
          <div className="flex flex-col gap-2 w-full sm:w-40 md:w-48">
            <div className="flex justify-between items-end px-1">
              <span className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase">
                الإلتزام
              </span>
              <span className="text-base md:text-lg font-black text-blue-400/80">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-[1.5px] border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* عرض الكل — تحتهم */}
        <div className="w-full xl:w-auto relative z-10">
          <Link to="/medications" className="relative group block">
            <div className="absolute -inset-0.5 bg-blue-500/20 rounded-xl blur group-hover:bg-blue-500/40 transition duration-500"></div>
            
            <div className="
              relative flex items-center justify-center gap-2 md:gap-3
              px-5 md:px-8 py-3 md:py-4
              bg-transparent border border-blue-500/30
              rounded-xl md:rounded-2xl
            ">
              <LayoutGrid size={16} className="text-blue-400 opacity-70 group-hover:opacity-100" />
              <span className="text-white font-bold text-xs md:text-sm">
                عرض الكل
              </span>
            </div>
          </Link>
        </div>

        {/* الإضاءة */}
        <motion.div 
          animate={{ opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="hidden md:block absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[120px] pointer-events-none"
        />

      </motion.div>
    </div>
  );
};

export default MedicationWidget;