import React from 'react';

const EmergencyCardDemo = () => {
  // بيانات تجريبية للتوضيح
  const patientInfo = {
    name: "أحمد محمد علي",
    phone: "01012345678",
    bloodType: "O+",
    allergies: "حساسية من البنسلين",
    image: "https://via.placeholder.com/100"
  };

  const medicalRecords = [
    {
      id: 3,
      date: "10 يناير 2026",
      type: "patient_upload",
      title: "أشعة صدر",
      uploadedBy: "المريض",
      file: "chest-xray.pdf",
      fileSize: "2.3 MB",
      notes: "أشعة روتينية"
    },
    {
      id: 2,
      date: "5 يناير 2026",
      type: "doctor_consultation",
      title: "كشف طبي",
      doctorName: "د. محمد حسن",
      specialty: "قلب وأوعية دموية",
      diagnosis: "ارتفاع ضغط الدم",
      treatment: "كونكور 5mg مرة يومياً",
      temperature: "37°C",
      bloodPressure: "140/90",
      pulse: "82 bpm",
      file: "تقرير_الكشف.pdf"
    },
    {
      id: 1,
      date: "1 يناير 2026",
      type: "patient_upload",
      title: "تحليل صورة دم كاملة",
      uploadedBy: "المريض",
      file: "cbc-test.pdf",
      fileSize: "1.1 MB",
      notes: "تحليل دوري"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🚨</span>
            <h1 className="text-2xl font-bold">بطاقة الطوارئ الطبية</h1>
          </div>
          <p className="text-red-100 text-sm">Emergency Medical Card - Accessible via QR Code</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-red-200">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-red-500 flex-shrink-0">
              <img 
                src={patientInfo.image} 
                alt="Patient" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-sm text-gray-500">اسم المريض</p>
                    <p className="text-xl font-bold text-gray-800">{patientInfo.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📞</span>
                  <div>
                    <p className="text-xs text-gray-500">رقم الهاتف</p>
                    <p className="text-lg font-semibold text-gray-700">{patientInfo.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">🩸</span>
                  <div>
                    <p className="text-sm text-gray-500">فصيلة الدم</p>
                    <p className="text-xl font-bold text-red-600">{patientInfo.bloodType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <p className="text-xs text-yellow-700 font-medium">حساسية مهمة</p>
                    <p className="text-sm font-bold text-yellow-800">{patientInfo.allergies}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <span>📄</span>
            تحميل ملخص PDF
          </button>
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <span>🖨️</span>
            طباعة السجلات
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <span>📞</span>
            اتصال طوارئ
          </button>
        </div>

        {/* Timeline Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span>📋</span>
            السجل الطبي الموحد
          </h2>
          <p className="text-gray-600 mt-1">Unified Medical Timeline - All Records in Chronological Order</p>
        </div>

        {/* Medical Records Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-green-300"></div>

          {medicalRecords.map((record, index) => (
            <div key={record.id} className="relative mb-6 mr-16">
              {/* Timeline Dot */}
              <div className={`absolute -right-[4.5rem] top-6 w-6 h-6 rounded-full border-4 ${
                record.type === 'doctor_consultation' 
                  ? 'bg-blue-500 border-blue-200' 
                  : 'bg-green-500 border-green-200'
              }`}></div>

              {/* Record Card */}
              <div className={`rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-2xl hover:scale-[1.02] ${
                record.type === 'doctor_consultation'
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
                  : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
              }`}>
                {/* Card Header */}
                <div className={`px-6 py-3 ${
                  record.type === 'doctor_consultation'
                    ? 'bg-blue-600'
                    : 'bg-green-600'
                }`}>
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">
                        {record.type === 'doctor_consultation' ? '🩺' : '📄'}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold">{record.title}</h3>
                        <p className="text-xs opacity-90">🗓️ {record.date}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      record.type === 'doctor_consultation'
                        ? 'bg-blue-800'
                        : 'bg-green-800'
                    }`}>
                      {record.type === 'doctor_consultation' ? '👨‍⚕️ سجل طبي' : '👤 رفع شخصي'}
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {record.type === 'doctor_consultation' ? (
                    // Doctor Consultation Details
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">👨‍⚕️ الطبيب المعالج</p>
                        <p className="text-lg font-bold text-gray-800">{record.doctorName}</p>
                        <p className="text-sm text-blue-600">{record.specialty}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-500 mb-1">🔍 التشخيص</p>
                          <p className="font-bold text-gray-800">{record.diagnosis}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-500 mb-1">💊 العلاج</p>
                          <p className="font-bold text-gray-800">{record.treatment}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                          <p className="text-xs text-gray-500">🌡️ الحرارة</p>
                          <p className="text-lg font-bold text-red-500">{record.temperature}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                          <p className="text-xs text-gray-500">💉 الضغط</p>
                          <p className="text-lg font-bold text-blue-600">{record.bloodPressure}</p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-blue-200 text-center">
                          <p className="text-xs text-gray-500">❤️ النبض</p>
                          <p className="text-lg font-bold text-pink-600">{record.pulse}</p>
                        </div>
                      </div>

                      {record.file && (
                        <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-lg">
                          <span className="text-2xl">📎</span>
                          <span className="text-sm font-medium text-blue-900">{record.file}</span>
                        </div>
                      )}

                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold transition-all">
                        عرض التفاصيل الكاملة
                      </button>
                    </div>
                  ) : (
                    // Patient Upload Details
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-green-200">
                        <span className="text-3xl">👤</span>
                        <div>
                          <p className="text-xs text-gray-500">رفع بواسطة</p>
                          <p className="font-bold text-gray-800">{record.uploadedBy}</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">📎</span>
                            <span className="font-bold text-gray-800">{record.file}</span>
                          </div>
                          <span className="text-sm text-gray-500">{record.fileSize}</span>
                        </div>
                        {record.notes && (
                          <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-gray-500 mb-1">📝 ملاحظات</p>
                            <p className="text-sm text-gray-700">{record.notes}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition-all">
                          عرض الملف
                        </button>
                        <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-bold transition-all">
                          تحميل
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 text-center">
          <p className="text-yellow-800 font-bold">⚠️ هذه صفحة توضيحية مؤقتة - Demo Page</p>
          <p className="text-yellow-700 text-sm mt-1">يمكن مسح هذا الملف بعد المراجعة</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyCardDemo;
