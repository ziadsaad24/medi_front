import axios from 'axios';

// إنشاء instance من axios
const api = axios.create({
  // Use same-origin /api in dev to avoid CORS preflight overhead.
  baseURL:
    (import.meta.env?.DEV
      ? '/api'
      : import.meta.env?.VITE_API_BASE_URL) || 'https://medicareback-production.up.railway.app/',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // لأننا نستخدم token
});

const normalizeToken = (rawToken) => {
  if (!rawToken || rawToken === 'undefined' || rawToken === 'null') return null;
  return String(rawToken).replace(/^Bearer\s+/i, '').trim();
};

const requestCache = new Map();

const CACHE_TTL = {
  doctors: 60 * 1000,
  availability: 45 * 1000,
  appointments: 5 * 1000,
  notifications: 20 * 1000,
};

const stableSerialize = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(',')}]`;
  }

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${key}:${stableSerialize(value[key])}`)
    .join('|')}}`;
};

const getCacheScope = () => {
  const token = normalizeToken(localStorage.getItem('token')) || 'anon';
  const userId = (() => {
    try {
      const rawUser = localStorage.getItem('user');
      if (!rawUser) return 'anon';
      return JSON.parse(rawUser)?.id || 'anon';
    } catch {
      return 'anon';
    }
  })();

  return `${userId}:${token}`;
};

const buildCacheKey = (resource, params = {}) => {
  return `${getCacheScope()}:${resource}:${stableSerialize(params)}`;
};

const getCachedValue = (key, ttlMs) => {
  const cached = requestCache.get(key);
  if (!cached) return null;

  if (Date.now() - cached.timestamp > ttlMs) {
    requestCache.delete(key);
    return null;
  }

  return cached.value;
};

const setCachedValue = (key, value) => {
  requestCache.set(key, {
    value,
    timestamp: Date.now(),
  });
};

const invalidateScopedCache = (resourcePrefixes = []) => {
  const scope = `${getCacheScope()}:`;

  Array.from(requestCache.keys()).forEach((key) => {
    if (!key.startsWith(scope)) return;

    if (resourcePrefixes.length === 0) {
      requestCache.delete(key);
      return;
    }

    const resourceHit = resourcePrefixes.some((resource) => key.includes(`:${resource}:`));
    if (resourceHit) {
      requestCache.delete(key);
    }
  });
};

export const clearApiCache = () => {
  requestCache.clear();
};

// إضافة token تلقائياً لكل request
api.interceptors.request.use(
  (config) => {
    const token = normalizeToken(localStorage.getItem('token'));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// معالجة الأخطاء تلقائياً
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 🚫 TEMPORARILY DISABLED - Auto redirect on 401 - RESTORE: See RESTORE_INSTRUCTIONS.md
    // إذا كان unauthorized، احذف token وأعد توجيه للـ login
    // لكن استثني صفحات login و register
    const isAuthEndpoint = error.config?.url?.includes('/login') || 
                           error.config?.url?.includes('/register');
    
    // عند انتهاء الجلسة/توكن غير صالح: نظّف الحالة المحلية وأبلغ الواجهة.
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('doctor-profile')) {
          localStorage.removeItem(key);
        }
      });
      Object.keys(sessionStorage).forEach((key) => {
        sessionStorage.removeItem(key);
      });

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('auth:unauthenticated', {
          detail: error.response?.data,
        }));
      }
    }

    const isDoctorEndpoint = error.config?.url?.includes('/doctor/');
    const code = error.response?.data?.code;

    if (isDoctorEndpoint && code === 'PROFILE_INCOMPLETE' && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('doctor:profile-incomplete', {
          detail: error.response?.data,
        })
      );
    }

    return Promise.reject(error);
  }
);
// دوال الـ Authentication
export const authAPI = {
  // تسجيل مستخدم جديد (Patient)
  registerPatient: async (data) => {
    const response = await api.post('/register', {
      ...data,
      role: 'patient',
    });
    return response.data;
  },

  // تسجيل طبيب جديد (Doctor) - مع ملف الترخيص
  registerDoctor: async (formData) => {
    const response = await api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // تسجيل دخول
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },

  // تسجيل خروج
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  // الحصول على معلومات المستخدم الحالي
  getCurrentUser: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  // إعادة إرسال رسالة التحقق من الإيميل
  resendVerificationEmail: async (email) => {
    const response = await api.post('/email/resend', { email });
    return response.data;
  },

  // التحقق من الإيميل
  verifyEmail: async ({ id, hash, expires, signature }) => {
    const response = await api.get(`/email/verify/${id}/${hash}`, {
      params: { expires, signature }
    });
    return response.data;
  },

  // إرسال طلب استعادة كلمة المرور
  forgotPassword: async (email) => {
    const response = await api.post('/password/forgot', { email });
    return response.data;
  },

  // إعادة تعيين كلمة المرور
  resetPassword: async (data) => {
    const response = await api.post('/password/reset', data);
    return response.data;
  },
};

// دوال للمرضى (Patient Routes)
export const patientAPI = {
  // احصل على قائمة الأطباء
  getDoctors: async (params = {}) => {
    const cacheKey = buildCacheKey('patient:doctors', params);
    const cached = getCachedValue(cacheKey, CACHE_TTL.doctors);
    if (cached) return cached;

    const response = await api.get('/patient/doctors', { params });
    setCachedValue(cacheKey, response.data);
    return response.data;
  },

  // احصل على مواعيد الطبيب المتاحة في يوم محدد
  getDoctorAvailability: async (doctorId, date) => {
    const cacheKey = buildCacheKey('patient:availability', { doctorId, date });
    const cached = getCachedValue(cacheKey, CACHE_TTL.availability);
    if (cached) return cached;

    const response = await api.get(`/patient/doctors/${doctorId}/availability`, {
      params: { date },
    });
    setCachedValue(cacheKey, response.data);
    return response.data;
  },

  // =========================
  // Patient Profile
  // =========================

  // احصل على ملفي الشخصي
  getProfile: async () => {
    try {
      const response = await api.get('/patient/profile');
      return response.data;
    } catch (error) {
      // Mock data عندما تكون API غير متوفرة
      console.log('🔄 Using mock profile data - API not available');
      return {
        data: {
          id: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).id : '1',
          medical_card_id: JSON.parse(localStorage.getItem('user') || '{}').medical_card_id || '6',
          name: JSON.parse(localStorage.getItem('user') || '{}').name || 'أحمد محمد علي',
          email: JSON.parse(localStorage.getItem('user') || '{}').email || 'ahmed@example.com',
          phone: '01012345678',
          birth_date: '1995-05-15',
          address: 'القاهرة، مصر',
          blood_type: 'A+',
          emergency_contact: '01098765432',
          emergency_name: 'محمد علي (الأخ)',
          allergies: 'حساسية من البنسلين',
          chronic_diseases: 'لا يوجد',
          height: '175',
          weight: '75',
        }
      };
    }
  },

  // تحديث ملفي الشخصي
  updateProfile: async (data) => {
    try {
      const response = await api.put('/patient/profile', data);
      return response.data;
    } catch (error) {
      console.log('🔄 Profile updated locally - API not available');
      // حفظ البيانات في localStorage كبديل
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email,
        phone: data.phone,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { data: { success: true, message: 'تم الحفظ محلياً' } };
    }
  },

  // احجز موعد
  bookAppointment: async (data) => {
    const response = await api.post('/patient/appointments', data);
    return response.data;
  },

  // إنشاء طلب حجز (متوافق مع Dashboard الطبيب)
  createBookingRequest: async (data) => {
    const response = await api.post('/patient/booking-requests', data);
    invalidateScopedCache([
      'patient:appointments',
      'patient:notifications',
      'patient:notifications-upcoming',
      'patient:availability',
      'patient:doctors',
    ]);
    return response.data;
  },

  // احصل على مواعيدي
  getMyAppointments: async (options = {}) => {
    const { forceRefresh = false } = options;
    const cacheKey = buildCacheKey('patient:appointments');
    if (!forceRefresh) {
      const cached = getCachedValue(cacheKey, CACHE_TTL.appointments);
      if (cached) return cached;
    }

    const response = await api.get('/patient/appointments');
    setCachedValue(cacheKey, response.data);
    return response.data;
  },

  // =========================
  // Medical Records
  // =========================

  createMedicalRecord: async (payload) => {
    const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
    const response = await api.post('/patient/medical-records', payload, isFormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined);
    return response.data;
  },

  getMedicalRecords: async (params = {}) => {
    const response = await api.get('/patient/medical-records', { params });
    return response.data;
  },

  getMedicalRecord: async (recordId) => {
    const response = await api.get(`/patient/medical-records/${recordId}`);
    return response.data;
  },

  deleteMedicalRecord: async (recordId) => {
    const response = await api.delete(`/patient/medical-records/${recordId}`);
    return response.data;
  },

  rotateMedicalRecordsShareToken: async (payload = {}) => {
    const response = await api.post('/patient/medical-records/share-token/rotate', payload);
    return response.data;
  },

  revokeMedicalRecordsShareToken: async () => {
    const response = await api.delete('/patient/medical-records/share-token');
    return response.data;
  },

  getPublicPatientRecordsByToken: async (token) => {
    const response = await api.get(`/public/patients/${token}/medical-records`);
    return response.data;
  },

  // إشعارات المريض
  getPatientNotifications: async (params = {}) => {
    const cacheKey = buildCacheKey('patient:notifications', params);
    const cached = getCachedValue(cacheKey, CACHE_TTL.notifications);
    if (cached) return cached;

    const response = await api.get('/patient/notifications', { params });
    setCachedValue(cacheKey, response.data);
    return response.data;
  },

  // =========================
  // Medications
  // =========================

  // احصل على الأدوية الخاصة بي
  getMedications: async () => {
    try {
      const response = await api.get('/patient/medications');
      return response.data;
    } catch (error) {
      console.log('🔄 Using local medications - API not available');
      // سيعود الكود للـ useState fallback في use-medications.ts
      throw error;
    }
  },

  // إضافة دواء جديد
  addMedication: async (data) => {
    try {
      const response = await api.post('/patient/medications', data);
      return response.data;
    } catch (error) {
      console.log('🔄 Medication saved locally - API not available');
      return { 
        data: { 
          id: Date.now().toString(), 
          ...data, 
          message: 'تم الحفظ محلياً' 
        } 
      };
    }
  },

  // تحديث دواء
  updateMedication: async (id, data) => {
    try {
      const response = await api.put(`/patient/medications/${id}`, data);
      return response.data;
    } catch (error) {
      console.log('🔄 Medication updated locally - API not available');
      return { 
        data: { 
          id, 
          ...data, 
          message: 'تم التحديث محلياً' 
        } 
      };
    }
  },

  // تبديل حالة أخذ الدواء
  toggleMedication: async (id) => {
    try {
      const response = await api.patch(`/patient/medications/${id}/toggle`);
      return response.data;
    } catch (error) {
      console.log('🔄 Medication toggled locally - API not available');
      return { data: { id, message: 'تم التحديث محلياً' } };
    }
  },

  // حذف دواء
  deleteMedication: async (id) => {
    try {
      const response = await api.delete(`/patient/medications/${id}`);
      return response.data;
    } catch (error) {
      console.log('🔄 Medication deleted locally - API not available');
      return { data: { message: 'تم الحذف محلياً' } };
    }
  },

  // =========================
  // Notifications
  // =========================

  markPatientNotificationRead: async (id) => {
    const runWithFallback = async (attempts) => {
      let lastHttpError = null;

      for (const attempt of attempts) {
        try {
          return await attempt();
        } catch (error) {
          const status = error?.response?.status;
          if (status === 404 || status === 405) {
            lastHttpError = error;
            continue;
          }
          throw error;
        }
      }

      if (lastHttpError) throw lastHttpError;
      throw new Error('Unable to mark notification as read');
    };

    const response = await runWithFallback([
      () => api.patch(`/patient/notifications/${id}/read`),
      () => api.post(`/patient/notifications/${id}/read`),
      () => api.patch('/patient/notifications/read', { id }),
    ]);

    invalidateScopedCache([
      'patient:notifications',
      'patient:notifications-upcoming',
    ]);
    return response.data;
  },

  deleteAllPatientNotifications: async () => {
    const response = await api.delete('/patient/notifications');
    invalidateScopedCache([
      'patient:notifications',
      'patient:notifications-upcoming',
    ]);
    return response.data;
  },

  markAllPatientNotificationsRead: async () => {
    const runWithFallback = async (attempts) => {
      let lastHttpError = null;

      for (const attempt of attempts) {
        try {
          return await attempt();
        } catch (error) {
          const status = error?.response?.status;
          if (status === 404 || status === 405) {
            lastHttpError = error;
            continue;
          }
          throw error;
        }
      }

      if (lastHttpError) throw lastHttpError;
      throw new Error('Unable to mark all notifications as read');
    };

    const response = await runWithFallback([
      () => api.patch('/patient/notifications/read-all'),
      () => api.post('/patient/notifications/read-all'),
    ]);

    invalidateScopedCache([
      'patient:notifications',
      'patient:notifications-upcoming',
    ]);
    return response.data;
  },

  // التنبيهات القادمة (دواء/موعد)
  getUpcomingNotifications: async () => {
    const cacheKey = buildCacheKey('patient:notifications-upcoming');
    const cached = getCachedValue(cacheKey, CACHE_TTL.notifications);
    if (cached) return cached;

    const response = await api.get('/patient/notifications/upcoming');
    setCachedValue(cacheKey, response.data);
    return response.data;
  },

  // =========================
  // Patient Complaints
  // =========================

  // احصل على شكاوى المريض
  getComplaints: async () => {
    const response = await api.get('/patient/complaints');
    return response.data;
  },

  // أضف شكوى جديدة
  addComplaint: async (data) => {
    const response = await api.post('/patient/complaints', data);
    return response.data;
  },

  // احذف شكوى
  deleteComplaint: async (id) => {
    const response = await api.delete(`/patient/complaints/${id}`);
    return response.data;
  },
};

// دوال للأطباء (Doctor Routes)
export const doctorAPI = {
  // احصل على مواعيدي كطبيب
  getMyAppointments: async () => {
    const response = await api.get('/doctor/appointments');
    return response.data;
  },

  // تحديث حالة موعد
  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/doctor/appointments/${id}`, { status });
    return response.data;
  },

  // تحديث ملفي الشخصي
  updateProfile: async (data) => {
    const response = await api.put('/doctor/profile', data);
    return response.data;
  },
};

