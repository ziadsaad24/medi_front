import React from 'react';
import { Pill, Clock, Activity, LayoutGrid } from 'lucide-react';
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
    <div className="w-full px-4 md:px-10 my-10 flex justify-center">
      <motion.div
        // أنيميشن "العوم" الهادئ جداً
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        
        style={{
          background: 'linear-gradient(270deg, #0f172a, #1e1b4b, #020617)',
          backgroundSize: '400% 400%',
        }}
        // أنيميشن الخلفية أصبح أبطأ مرتين (30 ثانية بدل 15)
        animate={{ 
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          y: [0, -6, 0] 
        }}
        transition={{ 
          backgroundPosition: { duration: 30, repeat: Infinity, ease: "linear" },
          y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative w-full max-w-[1400px] overflow-hidden border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-10"
      >
        
        {/* القسم الأول: العنوان */}
        <div className="flex items-center gap-6 min-w-fit relative z-10">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
          >
            <Pill className="text-blue-400" size={36} />
          </motion.div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tighter italic">جدول الأدوية</h3>
            <p className="text-[10px] text-blue-300/40 uppercase tracking-[0.3em] font-bold">Health Flow</p>
          </div>
        </div>

        {/* القسم الثاني: الجرعة القادمة (تصميم هادئ بحركة انسيابية) */}
        <div className="flex-grow flex items-center justify-center relative z-10 w-full md:w-auto">
          <div className="relative group flex items-center gap-10 bg-white/[0.03] border border-white/5 py-5 px-12 rounded-[2.5rem] w-full md:w-fit justify-between">
            {/* لمعة ناعمة تمر كل فترة طويلة */}
            <motion.div 
              animate={{ x: [-500, 700] }}
              transition={{ duration: 5, repeat: Infinity, repeatDelay: 7 }}
              className="absolute top-0 left-0 w-24 h-full bg-white/5 skew-x-12 blur-md"
            />
            
            <div className="flex items-center gap-5">
              <Clock className="text-emerald-400/60" size={24} />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">القادمة</p>
                <p className="text-white font-bold text-xl">{nextMed ? nextMed.name : 'تم الإنجاز'}</p>
              </div>
            </div>
            <p className="text-emerald-400 font-black text-5xl tracking-tighter">
              {nextMed ? nextMed.time : '--:--'}
            </p>
          </div>
        </div>

        {/* القسم الثالث: الإحصائيات وزر "عرض الكل" المعدل */}
        <div className="flex flex-col md:flex-row items-center gap-8 min-w-[350px] relative z-10">
          
          <div className="flex flex-col gap-2 w-full md:w-48">
            <div className="flex justify-between items-end px-1">
              <span className="text-[9px] text-slate-400 font-bold uppercase">الإلتزام</span>
              <span className="text-lg font-black text-blue-400/80">{Math.round(progress)}%</span>
            </div>
            <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden p-[1.5px] border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* زر عرض الكل بشادو خفيف جداً (توهج هادئ) */}
          <Link to="/medications" className="relative group">
            {/* الشادو المقلل */}
            <div className="absolute -inset-0.5 bg-blue-500/20 rounded-2xl blur group-hover:bg-blue-500/40 transition duration-500"></div>
            
            <div className="relative flex items-center gap-3 px-8 py-4 bg-transparent border border-blue-500/30 rounded-2xl group-hover:border-blue-400 transition-all duration-300">
              <LayoutGrid size={18} className="text-blue-400 opacity-70 group-hover:opacity-100" />
              <span className="text-white font-bold tracking-tight text-sm">عرض الكل</span>
            </div>
          </Link>

        </div>

        {/* ضوء خلفي خافت جداً يتحرك ببطء */}
        <motion.div 
           animate={{ opacity: [0.1, 0.2, 0.1] }}
           transition={{ duration: 8, repeat: Infinity }}
           className="absolute top-0 right-0 w-64 h-64 bg-blue-600 blur-[120px] pointer-events-none"
        />

      </motion.div>
    </div>
  );
};

export default MedicationWidget;