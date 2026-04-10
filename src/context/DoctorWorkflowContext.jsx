import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import doctorApi from '../services/doctorApi';
import { useAuth } from './AuthContext';

const DoctorWorkflowContext = createContext(null);

const toArray = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response)) return response;
  return [];
};

const mapAppointmentType = (value) => {
  if (value === 'new' || value === 'جديد') return 'جديد';
  return 'مراجعة';
};

const mapAppointment = (item) => ({
  id: String(item.id),
  requestId: item.requestId || item.request_id || null,
  patientName: item.patientName || item.patient_name || item.name || 'غير معروف',
  patientId: item.patientId || item.patient_id || '',
  phone: item.patientPhone || item.patient_phone || item.phone || '',
  date: item.date || item.appointment_date || '',
  time: item.time || item.appointment_time || '',
  type: mapAppointmentType(item.type),
  reason: item.reason || '',
  status: item.status || 'pending',
});

const mapRequest = (item) => {
  const patientName = item.patientName || item.patient_name || item.name || 'غير معروف';
  const initials = item.avatarInitials || item.avatar_initials || patientName.slice(0, 2);

  return {
    id: String(item.id),
    patientName,
    patientId: item.patientId || item.patient_id || '',
    phone: item.phone || item.patientPhone || item.patient_phone || '',
    requestedDate: item.requestedDate || item.requested_date || item.date || '',
    requestedTime: item.requestedTime || item.requested_time || item.time || '',
    reason: item.reason || '',
    status: item.status || 'pending',
    avatar: initials,
    linkedAppointmentId: item.linkedAppointmentId || item.linked_appointment_id || item.appointmentId || null,
  };
};

const mapRecord = (item) => ({
  id: String(item.id),
  appointmentId: item.appointmentId || item.appointment_id || '',
  patientName: item.patientName || item.patient_name || 'غير معروف',
  patientId: item.patientId || item.patient_id || '',
  visitDate: item.visitDate || item.visit_date || '',
  diagnosis: item.diagnosis || 'بدون تشخيص مكتوب',
  notes: item.notes || item.summary || item.clinical_notes || 'بدون ملاحظات إضافية',
  medicationsCount: Number(item.medicationsCount || item.medications_count || 0),
  createdAt: item.createdAt || item.created_at || new Date().toISOString(),
});

