import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, ShieldCheck, ArrowLeft, Heart } from 'lucide-react';
import HeaderLogo from '../Components/HeaderLogo';
import '../Styles/Signup.css';

const SignupPatient = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة!');
      return;
    }
    console.log("إرسال بيانات المريض:", formData);
    navigate('/success');
  };

  return (
    <div className="signup-container">
      {/* الهيدر مع تحديد دور المريض (لون التيل) */}

    <motion.div 
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="signup-card max-w-3xl" // كبرنا العرض هنا لـ 3xl (حوالي 768px)
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
    {/* استخدمنا grid هنا عشان الحقول تتقسم اتنين جنب بعض في الشاشات الكبيرة */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
      <div className="input-group">
        <User className="input-icon" size={22} strokeWidth={2.5} />
        <input name="fullName" placeholder="الاسم الكامل" onChange={handleChange} required />
      </div>

      <div className="input-group">
        <Mail className="input-icon" size={22} strokeWidth={2.5} />
        <input name="email" type="email" placeholder="البريد الإلكتروني" onChange={handleChange} required />
      </div>

      <div className="input-group">
        <Phone className="input-icon" size={22} strokeWidth={2.5} />
        <input name="phone" placeholder="رقم الهاتف" onChange={handleChange} required />
      </div>

      {/* حقل وهمي للموازنة أو خليهم تحت بعض لو مش محتاجة حقول زيادة */}
      <div className="input-group">
        <Lock className="input-icon" size={22} strokeWidth={2.5} />
        <input name="password" type="password" placeholder="كلمة المرور" onChange={handleChange} required />
      </div>

      <div className="input-group md:col-span-2"> {/* تأكيد كلمة المرور واخد العرض كله */}
        <ShieldCheck className="input-icon" size={22} strokeWidth={2.5} />
        <input name="confirmPassword" type="password" placeholder="تأكيد كلمة المرور" onChange={handleChange} required />
      </div>
    </div>

    {error && <div className="error-message mt-4">{error}</div>}

    <button type="submit" className="submit-btn !mt-8 py-5 text-lg">
      <span>إنشاء الحساب</span>
      <ArrowLeft size={24} strokeWidth={2.5} />
    </button>
  </form>
</motion.div>
    </div>
  );
};

export default SignupPatient;