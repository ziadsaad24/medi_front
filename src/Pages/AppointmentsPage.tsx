import { useEffect, useMemo, useState } from "react";
import { AppointmentCard } from "../Components/AppointmentCard";
import { motion } from "framer-motion";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Layout/Footer";
import { patientAPI } from "../services/api";

type Appointment = {
  id: string;
  doctorId?: string;
  doctorName: string;
  specialty: string;
  doctorPhone?: string;
  clinicName?: string;
  clinicAddress?: string;
  date: string;
  time: string;
  type: string;
  rawStatus: string;
  status: string;
  reason?: string;
  consultationFee?: string;
  doctorNote?: string;
  rejectReason?: string;
  avatarUrl: string;
};

type DoctorLookupItem = {
  id: string;
  name: string;
  avatarUrl: string;
};

const toArabicStatus = (status: string) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'confirmed') return 'مؤكد';
  if (normalized === 'in_progress') return 'جاري التنفيذ';
  if (normalized === 'completed') return 'مكتمل';
  if (normalized === 'cancelled' || normalized === 'canceled') return 'ملغي';
  if (normalized === 'rejected') return 'مرفوض';
  return 'قيد الانتظار';
};

const isCompletedStatus = (status: string) => {
  const normalized = String(status || '').toLowerCase();
  return [
    'completed',
    'complete',
    'done',
    'finished',
    'closed',
    'resolved',
    'ended',
    'cancelled',
    'canceled',
    'مكتمل',
    'منتهي',
  ].includes(normalized);
};

const hasMedicalRecordMarker = (item: any) => {
  return Boolean(
    item?.medical_record_id ||
      item?.medicalRecordId ||
      item?.record_id ||
      item?.recordId ||
      item?.linked_record_id ||
      item?.linkedRecordId ||
      item?.has_medical_record === true ||
      item?.hasMedicalRecord === true ||
      item?.completed_at ||
      item?.completedAt ||
      item?.consultation_completed === true ||
      item?.consultationCompleted === true ||
      item?.ended_at ||
      item?.endedAt
  );
};

const toArabicType = (type: string) => (String(type) === 'follow_up' ? 'مراجعة' : 'كشف');

const API_BASE = String((import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

const resolveAvatarUrl = (raw: any) => {
  const candidate =
    raw?.doctor_avatar_url ||
    raw?.doctor_avatar ||
    raw?.avatar_url ||
    raw?.avatar ||
    raw?.doctor_profile_image ||
    raw?.profile_image ||
    raw?.profileImage ||
    raw?.doctor_image ||
    raw?.image ||
    raw?.doctor?.avatar ||
    raw?.doctor?.avatar_url ||
    raw?.doctor?.profile_image ||
    raw?.doctor?.image ||
    '';

  if (!candidate) {
    return 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80';
  }

  if (String(candidate).startsWith('http://') || String(candidate).startsWith('https://')) {
    return candidate;
  }

  const normalizedPath = String(candidate).startsWith('/') ? candidate : `/${candidate}`;
  return `${API_BASE}${normalizedPath}`;
};

const normalizeText = (value: string) => String(value || '').trim().toLowerCase();

const toDoctorsArray = (response: any) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response)) return response;
  return [];
};

const toRecordsArray = (response: any) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.records)) return response.records;
  if (Array.isArray(response?.data?.records)) return response.data.records;
  if (Array.isArray(response)) return response;
  return [];
};

const extractLinkedAppointmentId = (record: any) => {
  const value =
    record?.appointment_id ||
    record?.appointmentId ||
    record?.linked_appointment_id ||
    record?.linkedAppointmentId ||
    null;

  if (value === undefined || value === null || value === '') return null;
  return String(value);
};

const buildDoctorLookup = (items: any[]): DoctorLookupItem[] => {
  return items.map((doc) => ({
    id: String(doc?.id ?? ''),
    name: doc?.full_name || doc?.name || '',
    avatarUrl: resolveAvatarUrl(doc),
  }));
};

const pickAvatarFromLookup = (
  appointmentItem: any,
  doctorName: string,
  doctorLookup: DoctorLookupItem[]
) => {
  const doctorId = String(appointmentItem?.doctor_id ?? appointmentItem?.doctorId ?? '');

  if (doctorId) {
    const byId = doctorLookup.find((item) => item.id === doctorId && item.avatarUrl);
    if (byId) return byId.avatarUrl;
  }

  const normalizedName = normalizeText(doctorName);
  if (normalizedName) {
    const byName = doctorLookup.find((item) => normalizeText(item.name) === normalizedName && item.avatarUrl);
    if (byName) return byName.avatarUrl;
  }

  return '';
};

const normalizeAppointment = (item: any, doctorLookup: DoctorLookupItem[] = []): Appointment => {
  const rawStatus =
    item.status ||
    item.appointment_status ||
    item.booking_status ||
    item.request_status ||
    'pending';
  const date = item.confirmed_date || item.confirmedDate || item.requested_date || item.requestedDate || '-';
  const time = item.confirmed_time || item.confirmedTime || item.requested_time || item.requestedTime || '-';
  const doctorName = item.doctor_name || item.doctorName || 'غير معروف';
  const avatarFromAppointment = resolveAvatarUrl(item);
  const avatarFromDoctorsList = pickAvatarFromLookup(item, doctorName, doctorLookup);
  const avatarUrl = avatarFromDoctorsList || avatarFromAppointment;

  return {
    id: String(item.id),
    doctorId: String(item.doctor_id || item.doctorId || ''),
    doctorName,
    specialty: item.specialization || item.specialty || 'بدون تخصص',
    doctorPhone: item.doctor_phone || item.doctorPhone || item.phone || '',
    clinicName: item.clinic_name || item.clinicName || '',
    clinicAddress: item.clinic_address || item.clinicAddress || '',
    date,
    time,
    type: toArabicType(item.appointment_type || item.appointmentType || 'new'),
    rawStatus,
    status: toArabicStatus(rawStatus),
    reason: item.reason || item.visit_reason || item.chief_complaint || '',
    consultationFee: String(item.consultation_fee || item.consultationFee || item.fee || item.price || ''),
    doctorNote: item.doctor_note || item.doctorNote || '',
    rejectReason: item.reject_reason || item.rejectReason || '',
    avatarUrl,
  };
};

