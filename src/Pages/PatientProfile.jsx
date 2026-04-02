import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Edit2, Save, X, FileText, Download, Droplet, AlertCircle, Shield, RotateCcw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../Components/Layout/Navbar';
import Footer from '../Components/Layout/Footer';
import EmergencyCard3D from '../Components/EmergencyCard3D';
import { patientAPI } from '../services/api';

const PatientProfile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showMedicalCard, setShowMedicalCard] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);
  const cardFrontRef = useRef(null);
  const cardBackRef = useRef(null);

  // بيانات افتراضية للتجربة إذا لم يكن هناك مستخدم
  const defaultUser = {
    name: 'أحمد محمد علي',
    email: 'ahmed@example.com',
    phone: '01012345678',
    id: '12345'
  };

  const currentUser = user || defaultUser;

  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    birthDate: currentUser?.birth_date || '1995-05-15',
    address: currentUser?.address || 'القاهرة، مصر',
    bloodType: currentUser?.blood_type || 'A+',
    emergencyContact: currentUser?.emergency_contact || '01098765432',
    emergencyName: currentUser?.emergency_name || 'محمد علي (الأخ)',
    allergies: currentUser?.allergies || 'حساسية من البنسلين',
    chronicDiseases: currentUser?.chronic_diseases || '',
    height: currentUser?.height || '175',
    weight: currentUser?.weight || '75',
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const response = await patientAPI.getProfile();
        const profile = response?.data || response?.profile || response;

        if (profile) {
          setFormData((prev) => ({
            ...prev,
            name: profile.name ?? prev.name,
            email: profile.email ?? prev.email,
            phone: profile.phone ?? prev.phone,
            birthDate: profile.birth_date ?? prev.birthDate,
            address: profile.address ?? prev.address,
            bloodType: profile.blood_type ?? prev.bloodType,
            emergencyContact: profile.emergency_contact ?? prev.emergencyContact,
            emergencyName: profile.emergency_name ?? prev.emergencyName,
            allergies: profile.allergies ?? prev.allergies,
            chronicDiseases: profile.chronic_diseases ?? prev.chronicDiseases,
            height: profile.height ?? prev.height,
            weight: profile.weight ?? prev.weight,
          }));
        }
      } catch (error) {
        console.warn('Unable to load patient profile from API, using local state:', error);
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
      birthDate: currentUser?.birth_date || '1995-05-15',
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
    name: formData.name || currentUser?.name || 'اسم المريض',
    id: currentUser?.id || '12345',
    age: `${calculateAge()} سنة`,
    bloodType: formData.bloodType || 'A+',
    height: `${formData.height || '175'} سم`,
    weight: `${formData.weight || '75'} كجم`,
    allergies: formData.allergies || 'لا يوجد',
    qrValue: `https://medicare.com/patient/${currentUser?.id || 'unknown'}`,
    emergencyContact: {
      name: formData.emergencyName || 'جهة اتصال الطوارئ',
      phone: formData.emergencyContact || formData.phone || '---'
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 pt-28 pb-20 px-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          
          {/* Header with Generate Card Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-black text-[#0F427D] mb-2">الملف الشخصي</h1>
            <p className="text-gray-500 mb-6">معلوماتك الشخصية والطبية</p>
            
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
              className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8"
            >
              {/* Edit Buttons */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-[#004060]">المعلومات الشخصية</h2>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#0F427D] rounded-xl font-bold hover:bg-blue-100 transition-all"
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
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <User size={16} className="text-[#008080]" />
                    الاسم الكامل
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                      isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* البريد الإلكتروني */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Mail size={16} className="text-[#008080]" />
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                      isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* رقم الهاتف */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Phone size={16} className="text-[#008080]" />
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                      isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* تاريخ الميلاد */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <Calendar size={16} className="text-[#008080]" />
                    تاريخ الميلاد
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                      isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* العنوان */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                    <MapPin size={16} className="text-[#008080]" />
                    العنوان
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                      isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                    }`}
                  />
                </div>
              </div>

              {/* Medical Information Section */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-black text-[#004060] mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-[#008080]" />
                  المعلومات الطبية
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* فصيلة الدم */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Droplet size={16} className="text-red-500" />
                      فصيلة الدم
                    </label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
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
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* الوزن */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* اسم جهة الاتصال للطوارئ */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* رقم الطوارئ */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* الحساسية */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all resize-none ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
                    />
                  </div>

                  {/* الأمراض المزمنة */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-600">
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
                      className={`w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 outline-none transition-all resize-none ${
                        isEditing ? 'focus:border-[#0F427D] focus:ring-2 focus:ring-blue-100' : 'cursor-not-allowed'
                      }`}
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
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar size={28} className="text-[#0F427D]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">المواعيد</h3>
                <p className="text-3xl font-black text-[#0F427D]">12</p>
                <p className="text-sm text-gray-500 mt-1">موعد قادم</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-[#008080]" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">الأطباء</h3>
                <p className="text-3xl font-black text-[#008080]">5</p>
                <p className="text-sm text-gray-500 mt-1">طبيب متابع</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={28} className="text-green-600" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">الرسائل</h3>
                <p className="text-3xl font-black text-green-600">8</p>
                <p className="text-sm text-gray-500 mt-1">رسالة جديدة</p>
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
              className="bg-white rounded-3xl shadow-2xl max-w-[1120px] w-[95vw] max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-3xl z-10">
                <h2 className="text-2xl font-black text-[#0F427D]">البطاقة الطبية</h2>
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
                <div className="flex items-center gap-2 text-gray-600">
                  <RotateCcw size={18} className="animate-spin" style={{ animationDuration: '3s' }} />
                  <p className="text-sm">اضغط على زر التقليب لرؤية الوجه الآخر من البطاقة</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="px-8 pb-8">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-700 text-center">
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
