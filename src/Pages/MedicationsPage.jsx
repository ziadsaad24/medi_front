import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Trash2, CheckCircle2, Circle, Clock, Pill, LayoutDashboard, Activity, ArrowRight } from 'lucide-react';
import { useMedications } from '../hooks/use-medications';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';

export function MedicationsPage() {
  const { medications, addMedication, toggleMedication, deleteMedication } = useMedications();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', dosage: '', time: '', frequency: 'مرة يومياً' });
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
    <div className="flex flex-col min-h-screen bg-[#020617] text-white" dir="rtl">
      
      <main className="flex-grow pt-32 pb-20 px-4 md:px-8 relative overflow-hidden">
        
        {/* الخلفيات المضيئة */}
        <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          
          {/* زر العودة */}
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors mb-6 font-bold text-sm"
          >
            <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
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
                <div className="p-3 bg-blue-500/10 backdrop-blur-sm rounded-2xl border border-blue-500/20">
                  <Pill className="text-blue-400" size={28} />
                </div>
                <h1 className="text-5xl font-black tracking-tight">
                  جدول <span className="text-blue-400">الأدوية</span>
                </h1>
              </div>
              <p className="text-slate-400 text-sm">تتبع أدويتك اليومية بسهولة</p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowAdd(!showAdd)}
              className="group relative px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all duration-300 font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <div className="flex items-center gap-2">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                إضافة دواء
              </div>
            </motion.button>
          </header>

          {/* Form */}
          <AnimatePresence>
            {showAdd && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mb-8 overflow-hidden"
              >
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">إضافة دواء جديد</h3>
                    <button
                      onClick={() => setShowAdd(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="اسم الدواء"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none"
                    />
                    <input
                      type="text"
                      placeholder="الجرعة (مثال: 500mg)"
                      value={form.dosage}
                      onChange={(e) => setForm({ ...form, dosage: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none"
                    />
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none"
                    />
                    <select
                      value={form.frequency}
                      onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                      className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-blue-500/50 focus:bg-white/10 transition-all outline-none"
                    >
                      <option value="مرة يومياً">مرة يومياً</option>
                      <option value="مرتين يومياً">مرتين يومياً</option>
                      <option value="3 مرات يومياً">3 مرات يومياً</option>
                      <option value="كل 6 ساعات">كل 6 ساعات</option>
                      <option value="عند الحاجة">عند الحاجة</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (form.name && form.dosage && form.time) {
                        addMedication(form);
                        setForm({ name: '', dosage: '', time: '', frequency: 'مرة يومياً' });
                        setShowAdd(false);
                      }
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-colors"
                  >
                    حفظ
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Medications List */}
          {medications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 bg-white/5 rounded-full flex items-center justify-center">
                <Pill className="text-slate-600" size={40} />
              </div>
              <p className="text-slate-400 text-lg">لا توجد أدوية مضافة بعد</p>
              <p className="text-slate-500 text-sm mt-2">ابدأ بإضافة أول دواء</p>
            </motion.div>
          ) : (
            <div className="grid gap-4">
              {medications.map((med, i) => (
                <motion.div
                  key={med.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative"
                >
                  <div
                    className="relative p-6 rounded-2xl border transition-all duration-300"
                    style={{
                      background: med.taken
                        ? 'rgba(255, 255, 255, 0.03)'
                        : `linear-gradient(135deg, ${med.color} 0%, transparent 100%)`,
                      borderColor: med.taken ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() => toggleMedication(med.id)}
                          className="flex-shrink-0"
                        >
                          {med.taken ? (
                            <CheckCircle2 className="text-emerald-400" size={28} />
                          ) : (
                            <Circle className="text-slate-500" size={28} />
                          )}
                        </button>

                        <div className="flex-1">
                          <h3
                            className={`text-xl font-bold mb-1 ${
                              med.taken ? 'line-through text-slate-500' : ''
                            }`}
                          >
                            {med.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Activity size={14} />
                              {med.dosage}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {med.time}
                            </span>
                            <span>{med.frequency}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteMedication(med.id)}
                        className="p-2 hover:bg-red-500/20 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="text-red-400" size={20} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
}
