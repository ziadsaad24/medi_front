import { Clock, User, Calendar, Phone, Check, X, FilePlus2, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useDoctorWorkflow } from '../context/DoctorWorkflowContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface BookingRequest {
  id: string;
  patientName: string;
  patientId: string;
  phone: string;
  requestedDate: string;
  requestedTime: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar: string;
  linkedAppointmentId?: string | null;
}

export function BookingRequests() {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { requests, approveRequest, rejectRequest, setCurrentConsultationContext, loading } = useDoctorWorkflow();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCreateMedicalRecord = (req: BookingRequest) => {
    if (!req.linkedAppointmentId) {
      window.alert('لا يمكن بدء الكشف حالياً لأن الموعد لم يُربط بعد. حاول تحديث الصفحة أو انتقل إلى لوحة التحكم.');
      return;
    }

    const contextPayload = {
      appointmentId: req.linkedAppointmentId,
      patientId: req.patientId,
      patientName: req.patientName,
      patientPhone: req.phone,
      requestedDate: req.requestedDate,
      requestedTime: req.requestedTime,
      reason: req.reason,
    };

    setCurrentConsultationContext(contextPayload);

    navigate('/doctor/medical-records/new', {
      state: {
        appointmentContext: contextPayload,
      },
    });
  };

  const handleApprove = async (req: BookingRequest) => {
    try {
      setProcessingId(req.id);
      await approveRequest(req.id);
      navigate('/doctor/dashboard');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req: BookingRequest) => {
    try {
      setProcessingId(req.id);
      await rejectRequest(req.id);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: BookingRequest['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm sm:text-base font-medium backdrop-blur-md text-[#22c55e] border border-[#22c55e]/30 ${isDark ? "bg-slate-900/80" : "bg-[#22c55e]/10"}`}>
            <Check className="w-4 h-4" /> مقبول
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm sm:text-base font-medium bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30 backdrop-blur-xl">
            <X className="w-4 h-4" /> مرفوض
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm sm:text-base font-medium bg-amber-500/70 border border-white/20 backdrop-blur-xl">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-semibold">قيد الانتظار</span>
          </span>
        );
    }
  };

  return (
    <div className="theme-card backdrop-blur-md rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl backdrop-blur-xl border flex items-center justify-center shadow-lg ${isDark ? "bg-white/10 border-white/20" : "bg-[#0f427d]/10 border-[#0f427d]/20"}`}>
          <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? "text-white" : "text-[#0f427d]"}`} />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold theme-title">طلبات الحجز الجديدة</h2>
          <p className={`text-sm sm:text-base ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>
            لديك <span className={`font-semibold ${isDark ? "text-white" : "text-[#0f427d]"}`}>{requests.filter(r => r.status === 'pending').length}</span> طلب جديد
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className={`backdrop-blur-xl border rounded-2xl p-3 sm:p-5 transition-all group flex flex-col w-full gap-3 ${isDark ? "bg-slate-900/70 border-white/20 hover:bg-slate-800/75" : "bg-white border-[#0f427d]/15 hover:bg-[#0f427d]/5"}`}
          >
            {/* Avatar + Name + Status */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full backdrop-blur-xl border flex items-center justify-center shadow-lg flex-shrink-0 ${isDark ? "bg-white/20 border-white/30" : "bg-[#0f427d]/8 border-[#0f427d]/20"}`}>
                <span className={`font-semibold text-base sm:text-lg ${isDark ? "text-white" : "text-[#0f427d]"}`}>{req.avatar}</span>
              </div>

              <div className="flex items-center justify-between flex-1 gap-3">
                <h3 className="font-semibold theme-title text-sm sm:text-base md:text-lg">{req.patientName}</h3>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 mt-2">
              <p className={`text-xs sm:text-sm ${isDark ? "text-white/60" : "text-[#0f427d]/60"}`}>{req.patientId}</p>
              <div className={`grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm ${isDark ? "text-white/90" : "text-[#0f427d]/85"}`}>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                  {req.requestedDate}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  {req.requestedTime}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  {req.phone}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  {req.reason}
                </div>
              </div>

              {/* Action Buttons */}
              {req.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={() => handleApprove(req)}
                    disabled={processingId === req.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#22c55e]/90 text-white shadow-lg hover:bg-[#22c55e] transition-all text-xs sm:text-sm font-medium"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />قبول
                  </button>
                  <button
                    onClick={() => handleReject(req)}
                    disabled={processingId === req.id}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#ef4444]/90 text-white shadow-lg hover:bg-[#ef4444] transition-all text-xs sm:text-sm font-medium"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />رفض
                  </button>
                </div>
              )}

              {req.status === 'approved' && (
                <div className={`mt-2 rounded-2xl border p-3 sm:p-4 ${isDark ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-emerald-50 border-emerald-200'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className={`text-xs sm:text-sm font-semibold ${isDark ? 'text-emerald-200' : 'text-emerald-800'}`}>
                      تم قبول الحجز ويمكنك الآن بدء الكشف وإضافة سجل طبي.
                    </p>

                    <button
                      onClick={() => handleCreateMedicalRecord(req)}
                      disabled={!req.linkedAppointmentId}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white shadow-lg hover:brightness-110 transition-all text-xs sm:text-sm font-bold"
                    >
                      <FilePlus2 className="w-4 h-4" />
                      {req.linkedAppointmentId ? 'ابدأ الكشف' : 'بانتظار ربط الموعد'}
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && requests.filter(r => r.status === 'pending').length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 sm:w-20 sm:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-4">
            <Calendar className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? "text-white" : "text-[#0f427d]"}`} />
          </div>
          <p className={`${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>لا توجد طلبات حجز جديدة</p>
        </div>
      )}
    </div>
  );
}