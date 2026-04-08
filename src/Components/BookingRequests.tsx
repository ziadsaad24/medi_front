import { useState } from 'react';
import { Clock, User, Calendar, Phone, Check, X } from 'lucide-react';

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
}

const mockBookingRequests: BookingRequest[] = [
  { id: '1', patientName: 'سارة أحمد محمد', patientId: 'P-2001', phone: '0501234567', requestedDate: '2026-03-22', requestedTime: '10:00', reason: 'فحص دوري', status: 'pending', avatar: 'سأ' },
  { id: '2', patientName: 'محمد عبدالله', patientId: 'P-2002', phone: '0502345678', requestedDate: '2026-03-22', requestedTime: '11:30', reason: 'استشارة طبية', status: 'pending', avatar: 'مع' },
  { id: '3', patientName: 'فاطمة حسن', patientId: 'P-2003', phone: '0503456789', requestedDate: '2026-03-23', requestedTime: '09:00', reason: 'متابعة حالة', status: 'pending', avatar: 'فح' },
  { id: '4', patientName: 'خالد عمر', patientId: 'P-2004', phone: '0504567890', requestedDate: '2026-03-23', requestedTime: '14:00', reason: 'فحص شامل', status: 'pending', avatar: 'خع' },
  { id: '5', patientName: 'نورة سعد', patientId: 'P-2005', phone: '0505678901', requestedDate: '2026-03-24', requestedTime: '10:30', reason: 'كشف مبدئي', status: 'pending', avatar: 'نس' },
];

export function BookingRequests() {
  const [requests, setRequests] = useState<BookingRequest[]>(mockBookingRequests);

  const handleApprove = (id: string) =>
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' } : r));
  const handleReject = (id: string) =>
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' } : r));

  const getStatusBadge = (status: BookingRequest['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-sm sm:text-base font-medium bg-gradient-to-r from-blue-950/95 via-blue-900/90 to-cyan-800/85 backdrop-blur-md text-[#22c55e] border border-[#22c55e]/30">
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
    <div className="bg-gradient-to-l from-blue-950/95 via-blue-900/90 to-cyan-800/85 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
          <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">طلبات الحجز الجديدة</h2>
          <p className="text-sm sm:text-base text-white/70">
            لديك <span className="font-semibold text-white">{requests.filter(r => r.status === 'pending').length}</span> طلب جديد
          </p>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="backdrop-blur-xl bg-gradient-to-b from-blue-950/55 via-blue-900/90 to-cyan-800/55 border border-white/20 rounded-2xl p-3 sm:p-5 hover:bg-white/15 transition-all group flex flex-col w-full gap-3"
          >
            {/* Avatar + Name + Status */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-semibold text-base sm:text-lg">{req.avatar}</span>
              </div>

              <div className="flex items-center justify-between flex-1 gap-3">
                <h3 className="font-semibold text-white text-sm sm:text-base md:text-lg">{req.patientName}</h3>
                <div>{getStatusBadge(req.status)}</div>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2 mt-2">
              <p className="text-white/60 text-xs sm:text-sm">{req.patientId}</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-white/90">
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
                    onClick={() => handleApprove(req.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#22c55e]/90 text-white shadow-lg hover:bg-[#22c55e] transition-all text-xs sm:text-sm font-medium"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4" />قبول
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-[#ef4444]/90 text-white shadow-lg hover:bg-[#ef4444] transition-all text-xs sm:text-sm font-medium"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />رفض
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {requests.filter(r => r.status === 'pending').length === 0 && (
        <div className="text-center py-12">
          <div className="w-14 h-14 sm:w-20 sm:h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <p className="text-white/70">لا توجد طلبات حجز جديدة</p>
        </div>
      )}
    </div>
  );
}