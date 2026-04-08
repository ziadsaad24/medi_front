import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, MessageSquare, ArrowRight, Phone, MapPin, CheckCircle2, Globe } from 'lucide-react';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import { patientAPI } from '../services/api';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        title: `شكوى من ${formData.name || 'مستخدم'}`,
        message: formData.message,
        category: 'technical',
      };

      await patientAPI.addComplaint(payload);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting complaint:', error?.response?.data || error);
      const status = error?.response?.status;
      const backendMessage = error?.response?.data?.message;

      if (status === 401) {
        window.alert('يجب تسجيل الدخول أولاً لإرسال الشكوى.');
      } else {
        window.alert(backendMessage || 'تعذر إرسال الشكوى الآن. حاول مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen theme-page overflow-hidden" dir="rtl">
        
        <main className="flex-grow pt-32 pb-20 relative">
          
          {/* الخلفيات المضيئة - ممتدة لمالي الشاشة */}
          <div className="fixed top-[-10%] left-[-10%] w-[800px] h-[800px] blur-[150px] pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
          <div className="fixed bottom-[-10%] right-[-10%] w-[700px] h-[700px] blur-[130px] pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />

          {/* الحاوية الرئيسية ممتدة (max-w-none أو max-w-7xl) */}
          <div className="max-w-[1400px] mx-auto px-4 md:px-12 relative z-10">
            
        

            {/* العنوان الرئيسي */}
            <header className="mb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center md:text-right"
              >
                <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-[2rem]">
                    <Globe className="text-blue-400" size={35} />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter theme-title">تواصل <span className="theme-primary">معنا</span></h1>
                </div>
                <p className="theme-text-muted text-xl font-medium max-w-2xl">نحن هنا لخدمتك، أرسل استفسارك وسيقوم فريقنا بالرد عليك في أسرع وقت.</p>
              </motion.div>
            </header>

            {/* القسم الممتد: يملأ الصفحة بعرض كبير */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* الكروت الجانبية - تأخذ مساحة أقل */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-4 space-y-6"
              >
                {[
                  { icon: <Phone size={24} />, label: "مركز الاتصال", value: "+20 123 456 789", desc: "متاحون على مدار الساعة" },
                  { icon: <Mail size={24} />, label: "الدعم الفني", value: "support@medicare.com", desc: "رد سريع خلال 24 ساعة" },
                  { icon: <MapPin size={24} />, label: "الموقع الرئيسي", value: "القاهرة، مدينة نصر", desc: "تفضل بزيارتنا في مقرنا" }
                ].map((item, idx) => (
                  <div key={idx} className="p-8 rounded-[2.5rem] theme-surface hover:border-blue-500/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full translate-x-10 -translate-y-10" />
                    <div className="flex items-start gap-5 relative z-10">
                      <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-500/70 mb-1">{item.label}</p>
                        <p className="text-xl font-black theme-title mb-1 tracking-tight">{item.value}</p>
                        <p className="text-xs theme-text-muted font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* الفورم الكبير - مالي باقي مساحة الصفحة */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-8 theme-surface p-10 md:p-16 rounded-[4rem] shadow-2xl backdrop-blur-sm relative overflow-hidden"
              >
                <AnimatePresence mode="wait">
                  {!isSubmitted ? (
                    <motion.form 
                      key="form"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="space-y-8" 
                      onSubmit={handleSubmit}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-sm font-bold theme-text-muted mr-2">الأسم الكامل</label>
                          <input 
                            placeholder="أدخل اسمك.." required
                            className="w-full theme-input p-6 rounded-[2rem] outline-none transition-all text-lg"
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-sm font-bold theme-text-muted mr-2">البريد الإلكتروني</label>
                          <input 
                            type="email" placeholder="example@mail.com" required
                            className="w-full theme-input p-6 rounded-[2rem] outline-none transition-all text-lg"
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold theme-text-muted mr-2">رسالتك التفصيلية</label>
                        <textarea 
                          rows="6" placeholder="اكتب استفسارك هنا بكل وضوح.." required
                          className="w-full theme-input p-6 rounded-[2rem] outline-none transition-all text-lg resize-none"
                          onChange={(e) => setFormData({...formData, message: e.target.value})}
                        />
                      </div>

                      <motion.button 
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isSubmitting}
                        className="w-full text-white py-6 rounded-[2rem] font-black text-2xl shadow-2xl transition-all flex items-center justify-center gap-4 mt-4"
                        style={{ background: 'linear-gradient(90deg, var(--app-primary), var(--app-accent))' }}
                      >
                        <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب الآن'}</span>
                        <Send size={26} className="rotate-180" />
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-20"
                    >
                      <div className="w-28 h-28 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <CheckCircle2 size={55} className="text-emerald-400" />
                      </div>
                      <h3 className="text-4xl font-black theme-title mb-4">تم استلام رسالتك!</h3>
                      <p className="theme-text-muted text-xl font-medium">فريق Medicare سيتواصل معك خلال الدقائق القادمة.</p>
                      <button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-10 theme-surface px-8 py-3 rounded-full transition-all text-sm font-bold"
                      >
                        إرسال رسالة أخرى
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}