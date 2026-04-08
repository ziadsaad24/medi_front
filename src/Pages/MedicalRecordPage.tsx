import React, { useState } from "react";
import { QrCode, Stethoscope, FileText, Camera, Paperclip, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FileUploader } from "../Components/medical/FileUploader";  
import { FileCard } from "../Components/medical/FileCard";
import { QRDialog } from "../Components/medical/QRDialog";
import { useMedicalRecords } from "../hooks/useMedicalRecords";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import ScrollToTop from "../Components/Layout/ScrollToTop"; // لا تنسي إضافة زر الصعود

export default function MedicalRecordPage() {
  const { files, notes, setNotes, addFile, removeFile, saveRecord } = useMedicalRecords();
  const [activeTab, setActiveTab] = useState("prescription");
  const [qrState, setQrState] = useState({ isOpen: false, url: "" });

  const tabs = [
    { id: "prescription", label: "روشتة", color: "bg-rose-500", icon: <Camera size={18} /> },
    { id: "xray", label: "أشعة", color: "bg-blue-500", icon: <Paperclip size={18} /> },
    { id: "pdf", label: "PDF", color: "bg-orange-500", icon: <FileText size={18} /> },
    { id: "notes", label: "ملاحظات", color: "bg-emerald-500", icon: <MessageSquare size={18} /> }
  ];

  const handleGenerate = () => {
    const id = saveRecord();
    setQrState({ isOpen: true, url: `${window.location.origin}/view/${id}` });
  };

  return (
    <div className="flex flex-col min-h-screen theme-page" >
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow relative overflow-x-hidden">
        
        {/* الخلفيات الديكورية - تم تعديل موقعها لتبدأ بعد الناف بار */}
        <div className="fixed top-20 right-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-a)' }} />
        <div className="fixed bottom-20 left-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-b)' }} />

        {/* الحل هنا: 
            pt-28 (Padding Top) لضمان نزول المحتوى تحت الناف بار 
            pb-44 لضمان عدم اختفاء المحتوى خلف زر "إنشاء السجل" الثابت
        */}
        <div className="relative z-10 px-4 pt-28 pb-44">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto space-y-12"
          >

            {/* Header Section */}
            <div className="text-center space-y-5">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="mx-auto w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-[2.5rem] theme-surface backdrop-blur-2xl shadow-2xl"
              >
                <Stethoscope size={40} className="text-blue-400" />
              </motion.div>
              
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight theme-title leading-tight">
                  سجلي الطبي <span className="text-blue-500">الذكي</span>
                </h1>
                <p className="theme-text-muted text-base md:text-lg max-w-md mx-auto">
                  ارفع مستنداتك الطبية الآن واحصل على كود QR يختصر تاريخك الصحي.
                </p>
              </div>
            </div>

            {/* Glass Container Card */}
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-[3rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
              
              <div className="relative theme-surface backdrop-blur-3xl rounded-[3rem] shadow-2xl overflow-hidden">
                
                {/* Tabs Selector */}
                <div className="flex p-2 gap-1 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--app-bg) 80%, black)' }}>
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex-1 py-4 rounded-[1.8rem] text-sm font-bold transition-all duration-500 flex flex-col items-center gap-1.5
                        ${activeTab === tab.id ? "text-white" : "theme-text-muted hover:text-slate-300 hover:bg-white/5"}
                      `}
                    >
                      {activeTab === tab.id && (
                        <motion.div 
                          layoutId="activeTabIndicator"
                          className={`absolute inset-0 rounded-[1.5rem] ${tab.color} shadow-lg shadow-black/20`}
                          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                        />
                      )}
                      <span className="relative z-10">{tab.icon}</span>
                      <span className="relative z-10 hidden md:block">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-6 md:p-10">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      {activeTab === "notes" ? (
                        <textarea
                          placeholder="اكتب ملاحظاتك الطبية هنا (الأدوية، الحساسية، تشخيص الطبيب...)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full min-h-[200px] p-6 rounded-[2rem] theme-input focus:ring-0 outline-none text-lg transition-all resize-none"
                        />
                      ) : (
                        <div className="rounded-[2.5rem] p-1 theme-surface">
                          <FileUploader
                            onUpload={(data) => addFile(data, activeTab)}
                            activeTab={activeTab}
                          />
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Displaying Uploaded Files */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div 
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <FileCard file={file} onRemove={removeFile} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Floating Action Button (Fixed) */}
        <div className="fixed bottom-10 left-0 right-0 px-6 max-w-2xl mx-auto z-[60]">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={files.length === 0 && !notes}
            onClick={handleGenerate}
            className="w-full h-16 md:h-20 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-lg md:text-xl font-black shadow-[0_20px_50px_rgba(37,99,235,0.3)] flex items-center justify-center gap-4 transition-all disabled:opacity-30 disabled:grayscale"
          >
            <div className="bg-white/20 p-2 rounded-xl">
              <QrCode size={24} />
            </div>
            إنشاء السجل الرقمي
          </motion.button>
        </div>

        <ScrollToTop />
      </main>

      <Footer />
      
      <QRDialog
        isOpen={qrState.isOpen}
        onClose={setQrState}
        url={qrState.url}
      />
    </div>
  );
}