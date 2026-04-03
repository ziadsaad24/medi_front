import React from 'react';
import EmergencyCard3D from '../Components/EmergencyCard3D';

const EmergencyCard3DPage = () => {
  // بيانات المريض
  const patientData = {
    name: "محمد أحمد محمود",
    id: "664221",
    age: "32 سنة",
    bloodType: "A+",
    height: "170 سم",
    weight: "66 كجم",
    allergies: "البنسلين",
    emergencyContact: {
      name: "محمد أحمد (اخ)",
      phone: "01012345678"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏥</span>
            <h1 className="text-3xl font-bold">بطاقة الطوارئ الطبية 3D</h1>
          </div>
          <p className="text-blue-100 text-sm">3D Emergency Medical Card - Interactive Flip Design</p>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            كيفية الاستخدام
          </h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>اضغط على زر "عرض الخلف" لقلب البطاقة ورؤية الوجه الخلفي</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>يمكنك أيضاً الضغط مباشرة على البطاقة لقلبها</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>البطاقة تحتوي على جميع المعلومات الطبية الضرورية في حالة الطوارئ</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Emergency Card 3D */}
      <EmergencyCard3D patientData={patientData} />

      {/* Footer Info */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start gap-4">
            <span className="text-3xl">💡</span>
            <div>
              <h3 className="text-xl font-bold mb-2">معلومات مهمة</h3>
              <p className="text-blue-100 leading-relaxed">
                هذه البطاقة مصممة لتكون متاحة عبر رمز QR في حالات الطوارئ. يمكن لأي شخص مسح الرمز والوصول 
                إلى المعلومات الطبية الضرورية لإنقاذ حياتك. تأكد من تحديث معلوماتك بانتظام وحمل البطاقة معك دائماً.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCard3DPage;
