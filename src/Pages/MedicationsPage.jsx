import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// أضفنا أيقونة ArrowRight للعودة
import { Plus, X, Trash2, CheckCircle2, Circle, Clock, Pill, LayoutDashboard, Activity, ArrowRight } from 'lucide-react';
import { useMedications } from '../hooks/use-medications';
import { useNavigate } from 'react-router-dom'; // لاستخدام خاصية الرجوع للخلف
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

export function MedicationsPage() {
  const { medications, isLoading, addMedication, toggleMedication, deleteMedication } = useMedications();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', time: '', frequency: '' });
  const navigate = useNavigate(); // دالة التنقل

  return (
    <>
    
      <Navbar />
    <div className="flex flex-col min-h-screen theme-page" dir="rtl">
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        
        {/* الخلفيات المضيئة */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] blur-[120px] pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
        <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] blur-[100px] pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* زر العودة المضاف حديثاً */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/home')} // يعود مباشرة للصفحة الرئيسية
            className="group flex items-center gap-2 theme-text-muted hover:text-blue-400 transition-colors mb-6 font-bold text-sm"
          >
            <div className="p-2 rounded-full theme-surface group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
            <span>العودة للرئيسية</span>
          </motion.button>

          {/* Header */}
          <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                  <LayoutDashboard className="text-blue-400" size={28} />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight theme-title">إدارة البرنامج <span className="text-blue-500">العلاجي</span></h1>
              </div>
              <p className="theme-text-muted text-lg font-medium tracking-wide">متابعة دقيقة للجدول الزمني للجرعات اليومية</p>
            </motion.div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20"
            >
              <Plus size={24} />
              <span>إضافة دواء جديد</span>
            </motion.button>
          </header>

          {/* قائمة الأدوية */}
          <div className="grid gap-5">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={`med-loading-${item}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-8 rounded-[2.5rem] theme-surface"
                    >
                      <div className="animate-pulse space-y-4">
                        <div className="h-6 w-48 rounded-lg" style={{ background: 'var(--app-border)' }} />
                        <div className="h-4 w-72 rounded-lg" style={{ background: 'var(--app-border)' }} />
                        <div className="h-4 w-56 rounded-lg" style={{ background: 'var(--app-border)' }} />
                      </div>
                    </motion.div>
                  ))}
                </>
              ) : medications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-center py-24 theme-surface border-2 border-dashed rounded-[3rem]"
                >
                  <Pill className="mx-auto mb-4 text-slate-700" size={48} />
                  <p className="theme-text-muted text-xl font-medium">لا توجد أدوية مسجلة حالياً.</p>
                </motion.div>
              ) : (
                medications.map((med) => (
                  <motion.div
                    key={med.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`group flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-[2.5rem] border transition-all duration-300 ${
                      med.taken 
                      ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60' 
                      : 'theme-surface hover:border-blue-500/30 shadow-xl shadow-black/20'
                    }`}
                  >
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <button 
                        onClick={() => toggleMedication(med.id)}
                        className="transition-transform active:scale-90"
                      >
                        {med.taken ? (
                          <CheckCircle2 className="text-emerald-400" size={34} />
                        ) : (
                          <Circle className="theme-text-muted hover:text-blue-400" size={34} />
                        )}
                      </button>
                      <div>
                        <h3 className={`text-2xl font-bold tracking-tight ${med.taken ? 'line-through theme-text-muted' : 'theme-title'}`}>
                          {med.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <span className="flex items-center gap-2 text-sm text-blue-400 font-bold bg-blue-400/10 px-3 py-1 rounded-full border border-blue-400/20">
                            <Clock size={16}/> {med.time}
                          </span>
                          <span className="text-sm theme-text-muted font-bold flex items-center gap-2">
                            <Activity size={16} className="text-slate-500" /> {med.dosage}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => deleteMedication(med.id)} 
                      className="mt-6 md:mt-0 p-3 theme-text-muted hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all self-end md:self-center"
                    >
                      <Trash2 size={22} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* المودال */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="theme-card p-10 rounded-[3rem] w-full max-w-lg shadow-[0_0_50px_rgba(0,0,0,0.5)]"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-black italic theme-title">إضافة جرعة</h2>
                <button onClick={() => setShowAdd(false)} className="p-2 hover:bg-white/5 rounded-full theme-text-muted transition-colors">
                  <X size={28} />
                </button>
              </div>
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                addMedication(form);
                setShowAdd(false);
              }}>
                <div className="space-y-2">
                  <label className="text-sm font-bold theme-text-muted mr-2">اسم الدواء</label>
                  <input 
                    placeholder="اسم المستحضر الطبي.." required
                    className="w-full theme-input p-5 rounded-2xl outline-none transition-all"
                    onChange={(e) => setForm({...form, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold theme-text-muted mr-2">الجرعة</label>
                    <input 
                      placeholder="مثلاً: قرص واحد" required
                      className="w-full theme-input p-5 rounded-2xl outline-none"
                      onChange={(e) => setForm({...form, dosage: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold theme-text-muted mr-2">التوقيت</label>
                    <input 
                      type="time" required
                      className="w-full theme-input p-5 rounded-2xl outline-none"
                      onChange={(e) => setForm({...form, time: e.target.value})}
                    />
                  </div>
                </div>
                <button className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-blue-500 transition-all active:scale-[0.98] mt-4">
                  تأكيد الحفظ
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
      <Footer />
    </>
  );
}
