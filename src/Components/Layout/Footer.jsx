import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full text-right text-white mt-20">
      
      {/* الأمواج المتحركة - من نفس لون الفوتر الكحلي */}
      <div className="w-full rotate-180 mb-[-1px]">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(8, 18, 33, 0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(8, 18, 33, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(8, 18, 33, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#081221" /> {/* اللون الأساسي للفوتر */}
          </g>
        </svg>
      </div>

      <div className="bg-[#081221] pt-12 pb-8">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
          
          {/* تواصل معنا */}
          <div className="order-4 lg:order-1 space-y-6">
            <h3 className="text-[##f0fdfa] font-black text-lg border-b border-white/5 pb-2 inline-block">تواصل معنا</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-center justify-end gap-3 hover:text-white transition-colors">
                <span>الرياض، السعودية</span>
                <MapPin size={16} className="text-[#f0fdfa]" />
              </li>
              <li className="flex items-center justify-end gap-3 hover:text-white transition-colors" dir="ltr">
                <span>+966 50 123 4567</span>
                <Phone size={16} className="text-[#f0fdfa]" />
              </li>
              <li className="flex items-center justify-end gap-3 hover:text-white transition-colors">
                <span>info@medicare.sa</span>
                <Mail size={16} className="text-[#f0fdfa]" />
              </li>
            </ul>
          </div>

          {/* الدعم والمساعدة */}
          <div className="order-3 lg:order-2 space-y-6">
            <h3 className="text-[#f0fdfa] font-black text-lg border-b border-white/5 pb-2 inline-block">الدعم والمساعدة</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {['مركز المساعدة', 'الأسئلة الشائعة', 'سياسة الخصوصية'].map(i => (
                <li key={i} className="hover:text-white cursor-pointer transition-colors hover:translate-x-[-5px] transform duration-300">{i}</li>
              ))}
            </ul>
          </div>

          {/* عن المشروع */}
          <div className="order-2 lg:order-3 space-y-6">
            <h3 className="text-[#f0fdfa] font-black text-lg border-b border-white/5 pb-2 inline-block">عن MediCare</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {['من نحن', 'فريقنا الطبي', 'الخدمات الطبية'].map(i => (
                <li key={i} className="hover:text-white cursor-pointer transition-colors hover:translate-x-[-5px] transform duration-300">{i}</li>
              ))}
            </ul>
          </div>

          {/* اللوجو والسوشيال ميديا */}
          <div className="order-1 lg:order-4 flex flex-col items-end space-y-5">
            <div className="flex items-center gap-3 group">
              <h2 className="text-2xl font-black text-white">MediCare</h2>
              <div className="w-10 h-10 bg-gradient-to-br from-[#0F427D] to-[#008080] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-[250px]">
              رعاية صحية متميزة نضعها بين يديك، نربطك بأفضل الكفاءات الطبية.
            </p>
            
          <div className="flex gap-3">
  {[
    { Icon: Facebook, class: 'fb-h', name: 'Facebook' },
    { Icon: Twitter, class: 'tw-h', name: 'Twitter' },
    { Icon: Instagram, class: 'ig-h', name: 'Instagram' },
    { Icon: Linkedin, class: 'ln-h', name: 'Linkedin' }
  ].map((social, idx) => (
    <a 
      key={idx} 
      href="#" 
      className={`social-icon-circle ${social.class} group`}
      title={social.name}
    >
      <social.Icon size={18} className="text-gray-400 transition-all duration-300" />
    </a>
  ))}
</div>
          </div>
        </div>

        {/* الحقوق السفلى */}
        <div className="max-w-[1400px] mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row-reverse justify-between items-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
          <p>© 2026 MediCare. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#008080] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#008080] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;