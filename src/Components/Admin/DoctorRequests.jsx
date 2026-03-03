import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  FileText, 
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  Download
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import Swal from 'sweetalert2';

const DoctorRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      // في وضع التطوير، نستخدم بيانات تجريبية
      // عند الاتصال بالـ Backend، استبدل هذا بـ:
      // const response = await adminAPI.getPendingDoctors();
      // setRequests(response.data);
      
      // بيانات تجريبية للتطوير
      setTimeout(() => {
        setRequests([
          {
            id: 1,
            name: 'د. أحمد محمود السيد',
            email: 'ahmed.mahmoud@example.com',
            phone: '01012345678',
            specialty: 'أخصائي قلب وأوعية دموية',
            license: 'license_123456.pdf',
            submittedAt: '2024-03-01T10:30:00',
            status: 'pending'
          },
          {
            id: 2,
            name: 'د. نورا خالد عبدالله',
            email: 'nora.khaled@example.com',
            phone: '01098765432',
            specialty: 'أخصائية جلدية وتجميل',
            license: 'license_789012.pdf',
            submittedAt: '2024-03-01T09:15:00',
            status: 'pending'
          },
          {
            id: 3,
            name: 'د. محمد يوسف حسن',
            email: 'mohamed.youssef@example.com',
            phone: '01155667788',
            specialty: 'أخصائي عظام ومفاصل',
            license: 'license_345678.pdf',
            submittedAt: '2024-02-29T14:20:00',
            status: 'pending'
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    const result = await Swal.fire({
      title: 'تأكيد قبول الطلب',
      text: 'هل أنت متأكد من قبول هذا الطبيب؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، قبول',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // await adminAPI.approveDoctorRequest(requestId);
        setRequests(requests.filter(req => req.id !== requestId));
        
        Swal.fire({
          title: 'تم القبول!',
          text: 'تم قبول الطبيب بنجاح وإرسال بريد إلكتروني بالتفعيل',
          icon: 'success',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#10b981'
        });
      } catch (error) {
        Swal.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء قبول الطلب',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: 'تأكيد رفض الطلب',
      text: 'هل أنت متأكد من رفض هذا الطبيب؟',
      icon: 'warning',
      input: 'textarea',
      inputPlaceholder: 'أدخل سبب الرفض (اختياري)',
      showCancelButton: true,
      confirmButtonText: 'نعم، رفض',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // await adminAPI.rejectDoctorRequest(requestId, result.value);
        setRequests(requests.filter(req => req.id !== requestId));
        
        Swal.fire({
          title: 'تم الرفض',
          text: 'تم رفض الطلب وإرسال إشعار للطبيب',
          icon: 'info',
          confirmButtonText: 'حسناً',
          confirmButtonColor: '#3b82f6'
        });
      } catch (error) {
        Swal.fire({
          title: 'خطأ!',
          text: 'حدث خطأ أثناء رفض الطلب',
          icon: 'error',
          confirmButtonText: 'حسناً'
        });
      }
    }
  };

  const viewDetails = (request) => {
    Swal.fire({
      title: `تفاصيل طلب ${request.name}`,
      html: `
        <div style="text-align: right; direction: rtl; font-family: 'Segoe UI', sans-serif;">
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 15px;">
            <div style="display: grid; gap: 15px;">
              <div>
                <strong style="color: #0F427D;">👤 الاسم:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${request.name}</p>
              </div>
              <div>
                <strong style="color: #0F427D;">📧 البريد الإلكتروني:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${request.email}</p>
              </div>
              <div>
                <strong style="color: #0F427D;">📱 الهاتف:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${request.phone}</p>
              </div>
              <div>
                <strong style="color: #0F427D;">🏥 التخصص:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${request.specialty}</p>
              </div>
              <div>
                <strong style="color: #0F427D;">📄 الترخيص:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${request.license}</p>
              </div>
              <div>
                <strong style="color: #0F427D;">📅 تاريخ التقديم:</strong>
                <p style="margin: 5px 0 0 0; color: #475569;">${new Date(request.submittedAt).toLocaleDateString('ar-EG')}</p>
              </div>
            </div>
          </div>
        </div>
      `,
      width: 600,
      confirmButtonText: 'إغلاق',
      confirmButtonColor: '#0F427D',
      customClass: {
        popup: 'rounded-2xl'
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Header - Modern & Clean */}
      <div className="bg-gradient-to-r from-[#0F427D] to-[#1a5a9e] px-6 py-5 relative overflow-hidden">
        {/* Subtle decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg"
            >
              <Clock className="text-white" size={24} />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-white mb-0.5">طلبات الأطباء المعلقة</h2>
              <p className="text-sm text-white/80">مراجعة وقبول طلبات التسجيل الجديدة</p>
            </div>
          </div>
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white text-[#0F427D] px-4 py-2 rounded-xl text-base font-black shadow-lg"
          >
            {requests.length}
          </motion.span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {Array(3).fill(0).map((_, idx) => (
              <div key={idx} className="border border-gray-200 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Clock className="text-gray-400" size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">لا توجد طلبات معلقة</h3>
            <p className="text-sm text-gray-500">جميع طلبات الأطباء تمت معالجتها</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {requests.map((request, idx) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  className="border-2 border-gray-200 rounded-xl p-5 hover:border-[#008080]/40 transition-all duration-300 bg-white group"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar with hover effect */}
                    <motion.div 
                      whileHover={{ rotate: 5, scale: 1.05 }}
                      className="w-14 h-14 bg-gradient-to-br from-[#0F427D] to-[#008080] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                    >
                      <User className="text-white" size={24} strokeWidth={2.5} />
                    </motion.div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-[#0F427D] transition-colors">{request.name}</h3>
                      <p className="text-sm text-[#008080] font-semibold mb-3 flex items-center gap-1.5">
                        <Briefcase size={14} />
                        {request.specialty}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <Mail size={14} className="text-blue-500" />
                          <span className="font-medium">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <Phone size={14} className="text-green-500" />
                          <span className="font-medium">{request.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <Briefcase size={14} className="text-purple-500" />
                          <span className="font-medium">{request.experience}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                          <Clock size={14} className="text-amber-500" />
                          <span className="font-medium">{new Date(request.submittedAt).toLocaleDateString('ar-EG')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions with hover effects */}
                    <div className="flex flex-col gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => viewDetails(request)}
                        className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                        title="عرض التفاصيل"
                      >
                        <Eye size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleApprove(request.id)}
                        className="p-2.5 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                        title="قبول"
                      >
                        <CheckCircle size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleReject(request.id)}
                        className="p-2.5 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg"
                        title="رفض"
                      >
                        <XCircle size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorRequests;