// دوال للمسؤولين (Admin Routes)
export const adminAPI = {
  // احصل على إحصائيات Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // احصل على جميع الأطباء المعلقين (pending)
  getPendingDoctors: async () => {
    const response = await api.get('/admin/doctors/pending');
    return response.data;
  },

  // موافقة على طبيب
  approveDoctor: async (id) => {
    const response = await api.post(`/admin/doctors/${id}/approve`);
    return response.data;
  },

  // رفض طبيب
  rejectDoctor: async (id, reason) => {
    const response = await api.post(`/admin/doctors/${id}/reject`, { reason });
    return response.data;
  },

  // احصل على جميع المستخدمين
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // احصل على جميع الأطباء
  getAllDoctors: async (params) => {
    const response = await api.get('/admin/doctors', { params });
    return response.data;
  },

  // حذف مستخدم
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // حظر/إلغاء حظر مستخدم
  toggleUserStatus: async (id) => {
    const response = await api.post(`/admin/users/${id}/toggle-status`);
    return response.data;
  },

  // احصل على الشكاوى
  getComplaints: async () => {
    const response = await api.get('/admin/complaints');
    return response.data;
  },

  // تحديث حالة شكوى
  updateComplaintStatus: async (id, status) => {
    const response = await api.patch(`/admin/complaints/${id}/status`, { status });
    return response.data;
  },

  // حذف شكوى
  deleteComplaint: async (id) => {
    const response = await api.delete(`/admin/complaints/${id}`);
    return response.data;
  },

  // احصل على الإعدادات
  getSettings: async () => {
    const response = await api.get('/admin/settings');
    return response.data;
  },

  // تحديث الإعدادات
  updateSettings: async (category, settings) => {
    const response = await api.put(`/admin/settings/${category}`, settings);
    return response.data;
  },

  // احصل على السجلات
  getActivityLogs: async (params) => {
    const response = await api.get('/admin/activity-logs', { params });
    return response.data;
  },

  // احصل على التقارير
  getReports: async (type, startDate, endDate) => {
    const response = await api.get('/admin/reports', {
      params: { type, startDate, endDate }
    });
    return response.data;
  },
};

// دوال الشكاوى العامة
export const complaintAPI = {
  // كل الشكاوى
  getComplaints: async () => {
    const response = await api.get('/complaints');
    return response.data;
  },

  // إضافة شكوى
  createComplaint: async (data) => {
    const response = await api.post('/complaints', data);
    return response.data;
  },

  // تفاصيل شكوى
  getComplaint: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // تحديث شكوى
  updateComplaint: async (id, data) => {
    const response = await api.put(`/complaints/${id}`, data);
    return response.data;
  },

  // حذف شكوى
  deleteComplaint: async (id) => {
    const response = await api.delete(`/complaints/${id}`);
    return response.data;
  },
};

// Gemini Chat API
export const geminiChatAPI = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/gemini-chat', { message });
      return response.data?.reply || 'لم يتم الحصول على رد من الذكاء الاصطناعي.';
    } catch (error) {
      return (
        error?.response?.data?.reply ||
        error?.response?.data?.message ||
        'تعذر الاتصال بخدمة الذكاء الاصطناعي حالياً.'
      );
    }
  },
};

export default api;