export function DoctorWorkflowProvider({ children }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [currentConsultationContext, setCurrentConsultationContext] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [requestsMeta, setRequestsMeta] = useState(null);
  const [appointmentsMeta, setAppointmentsMeta] = useState(null);
  const [recordsMeta, setRecordsMeta] = useState(null);

  const fetchDashboardOverview = useCallback(async () => {
    const response = await doctorApi.getDoctorDashboardOverview();
    const data = response?.data || response;
    setOverview(data || null);
    return data;
  }, []);

  const fetchRequests = useCallback(async (query = { page: 1, per_page: 20 }) => {
    const response = await doctorApi.getBookingRequests(query);
    const list = toArray(response).map(mapRequest);
    setRequests(list);
    setRequestsMeta(response?.meta || response?.data?.meta || null);
    return list;
  }, []);

  const fetchAppointments = useCallback(async (query = { page: 1, per_page: 30 }) => {
    const response = await doctorApi.getDoctorAppointments(query);
    const list = toArray(response).map(mapAppointment);
    setAppointments(list);
    setAppointmentsMeta(response?.meta || response?.data?.meta || null);
    return list;
  }, []);

  const fetchArchiveRecords = useCallback(async (query = { page: 1, per_page: 20 }) => {
    const response = await doctorApi.getDoctorMedicalRecordsArchive(query);
    const list = toArray(response).map(mapRecord);
    setMedicalRecords(list);
    setRecordsMeta(response?.meta || response?.data?.meta || null);
    return list;
  }, []);

  const refreshDoctorData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [overviewResult, requestsResult, appointmentsResult, recordsResult] = await Promise.allSettled([
      fetchDashboardOverview(),
      fetchRequests(),
      fetchAppointments(),
      fetchArchiveRecords(),
    ]);

    const settledResults = [overviewResult, requestsResult, appointmentsResult, recordsResult];
    const endpointNames = ['overview', 'booking-requests', 'appointments', 'records-archive'];

    const rejected = settledResults.filter((result) => result.status === 'rejected');

    settledResults.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`[doctor-dashboard] Failed to load ${endpointNames[index]}:`, result.reason);
      }
    });

    // لا نكسر لوحة التحكم بالكامل إذا endpoint واحد فقط غير متاح.
    if (rejected.length > 0) {
      const firstError = rejected[0]?.reason;
      const fallbackMessage = firstError?.response?.data?.message || 'تعذر تحميل جزء من بيانات الطبيب';
      if (rejected.length >= 3) {
        setError(fallbackMessage);
      } else {
        setError(null);
      }
    }

    try {
      return {
        overview: overviewResult.status === 'fulfilled' ? overviewResult.value : null,
        requests: requestsResult.status === 'fulfilled' ? requestsResult.value : [],
        appointments: appointmentsResult.status === 'fulfilled' ? appointmentsResult.value : [],
        medicalRecords: recordsResult.status === 'fulfilled' ? recordsResult.value : [],
      };
    } finally {
      setLoading(false);
    }
  }, [fetchAppointments, fetchArchiveRecords, fetchDashboardOverview, fetchRequests]);

  const approveRequest = async (requestId) => {
    const response = await doctorApi.approveBookingRequest(requestId);
    const linkedAppointmentId =
      response?.data?.linkedAppointmentId ||
      response?.data?.linked_appointment_id ||
      response?.linkedAppointmentId ||
      response?.linked_appointment_id ||
      null;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === String(requestId)
          ? { ...r, status: 'approved', linkedAppointmentId: linkedAppointmentId || r.linkedAppointmentId }
          : r
      )
    );

    await fetchAppointments();
    return linkedAppointmentId;
  };

  const rejectRequest = async (requestId, reason) => {
    await doctorApi.rejectBookingRequest(requestId, reason ? { reason } : {});
    setRequests((prev) =>
      prev.map((r) => (r.id === String(requestId) ? { ...r, status: 'rejected' } : r))
    );
  };

  const startConsultation = async (appointmentId) => {
    await doctorApi.updateAppointmentStatus(appointmentId, { status: 'in_progress' });
    setAppointments((prev) =>
      prev.map((a) => (String(a.id) === String(appointmentId) ? { ...a, status: 'in_progress' } : a))
    );
  };

  const completeConsultation = async ({
    appointmentId,
    patientId,
    visitDate,
    diagnosis,
    clinicalNotes,
    chiefComplaint,
    instructions,
    medications = [],
  }) => {
    const appointment = appointments.find((a) => String(a.id) === String(appointmentId));
    const targetPatientId = patientId || appointment?.patientId;

    if (!targetPatientId) {
      throw new Error('patientId is required to complete consultation');
    }

    const recordResponse = await doctorApi.createDoctorMedicalRecord(targetPatientId, {
      appointmentId,
      visitDate,
      clinicalNotes,
      chiefComplaint,
      diagnosis,
      instructions,
    });

    const createdRecordId =
      recordResponse?.data?.id || recordResponse?.data?.recordId || recordResponse?.id || null;

    if (createdRecordId && medications.length > 0) {
      await doctorApi.createPrescription(createdRecordId, {
        prescriptionDate: new Date().toISOString(),
        notes: instructions || '',
        items: medications,
      });
    }

    await doctorApi.updateAppointmentStatus(appointmentId, { status: 'completed' });

    setAppointments((prev) => prev.map((a) => (String(a.id) === String(appointmentId) ? { ...a, status: 'completed' } : a)));
    await fetchAppointments();
    await fetchArchiveRecords();

    setCurrentConsultationContext(null);

    return createdRecordId;
  };

  const actionableAppointments = useMemo(
    () => appointments.filter((a) => a.status === 'approved' || a.status === 'in_progress'),
    [appointments]
  );

  const dashboardStats = useMemo(() => {
    const statsFromOverview = overview || {};

    const activePatients = new Set(appointments.map((a) => a.patientId)).size;

    return {
      ...statsFromOverview,
      todayAppointmentsCount:
        statsFromOverview.todayAppointmentsCount || actionableAppointments.length,
      upcomingAppointmentsCount:
        statsFromOverview.upcomingAppointmentsCount ||
        actionableAppointments.filter((a) => a.status === 'approved').length,
      activePatientsCount: statsFromOverview.activePatientsCount || activePatients,
      totalAppointmentsCount: statsFromOverview.totalAppointmentsCount || appointments.length,
    };
  }, [actionableAppointments, appointments, overview]);

  const value = {
    requests,
    appointments,
    actionableAppointments,
    medicalRecords,
    currentConsultationContext,
    dashboardStats,
    overview,
    loading,
    error,
    requestsMeta,
    appointmentsMeta,
    recordsMeta,
    refreshDoctorData,
    fetchRequests,
    fetchAppointments,
    fetchArchiveRecords,
    approveRequest,
    rejectRequest,
    startConsultation,
    completeConsultation,
    setCurrentConsultationContext,
  };

  useEffect(() => {
    // لا تحمل بيانات لوحة الدكتور إلا عندما يكون المستخدم الحالي دكتور فعلياً.
    if (user?.role !== 'doctor') {
      setRequests([]);
      setAppointments([]);
      setMedicalRecords([]);
      setCurrentConsultationContext(null);
      setOverview(null);
      setRequestsMeta(null);
      setAppointmentsMeta(null);
      setRecordsMeta(null);
      setError(null);
      setLoading(false);
      return;
    }

    refreshDoctorData().catch(() => {
      // Errors are already stored in context state and handled by UI.
    });
  }, [refreshDoctorData, user?.id, user?.role]);

  return <DoctorWorkflowContext.Provider value={value}>{children}</DoctorWorkflowContext.Provider>;
}

export function useDoctorWorkflow() {
  const context = useContext(DoctorWorkflowContext);
  if (!context) {
    throw new Error('useDoctorWorkflow must be used within DoctorWorkflowProvider');
  }
  return context;
}
