import axios from 'axios';

// إنشاء instance من axios
const api = axios.create({
  baseURL: 'http://localhost:8000/api', // تأكد من تطابق المنفذ مع Laravel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // لأننا نستخدم token
});

// إضافة token تلقائياً لكل request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
    
    // ⚠️ FRONTEND DEVELOPMENT MODE: No auto-redirect, just log errors
    if (error.response?.status === 401 && !isAuthEndpoint) {
      console.warn('🚫 401 Unauthorized - Backend not available (FRONTEND DEV MODE)');
      // DISABLED: localStorage.removeItem('token');
      // DISABLED: localStorage.removeItem('user');
      // DISABLED: window.location.href = '/auth';
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
  getDoctors: async () => {
    const response = await api.get('/patient/doctors');
    return response.data;
  },

  // احجز موعد
  bookAppointment: async (data) => {
    const response = await api.post('/patient/appointments', data);
    return response.data;
  },

  // احصل على مواعيدي
  getMyAppointments: async () => {
    const response = await api.get('/patient/appointments');
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
  rejectDoctor: async (id) => {
    const response = await api.post(`/admin/doctors/${id}/reject`);
    return response.data;
  },

  // احصل على جميع المستخدمين
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
};

export default api;
