import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Navbar from "./Layout/Navbar";
import Footer from "./Layout/Footer";
import { useTheme } from "../context/ThemeContext";


/* ================= Helpers ================= */

const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  return (
    <img
      src={error ? "https://via.placeholder.com/900x700" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

const sectionAnim = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: "easeOut" },
  },
};

const Counter = ({ end, suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let current = 0;
    const step = end / 100;

    const timer = setInterval(() => {
      current += step;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/* ================= PAGE ================= */

export default function App() {
  const { isDark } = useTheme();

  const features = [
    {
      title: "السجل الطبي الإلكتروني",
      desc: "كل بياناتك الطبية في مكان واحد آمن.",
      icon: "https://cdn.lordicon.com/wloilxuq.json",
    },
    {
      title: "حجز المواعيد",
      desc: "احجزي موعدك بسهولة مع أفضل الأطباء.",
      icon: "https://cdn.lordicon.com/abfverha.json",
    },
    {
      title: "أطباء متخصصون",
      desc: "شبكة واسعة من الخبراء المعتمدين.",
      icon: "https://cdn.lordicon.com/kthelypq.json",
    },
    {
      title: "تذكير بالأدوية",
      desc: "تنبيهات ذكية في الوقت المناسب.",
      icon: "https://cdn.lordicon.com/psnhyobz.json",
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="theme-page font-sans" dir="rtl">

      {/* ================= HERO ================= */}
      <section className="relative min-h-[90vh] flex items-center" style={{ background: 'var(--hero-about-bg)' }}>
        <div className="absolute top-0 left-0 w-[420px] h-[420px] rounded-full blur-[120px] opacity-60 pointer-events-none" style={{ background: 'var(--app-glow-a)' }} />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-[120px] opacity-60 pointer-events-none" style={{ background: 'var(--app-glow-b)' }} />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-6 text-right"
          >
            <h1 className="text-5xl lg:text-6xl font-black text-white leading-tight">
              رعاية صحية <span className={isDark ? 'theme-primary' : 'text-teal-400'}>ذكية</span><br />
              تليق بك
            </h1>

            <p className="text-blue-100/80 text-lg max-w-xl">
              منصة متكاملة لإدارة صحتك، سجلاتك، ومواعيدك بسهولة وأمان.
            </p>

            <button
              className={`
                px-12 py-4
                rounded-2xl
                font-black
                text-white
                shadow-xl
                flex items-center gap-2
                transition-all duration-300 hover:brightness-110
                ${!isDark ? 'animate-gradient bg-gradient-to-r from-teal-400 via-[#00bfa6] to-teal-400' : ''}
              `}
              style={isDark ? { backgroundColor: 'var(--app-primary)' } : undefined}
            >
              ابدئي رحلتك الآن <ArrowRight size={20} />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200"
              alt="Healthcare"
              className="rounded-[2.5rem] shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="-mt-20 px-6 relative z-10"
      >
        <div className="max-w-6xl mx-auto theme-card rounded-[3rem] shadow-2xl p-10 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-teal-600">
              <Counter end={12000} suffix="+" />
            </div>
            <p className="theme-text-muted font-bold">مريض</p>
          </div>

          <div>
            <div className="text-4xl font-black text-blue-700">
              <Counter end={550} suffix="+" />
            </div>
            <p className="theme-text-muted font-bold">طبيب</p>
          </div>

          <div>
            <div className="text-4xl font-black text-teal-600">
              <Counter end={52000} suffix="+" />
            </div>
            <p className="theme-text-muted font-bold">موعد</p>
          </div>

          <div>
            <div className="text-4xl font-black text-blue-700">24/7</div>
            <p className="theme-text-muted font-bold">دعم</p>
          </div>
        </div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="py-24 px-6"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #06142f 0%, #081a39 55%, #051227 100%)'
            : 'color-mix(in srgb, var(--app-bg) 86%, white)'
        }}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className={`group relative p-10 rounded-[2.5rem] shadow-md overflow-hidden ${isDark ? 'bg-slate-900/80 border border-slate-700/60 hover:border-cyan-400/35' : 'theme-card'}`}
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${isDark ? 'bg-gradient-to-r from-[#0b2a4d] to-[#0a4f66]' : 'bg-gradient-to-r from-[#004060] to-[#008080]'}`} />

              <div className={`relative z-10 flex gap-6 items-start group-hover:text-white transition-colors ${isDark ? 'text-cyan-200' : 'theme-primary'}`}>
                <lord-icon
                  src={f.icon}
                  trigger="loop"
                  colors={isDark ? 'primary:#67e8f9' : 'primary:#004060'}
                  style={{ width: 56, height: 56 }}
                />
                <div>
                  <h3 className="text-xl font-black">{f.title}</h3>
                  <p className={`mt-2 opacity-80 ${isDark ? 'text-slate-300 group-hover:text-white' : ''}`}>{f.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        variants={sectionAnim}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="relative py-32 px-6 overflow-hidden"
        style={{
          background: isDark
            ? 'linear-gradient(180deg, #071a35 0%, #051226 100%)'
            : 'linear-gradient(to bottom, color-mix(in srgb, var(--app-bg) 85%, white), var(--app-surface))'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <lord-icon
            src="https://cdn.lordicon.com/egiwmiit.json"
            trigger="loop"
            colors="primary:#0f766e"
            style={{ width: 620, height: 620, opacity: 0.15 }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto rounded-[3rem] bg-[#004060]/80 backdrop-blur-2xl border border-white/20 p-16 text-center shadow-[0_40px_90px_rgba(0,64,96,0.45)]">
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            ابدئي رحلتك الصحية اليوم
          </h2>

          <p className="mt-6 text-lg text-blue-100/80">
            منصة واحدة، كل احتياجاتك الصحية في مكان آمن وسهل.
          </p>

          <button
            className={`mt-10 px-16 py-5 rounded-2xl font-black text-white shadow-xl transition-all duration-300 hover:brightness-110 ${!isDark ? 'bg-gradient-to-r from-teal-400 via-[#00bfa6] to-teal-400 animate-gradient' : ''}`}
            style={isDark ? { backgroundColor: 'var(--app-primary)' } : undefined}
          >
            سجلي الآن مجانًا
          </button>
        </div>
      </motion.section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 text-center border-t">
        <p className="theme-text-muted font-bold text-sm">
          © 2026 MediCare Health System
        </p>
      </footer>
    </div>
    <Footer/>
    </>
  );
}