const parseAppointmentTimestamp = (item: any) => {
  const datePart =
    item?.confirmed_date ||
    item?.confirmedDate ||
    item?.requested_date ||
    item?.requestedDate ||
    '';

  const timePart =
    item?.confirmed_time ||
    item?.confirmedTime ||
    item?.requested_time ||
    item?.requestedTime ||
    '00:00';

  if (!datePart) return Number.MAX_SAFE_INTEGER;

  const isoValue = `${datePart}T${String(timePart).slice(0, 5)}:00`;
  const parsed = new Date(isoValue).getTime();

  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadAppointments = async () => {
      setLoading(true);
      setError('');
      try {
        const [appointmentsResponse, doctorsResponse, recordsResponse] = await Promise.all([
          patientAPI.getMyAppointments({ forceRefresh: true }),
          patientAPI.getDoctors({ page: 1, per_page: 100 }),
          patientAPI.getMedicalRecords({ page: 1, per_page: 100 }),
        ]);

        const list = Array.isArray(appointmentsResponse?.data)
          ? appointmentsResponse.data
          : Array.isArray(appointmentsResponse?.data?.data)
            ? appointmentsResponse.data.data
            : Array.isArray(appointmentsResponse)
              ? appointmentsResponse
              : [];

        const doctorLookup = buildDoctorLookup(toDoctorsArray(doctorsResponse));
        const recordsList = toRecordsArray(recordsResponse);

        const linkedAppointmentIds = new Set(
          recordsList
            .map((record: any) => extractLinkedAppointmentId(record))
            .filter(Boolean)
        );

        if (!active) return;
        const sortedList = [...list].sort((a: any, b: any) => parseAppointmentTimestamp(a) - parseAppointmentTimestamp(b));
        const upcomingOnly = sortedList.filter((item: any) => {
          const status =
            item?.status ||
            item?.appointment_status ||
            item?.booking_status ||
            item?.request_status ||
            '';

          if (isCompletedStatus(status)) return false;
          if (hasMedicalRecordMarker(item)) return false;
          if (linkedAppointmentIds.has(String(item?.id || ''))) return false;

          return true;
        });

        setAppointments(upcomingOnly.map((item: any) => normalizeAppointment(item, doctorLookup)));
      } catch (err: any) {
        if (!active) return;
        setError(err?.response?.data?.message || 'تعذر تحميل المواعيد حالياً');
        setAppointments([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAppointments();

    return () => {
      active = false;
    };
  }, []);

  const confirmedCount = useMemo(
    () => appointments.filter((a) => a.status === 'مؤكد').length,
    [appointments]
  );

  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === 'قيد الانتظار').length,
    [appointments]
  );

  return (
    <div className="flex flex-col min-h-screen theme-page">
      <Navbar />

      <main className="flex-grow relative overflow-x-hidden">

        {/* Decorative Background */}
        <div className="fixed top-20 right-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-a)' }} />
        <div className="fixed bottom-20 left-[-5%] w-96 h-96 rounded-full blur-[120px] pointer-events-none z-0" style={{ background: 'var(--app-glow-b)' }} />

        {/* Content */}
        <div className="relative z-10 px-4 pt-28 pb-24">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl md:text-5xl font-black theme-title mb-4">
                المواعيد <span className="text-blue-500">القادمة</span>
              </h1>

              <p className="theme-text-muted text-lg">
                تابع مواعيدك الطبية القادمة بسهولة
              </p>
            </motion.div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">

              {loading && (
                <div className="col-span-full text-center theme-text-muted py-10">جارٍ تحميل مواعيدك...</div>
              )}

              {!loading && error && (
                <div className="col-span-full text-center text-rose-400 py-10">{error}</div>
              )}

              {!loading && !error && appointments.length === 0 && (
                <div className="col-span-full text-center theme-text-muted py-10">لا توجد مواعيد حالياً.</div>
              )}

              {appointments.map((appointment, index) => (
                <AppointmentCard
                  key={appointment.id}
                  {...appointment}
                  index={index}
                />
              ))}

            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex justify-center"
            >
              <div className="theme-surface backdrop-blur-xl rounded-3xl px-10 py-6 flex gap-10 text-center">

                <div>
                  <p className="text-3xl font-black theme-title">
                    {appointments.length}
                  </p>
                  <p className="theme-text-muted text-sm">
                    إجمالي المواعيد
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-emerald-400">
                    {confirmedCount}
                  </p>
                  <p className="theme-text-muted text-sm">
                    مؤكدة
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-black text-amber-400">
                    {pendingCount}
                  </p>
                  <p className="theme-text-muted text-sm">
                    قيد الانتظار
                  </p>
                </div>

              </div>
            </motion.div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}