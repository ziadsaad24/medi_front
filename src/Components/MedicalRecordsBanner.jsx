import { FileText, UploadCloud, ShieldCheck } from "lucide-react";
import { Link } from 'react-router-dom';


export function MedicalRecordsBanner() {
  return (
    


    <div className="container mx-auto px-4 my-8"  dir="rtl">
      <div className="relative overflow-hidden rounded-3xl shadow-2xl">

        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1586773860418-d37222d8fce3"
            className="w-full h-full object-cover"
            alt="Medical Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-cyan-800/85"></div>
        </div>

        {/* Content */}
        <div className="relative px-10 py-20 text-white">
          <div className="flex flex-col- lg:flex-row items-center justify-between gap-16">

            {/* Text Section */}
            <div className="flex-1 space-y-8 animate-fade-in">

              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/15 rounded-2xl backdrop-blur-md">
                  <FileText className="w-8 h-8 text-cyan-300" />
                </div>
                <h1 className="text-5xl font-bold tracking-tight">
                  ملفك الطبي الرقمي — جاهز في أي وقت
                </h1>
              </div>

              <p className="text-xl text-blue-100 leading-relaxed max-w-2xl">
                أنشئ سجلك الطبي الإلكتروني واحفظ جميع مستنداتك في منصة آمنة ومشفرة بالكامل.
                قم برفع الأشعة، التقارير، الروشتات وتاريخك المرضي في مكان واحد منظم وسهل الوصول.
              </p>

              <p className="text-lg text-cyan-200 max-w-2xl">
                بعد استكمال ملفك، يتم إنشاء رمز QR شخصي وآمن يتيح للأطباء الوصول إلى بياناتك الطبية فورًا — دون الحاجة لحمل أوراق.
              </p>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
                <Feature icon={<ShieldCheck />} text="تشفير وحماية متقدمة" />
                <Feature icon={<UploadCloud />} text="رفع وتنظيم الملفات" />
                <Feature icon={<FileText />} text="وصول سريع وآمن" />
              </div>

              {/* Button */}
              <Link 
              to="/recorded"
                className="orbit-btn"
              >
                إنشاء ملف طبي الآن
              </Link>
            </div>

            {/* QR Premium Card */}
            <div className="shrink-0 ">
              <div className="
              relative p-8 rounded-3xl
    bg-white/10 backdrop-blur-xl
    border border-white/20
    shadow-[0_0_40px_rgba(0,255,255,0.15)]
    qr-breathing
              ">
                
                {/* Fake QR Visual */}
                <div className="w-56 h-56 bg-white rounded-2xl p-6">
                  <div className="w-full h-full grid grid-cols-6 gap-1">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${
                          Math.random() > 0.5 ? "bg-cyan-700" : "bg-white"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>

                <p className="text-center text-blue-100 mt-6 text-sm">
                  يتم إنشاء رمز QR بعد اكتمال بياناتك
                </p>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
   
  );
}

function Feature({ icon, text }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl px-4 py-3">
      <div className="text-cyan-300">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}