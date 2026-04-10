import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import { useAuth } from '../context/AuthContext';
import '../Styles/Signup.css';

const SignupPatient = () => {
  const navigate = useNavigate();
  const { registerPatient, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // إزالة الأخطاء عند الكتابة
    setError('');
    setFieldErrors({});
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
    
    try {
      const result = await registerPatient({
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });
      
      if (result.success) {
        // التحقق من حاجة المستخدم لتفعيل الإيميل
        if (result.needsEmailVerification) {
          navigate('/pending-verification');
        } else {
          // المريض تم تفعيله تلقائياً، توجيه للصفحة الرئيسية
          navigate('/patient/home');
        }
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
      {/* الهيدر مع تحديد دور المريض (لون التيل) */}

    <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
      className="signup-card signup-card-wide"
  dir="rtl"
>
  <div className="text-center mb-10">
    <div className="inline-flex p-4 rounded-full bg-teal-50 mb-4">
       <Heart size={32} strokeWidth={2.5} className="text-[#00BBA7]" />
    </div>
    <h2 className="signup-title text-3xl">إنشاء حساب مريض</h2>
    <p className="signup-subtitle text-base">ابدأ رحلتك نحو رعاية صحية أفضل وأسهل</p>
  </div>

  <form className="signup-form" onSubmit={handleSubmit}>
    {/* عرض رسالة الخطأ العامة */}
    {error && (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm text-center">
        {error}
      </div>
    )}
    
    {/* استخدمنا grid هنا عشان الحقول تتقسم اتنين جنب بعض في الشاشات الكبيرة */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="input-group">
        <User className="input-icon" size={22} strokeWidth={2.5} />
        <input 
          name="fullName" 
          placeholder="الاسم الكامل" 
          value={formData.fullName}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        {fieldErrors.name && (
          <span className="text-red-500 text-xs mt-1 block">{fieldErrors.name[0]}</span>
        )}
      </div>

      <div className="input-group">
        <Mail className="input-icon" size={22} strokeWidth={2.5} />
        <input 
          name="email" 
          type="email" 
          placeholder="البريد الإلكتروني" 
          value={formData.email}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        {fieldErrors.email && (
          <span className="text-red-500 text-xs mt-1 block">{fieldErrors.email[0]}</span>
        )}
      </div>

      <div className="input-group">
        <Phone className="input-icon" size={22} strokeWidth={2.5} />
        <input 
          name="phone" 
          placeholder="رقم الهاتف" 
          value={formData.phone}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        {fieldErrors.phone && (
          <span className="text-red-500 text-xs mt-1 block">{fieldErrors.phone[0]}</span>
        )}
      </div>

      {/* حقل وهمي للموازنة أو خليهم تحت بعض لو مش محتاجة حقول زيادة */}
      <div className="input-group">
        <Lock className="input-icon" size={22} strokeWidth={2.5} />
        <input 
          name="password" 
          type="password" 
          placeholder="كلمة المرور (8 أحرف على الأقل)" 
          value={formData.password}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
        {fieldErrors.password && (
          <span className="text-red-500 text-xs mt-1 block">{fieldErrors.password[0]}</span>
        )}
      </div>

      <div className="input-group md:col-span-2"> {/* تأكيد كلمة المرور واخد العرض كله */}
        <ShieldCheck className="input-icon" size={22} strokeWidth={2.5} />
        <input 
          name="confirmPassword" 
          type="password" 
          placeholder="تأكيد كلمة المرور" 
          value={formData.confirmPassword}
          onChange={handleChange} 
          disabled={loading}
          required 
        />
      </div>
    </div>

    <button 
      type="submit" 
      disabled={loading}
      className="submit-btn !mt-8 py-5 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>جارٍ التسجيل...</span>
        </>
      ) : (
        <>
          <span>إنشاء الحساب</span>
          <ArrowLeft size={24} strokeWidth={2.5} />
        </>
      )}
    </button>
  </form>
</motion.div>
    </div>
  );
};

export default SignupPatient;