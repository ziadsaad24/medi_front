import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, FileText, Download, Droplet, AlertCircle, Shield, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import EmergencyCard3D from '../Components/EmergencyCard3D';
import { patientAPI } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [showMedicalCard, setShowMedicalCard] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [medicalCardId, setMedicalCardId] = useState(user?.medical_card_id || '');
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);

  const currentUser = user || {};

  const getDisplayValue = (value, fallback = '--') => {
    return value ? value : fallback;
  };

  const getContactValue = (value) => {
    return value ? value : 'لا يوجد';
  };

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    birthDate: currentUser?.birth_date || '',
    address: currentUser?.address || '',
    bloodType: currentUser?.blood_type || '',
    emergencyContact: currentUser?.emergency_contact || '',
    emergencyName: currentUser?.emergency_name || '',
    allergies: currentUser?.allergies || '',
    chronicDiseases: currentUser?.chronic_diseases || '',
    height: currentUser?.height || '',
    weight: currentUser?.weight || '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const response = await patientAPI.getProfile();
        const profile = response?.data || response?.profile || response;

        // التحقق من أن البيانات موجودة وليست فارغة
        if (profile && Object.keys(profile).length > 0) {
          const hasApiData = profile.name || profile.email || profile.phone || profile.birth_date || profile.blood_type;
          
          if (hasApiData) {
            console.log('Loading profile from API:', profile);
            setMedicalCardId(profile.medical_card_id || user?.medical_card_id || '');
            setFormData({
              name: profile.name || '',
              email: profile.email || '',
              phone: profile.phone || '',
              birthDate: profile.birth_date || '',
              address: profile.address || '',
              bloodType: profile.blood_type || '',
              emergencyContact: profile.emergency_contact || '',
              emergencyName: profile.emergency_name || '',
              allergies: profile.allergies || '',
              chronicDiseases: profile.chronic_diseases || '',
              height: profile.height || '',
              weight: profile.weight || '',
            });
            return;
          }
        }
      } catch (error) {
        console.warn('Unable to load patient profile from API:', error);
      }
    };

    loadProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await patientAPI.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birth_date: formData.birthDate,
        address: formData.address,
        blood_type: formData.bloodType,
        emergency_contact: formData.emergencyContact,
        emergency_name: formData.emergencyName,
        allergies: formData.allergies,
        chronic_diseases: formData.chronicDiseases,
        height: formData.height,
        weight: formData.weight,
      });

      const profile = response?.data || response?.profile || response;

      if (updateUser) {
        updateUser({
          ...currentUser,
          medical_card_id: profile?.medical_card_id ?? medicalCardId,
          name: profile?.name ?? formData.name,
          email: profile?.email ?? formData.email,
          phone: profile?.phone ?? formData.phone,
        });
      }

      setFormData((prev) => ({
        ...prev,
        ...formData,
      }));
    } catch (error) {
      console.warn('Unable to save patient profile to API, updating local state only:', error);

      if (updateUser) {
        updateUser({ ...currentUser, ...formData });
      }
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      birthDate: currentUser?.birth_date || '',
      address: currentUser?.address || '',
      bloodType: currentUser?.blood_type || '',
      emergencyContact: currentUser?.emergency_contact || '',
      emergencyName: currentUser?.emergency_name || '',
      allergies: currentUser?.allergies || '',
      chronicDiseases: currentUser?.chronic_diseases || '',
      height: currentUser?.height || '',
      weight: currentUser?.weight || '',
    });
    setIsEditing(false);
  };

  // حساب العمر من تاريخ الميلاد
  const calculateAge = () => {
    const birthDate = formData.birthDate;
    if (!birthDate) return '--';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // تحميل البطاقة الطبية كصورة
  const handleDownloadCard = async () => {
    window.print();
  };

  const patientCardData = {
    name: formData.name || currentUser?.name || '--',
    medical_card_id: medicalCardId || currentUser?.medical_card_id || '--',
    age: calculateAge() === '--' ? '--' : `${calculateAge()} سنة`,
    bloodType: getDisplayValue(formData.bloodType),
    height: formData.height ? `${formData.height} سم` : '--',
    weight: formData.weight ? `${formData.weight} كجم` : '--',
    allergies: getContactValue(formData.allergies),
    qrValue: `https://medicare.com/patient/${currentUser?.id || 'unknown'}`,
    emergencyContact: {
      name: getContactValue(formData.emergencyName),
      phone: getContactValue(formData.emergencyContact)
    }
  };

  const fieldLabelClass = `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-slate-300' : 'text-gray-600'}`;
  const fieldClass = `w-full px-4 py-3 border rounded-xl outline-none transition-all ${
    isDark
      ? 'border-slate-700 bg-slate-900/70 text-slate-100 placeholder:text-slate-400'
      : 'border-gray-200 bg-gray-50 text-gray-900 placeholder:text-gray-400'
  } ${isEditing ? (isDark ? 'focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20' : 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100') : 'cursor-not-allowed opacity-80'}`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen theme-page pt-28 pb-20 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Generate Card Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black theme-title mb-2">الملف الشخصي</h1>
            <p className="theme-text-muted mb-6">معلوماتك الشخصية والطبية</p>
            
            <button
              onClick={() => setShowMedicalCard(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0F427D] to-[#008080] text-white rounded-2xl font-bold hover:brightness-110 transition-all shadow-lg"
            >
              <FileText size={20} />
              إنشاء البطاقة الطبية
            </button>
          </motion.div>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Main Profile Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 theme-card rounded-3xl shadow-xl p-8"
            >
              {/* Edit Buttons */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black theme-title">المعلومات الشخصية</h2>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all ${isDark ? 'bg-slate-800 text-cyan-300 hover:bg-slate-700' : 'bg-blue-50 text-[#0F427D] hover:bg-blue-100'}`}
                  >
                    <Edit2 size={18} />
                    تعديل
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                    >
                      <Save size={18} />
                      حفظ
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                    >
                      <X size={18} />
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* الاسم */}
                <div className="space-y-2">
                  <label className={fieldLabelClass}>
                    <User size={16} className="text-[#008080]" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-2">
                  <label className={fieldLabelClass}>
                    <Mail size={16} className="text-[#008080]" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                  />
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-2">
                  <label className={fieldLabelClass}>
                    <Phone size={16} className="text-[#008080]" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                  />
                </div>

                {/* تاريخ الميلاد */}
                <div className="space-y-2">
                  <label className={fieldLabelClass}>
                    <Calendar size={16} className="text-[#008080]" />
                    تاريخ الميلاد
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                  />
                </div>

                {/* العنوان */}
                <div className="md:col-span-2 space-y-2">
                  <label className={fieldLabelClass}>
                    <MapPin size={16} className="text-[#008080]" />
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={fieldClass}
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className={`mt-8 pt-8 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                <h3 className="text-xl font-black theme-title mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-[#008080]" />
                  المعلومات الطبية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* فصيلة الدم */}
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>
                      <Droplet size={16} className="text-red-500" />
                      فصيلة الدم
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={fieldClass}
                    >
                      <option value="">اختر فصيلة الدم</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  {/* الطول */}
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>
                      <User size={16} className="text-[#008080]" />
                      الطول (سم)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="175"
                      className={fieldClass}
                    />
                  </div>

                  {/* الوزن */}
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>
                      <User size={16} className="text-[#008080]" />
                      الوزن (كجم)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="70"
                      className={fieldClass}
                    />
                  </div>

                  {/* اسم جهة الاتصال للطوارئ */}
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>
                      <User size={16} className="text-orange-500" />
                      اسم جهة الاتصال للطوارئ
                    </label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="محمد أحمد (الأخ)"
                      className={fieldClass}
                    />
                  </div>

                  {/* رقم الطوارئ */}
                  <div className="space-y-2">
                    <label className={fieldLabelClass}>
                      <Phone size={16} className="text-orange-500" />
                      رقم الطوارئ
                    </label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="01012345678"
                      className={fieldClass}
                    />
                  </div>

                  {/* الحساسية */}
                  <div className="md:col-span-2 space-y-2">
                    <label className={fieldLabelClass}>
                      <AlertCircle size={16} className="text-red-500" />
                      الحساسية (إن وجدت)
                    </label>
                    <textarea
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="2"
                      placeholder="مثال: حساسية من البنسلين، حساسية من الفول السوداني"
                      className={`${fieldClass} resize-none`}
                    />
                  </div>

                  {/* الأمراض المزمنة */}
                  <div className="md:col-span-2 space-y-2">
                    <label className={fieldLabelClass}>
                      <FileText size={16} className="text-[#008080]" />
                      الأمراض المزمنة (إن وجدت)
                    </label>
                    <textarea
                      name="chronicDiseases"
                      value={formData.chronicDiseases}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="2"
                      placeholder="مثال: ضغط الدم، السكري"
                      className={`${fieldClass} resize-none`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                  <Calendar size={28} className="text-[#0F427D]" />
                </div>
                <h3 className={`font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>المواعيد</h3>
                <p className="text-3xl font-black text-[#0F427D]">12</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>موعد قادم</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-teal-500/20' : 'bg-teal-100'}`}>
                  <User size={28} className="text-[#008080]" />
                </div>
                <h3 className={`font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>الأطباء</h3>
                <p className="text-3xl font-black text-[#008080]">5</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>طبيب متابع</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className={`rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow ${isDark ? 'bg-slate-900/80 border border-slate-700' : 'bg-white'}`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                  <Mail size={28} className="text-green-600" />
                </div>
                <h3 className={`font-bold mb-1 ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>الرسائل</h3>
                <p className="text-3xl font-black text-green-600">8</p>
                <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>رسالة جديدة</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Card Modal */}
      <AnimatePresence>
        {showMedicalCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[300] flex items-center justify-center p-3 md:p-4"
            onClick={() => setShowMedicalCard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`rounded-3xl shadow-2xl max-w-[1120px] w-[95vw] max-h-[85vh] overflow-y-auto ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white'}`}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 p-6 flex justify-between items-center rounded-t-3xl z-10 ${isDark ? 'bg-slate-900 border-b border-slate-700' : 'bg-white border-b border-gray-200'}`}>
                <h2 className="text-2xl font-black theme-title">البطاقة الطبية</h2>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadCard}
                    className="flex items-center gap-2 px-4 py-2 bg-[#008080] text-white rounded-xl font-bold hover:brightness-110 transition-all"
                  >
                    <Download size={18} />
                    تحميل
                  </button>
                  <button
                    onClick={() => setShowMedicalCard(false)}
                    className="w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* 3D Emergency Medical Card */}
              <div className="p-5 md:p-6 flex flex-col items-center gap-4">
                <div className="w-full max-w-[980px]">
                <EmergencyCard3D 
                  patientData={patientCardData}
                  cardFrontRef={cardFrontRef}
                  cardBackRef={cardBackRef}
                  isFlipped={cardFlipped}
                  onFlip={() => setCardFlipped(!cardFlipped)}
                />
                </div>
                
                {/* Flip Hint */}
                <div className={`flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  <RotateCcw size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
                  <p className="text-sm">اضغط على زر التقليب لرؤية الوجه الآخر من البطاقة</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="px-8 pb-8">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-500/10 border border-blue-400/20' : 'bg-blue-50 border border-blue-200'}`}>
                  <p className={`text-sm text-center ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>
                    <strong className="text-[#0F427D]">💡 نصيحة:</strong> عند الضغط على زر التحميل ستفتح نافذة الطباعة بترتيب مناسب: الوجه الأمامي بالأعلى والوجه الخلفي بالأسفل
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="print-card-sheet" aria-hidden="true">
        <div className="print-card-copy">
          <EmergencyCard3D patientData={patientCardData} hideFlipButton staticSide="front" />
        </div>
        <div className="print-card-copy">
          <EmergencyCard3D patientData={patientCardData} hideFlipButton staticSide="back" />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default PatientProfile;
