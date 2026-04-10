import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Stethoscope, Lock, 
  UploadCloud, FileCheck, ShieldCheck, ArrowLeft 
} from 'lucide-react'; // الأيقونات الجديدة
import HeaderLogo from '../Components/HeaderLogo';
import { useAuth } from '../context/AuthContext';
import '../Styles/Signup.css'; // سنستخدم نفس ملف الاستايلات مع إضافات بسيطة

const SignupDoctor = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { registerDoctor, loading } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    specialization: '',
    password: '',
    confirmPassword: '',
    licenseFile: null
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // إزالة الأخطاء عند الكتابة
    setError('');
    setFieldErrors({});
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف يتجاوز 10 ميجابايت');
        return;
      }
      if (file.type !== 'application/pdf') {
        setError('يجب أن يكون الملف بصيغة PDF');
        return;
      }
      setFormData(prev => ({ ...prev, licenseFile: file }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    
    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة!');
      return;
    }
    
    // التحقق من طول كلمة المرور
    if (formData.password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    
    // التحقق من وجود ملف الترخيص
    if (!formData.licenseFile) {
      setError('يرجى رفع ملف الترخيص الطبي');
      return;
    }
    
    try {
      // إنشاء FormData لإرسال الملفات
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.fullName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('specialization', formData.specialization);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.confirmPassword);
      formDataToSend.append('role', 'doctor');
      formDataToSend.append('license_file', formData.licenseFile);
      
      const result = await registerDoctor(formDataToSend);
      
      if (result.success) {
        // الطبيب يحتاج موافقة، وجهه لصفحة النجاح
        navigate('/success');
      } else {
        // عرض الأخطاء
        if (result.errors) {
          setFieldErrors(result.errors);
        }
        setError(result.message || 'حدث خطأ في التسجيل');
      }
    } catch (err) {
      setError('حدث خطأ غير متوقع. حاول مرة أخرى.');
    }
  };

  return (
    <div className="signup-container">
      {/* الهيدر مع تحديد دور الطبيب للإطار */}

      <div className="signup-card signup-card-wide" dir="rtl">
        <div className="text-center mb-8">
          <h2 className="signup-title">إنشاء حساب طبيب</h2>
          <p className="signup-subtitle">انضم إلى نخبة أطباء MediCare</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {/* عرض رسالة الخطأ العامة */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* الاسم الكامل */}
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="الاسم الكامل" 
              />
              {fieldErrors.name && (
                <span className="text-red-500 text-xs mt-1 block">{fieldErrors.name[0]}</span>
              )}
            </div>

            {/* البريد الإلكتروني */}
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="البريد الإلكتروني" 
              />
              {fieldErrors.email && (
                <span className="text-red-500 text-xs mt-1 block">{fieldErrors.email[0]}</span>
              )}
            </div>

            {/* رقم الهاتف */}
            <div className="input-group">
              <Phone className="input-icon" size={20} />
              <input 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="رقم الهاتف" 
              />
              {fieldErrors.phone && (
                <span className="text-red-500 text-xs mt-1 block">{fieldErrors.phone[0]}</span>
              )}
            </div>

            {/* التخصص */}
            <div className="input-group">
              <Stethoscope className="input-icon" size={20} />
              <input 
                name="specialization" 
                value={formData.specialization} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="التخصص الطبي" 
              />
              {fieldErrors.specialization && (
                <span className="text-red-500 text-xs mt-1 block">{fieldErrors.specialization[0]}</span>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="كلمة المرور (8 أحرف على الأقل)" 
              />
              {fieldErrors.password && (
                <span className="text-red-500 text-xs mt-1 block">{fieldErrors.password[0]}</span>
              )}
            </div>

            {/* تأكيد كلمة المرور */}
            <div className="input-group">
              <ShieldCheck className="input-icon" size={20} />
              <input 
                name="confirmPassword" 
                type="password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                disabled={loading}
                required 
                placeholder="تأكيد كلمة المرور" 
              />
            </div>
          </div>

          {/* رفع الملفات بتصميم جديد */}
          <div className="file-upload-section">
            <label className="block text-sm font-bold text-[#004060] mb-3 mr-1">مستندات الترخيص الطبي (PDF) *</label>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              disabled={loading}
              className="hidden" 
            />
            
            <div 
              onClick={() => !loading && fileInputRef.current.click()} 
              className={`file-drop-zone ${formData.licenseFile ? 'file-active' : ''} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {formData.licenseFile ? (
                <div className="flex flex-col items-center">
                  <FileCheck size={40} color="#008080" />
                  <p className="file-name">{formData.licenseFile.name}</p>
                  <span className="text-xs text-gray-400">تم اختيار الملف بنجاح</span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <UploadCloud size={40} color="#0F427D" opacity={0.5} />
                  <p className="upload-text">اضغط هنا لرفع ملف الترخيص</p>
                  <span className="text-xs text-gray-400">PDF (الحد الأقصى 10 ميجابايت)</span>
                </div>
              )}
            </div>
            {fieldErrors.license_file && (
              <span className="text-red-500 text-xs mt-1 block">{fieldErrors.license_file[0]}</span>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>جارٍ الإرسال...</span>
              </>
            ) : (
              <>
                <span>إرسال طلب الانضمام</span>
                <ArrowLeft size={20} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupDoctor;