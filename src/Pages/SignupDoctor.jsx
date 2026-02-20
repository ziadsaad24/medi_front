import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, Stethoscope, Lock, 
  UploadCloud, FileCheck, ShieldCheck, ArrowLeft 
} from 'lucide-react'; // الأيقونات الجديدة
import HeaderLogo from '../Components/HeaderLogo';
import '../Styles/Signup.css'; // سنستخدم نفس ملف الاستايلات مع إضافات بسيطة

const SignupDoctor = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('حجم الملف يتجاوز 10 ميجابايت');
        return;
      }
      setFormData(prev => ({ ...prev, licenseFile: file }));
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة!');
      return;
    }
    console.log("إرسال بيانات الطبيب:", formData);
    navigate('/success');
  };

  return (
    <div className="signup-container">
      {/* الهيدر مع تحديد دور الطبيب للإطار */}

      <div className="signup-card max-w-2xl" dir="rtl">
        <div className="text-center mb-8">
          <h2 className="signup-title">إنشاء حساب طبيب</h2>
          <p className="signup-subtitle">انضم إلى نخبة أطباء MediCare</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* الاسم الكامل */}
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input name="fullName" value={formData.fullName} onChange={handleChange} required placeholder="الاسم الكامل" />
            </div>

            {/* البريد الإلكتروني */}
            <div className="input-group">
              <Mail className="input-icon" size={20} />
              <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="البريد الإلكتروني" />
            </div>

            {/* رقم الهاتف */}
            <div className="input-group">
              <Phone className="input-icon" size={20} />
              <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="رقم الهاتف" />
            </div>

            {/* التخصص */}
            <div className="input-group">
              <Stethoscope className="input-icon" size={20} />
              <input name="specialization" value={formData.specialization} onChange={handleChange} required placeholder="التخصص الطبي" />
            </div>

            {/* كلمة المرور */}
            <div className="input-group">
              <Lock className="input-icon" size={20} />
              <input name="password" type="password" value={formData.password} onChange={handleChange} required placeholder="كلمة المرور" />
            </div>

            {/* تأكيد كلمة المرور */}
            <div className="input-group">
              <ShieldCheck className="input-icon" size={20} />
              <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required placeholder="تأكيد كلمة المرور" />
            </div>
          </div>

          {/* رفع الملفات بتصميم جديد */}
          <div className="file-upload-section">
            <label className="block text-sm font-bold text-[#004060] mb-3 mr-1">مستندات الترخيص الطبي (PDF)</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
            
            <div 
              onClick={() => fileInputRef.current.click()} 
              className={`file-drop-zone ${formData.licenseFile ? 'file-active' : ''}`}
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
          </div>

          {error && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}} className="error-message">
              {error}
            </motion.p>
          )}

          <button type="submit" className="submit-btn mt-4">
            <span>إرسال طلب الانضمام</span>
            <ArrowLeft size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupDoctor;