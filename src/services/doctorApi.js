import api from './api';

function buildQuery(params = {}) {
  const cleaned = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});

  return { params: cleaned };
}

function toFormData(payload = {}, fileKeys = []) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;

    if (Array.isArray(value) || typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  fileKeys.forEach((key) => {
    if (payload[key] instanceof File) {
      formData.set(key, payload[key]);
    }
  });

  return formData;
}

const doctorApi = {
  // Profile
  getDoctorProfile: async () => (await api.get('/doctor/profile')).data,

  updateDoctorProfile: async (payload) => (await api.put('/doctor/profile', payload)).data,

  uploadDoctorAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    return (
      await api.post('/doctor/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },

  getDoctorCompletionStatus: async () => (await api.get('/doctor/completion-status')).data,

  changeDoctorPassword: async (payload) => (await api.post('/doctor/change-password', payload)).data,

  // Dashboard
  getDoctorDashboardOverview: async (optionalDate) =>
    (await api.get('/doctor/dashboard/overview', buildQuery({ date: optionalDate }))).data,

  // Appointments
  getDoctorAppointments: async (query = {}) => (await api.get('/doctor/appointments', buildQuery(query))).data,

  updateAppointmentStatus: async (id, payload) =>
    (await api.patch(`/doctor/appointments/${id}/status`, payload)).data,

  // Booking Requests
  getBookingRequests: async (query = {}) =>
    (await api.get('/doctor/booking-requests', buildQuery(query))).data,

  approveBookingRequest: async (id) => (await api.post(`/doctor/booking-requests/${id}/approve`)).data,

  rejectBookingRequest: async (id, payload = {}) =>
    (await api.post(`/doctor/booking-requests/${id}/reject`, payload)).data,

  // Patients
  getDoctorPatients: async (query = {}) => (await api.get('/doctor/patients', buildQuery(query))).data,

  getPatientClinicalSummary: async (patientId) =>
    (await api.get(`/doctor/patients/${patientId}/clinical-summary`)).data,

  getPatientMedicalRecords: async (patientId, query = {}) =>
    (await api.get(`/doctor/patients/${patientId}/medical-records`, buildQuery(query))).data,

  // Working Hours
  getWorkingHours: async () => (await api.get('/doctor/working-hours')).data,

  updateWorkingHours: async (payload) => (await api.put('/doctor/working-hours', payload)).data,

  // Notifications
  getUnreadNotificationsCount: async () => (await api.get('/doctor/notifications/unread-count')).data,

  getDoctorNotifications: async (query = {}) =>
    (await api.get('/doctor/notifications', buildQuery(query))).data,

  markNotificationRead: async (id) => (await api.patch(`/doctor/notifications/${id}/read`)).data,

  markAllNotificationsRead: async () => (await api.patch('/doctor/notifications/read-all')).data,

  // Medical Records + Prescriptions
  createDoctorMedicalRecord: async (patientId, payload) => {
    const hasFile = payload?.attachment instanceof File;

    if (!hasFile) {
      return (await api.post(`/doctor/patients/${patientId}/medical-records`, payload)).data;
    }

    const formData = toFormData(payload, ['attachment']);
    return (
      await api.post(`/doctor/patients/${patientId}/medical-records`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },

  createPrescription: async (recordId, payload) => {
    const hasFile = payload?.attachment instanceof File;

    if (!hasFile) {
      return (await api.post(`/doctor/medical-records/${recordId}/prescription`, payload)).data;
    }

    const formData = toFormData(payload, ['attachment']);
    return (
      await api.post(`/doctor/medical-records/${recordId}/prescription`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    ).data;
  },

  getMedicalRecordDetails: async (recordId) =>
    (await api.get(`/doctor/medical-records/${recordId}`)).data,

  getDoctorMedicalRecordsArchive: async (query = {}) =>
    (await api.get('/doctor/medical-records/archive', buildQuery(query))).data,
};

export default doctorApi;
