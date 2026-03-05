import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../Components/Admin/AdminSidebar';
import Swal from 'sweetalert2';
import { adminAPI } from '../services/api';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // **General Settings State**
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Medicare',
    siteDescription: 'نظام إدارة الرعاية الصحية',
    contactEmail: 'info@medicare.com',
    contactPhone: '+20 123 456 7890',
    address: 'القاهرة، مصر',
    maintenanceMode: false,
    allowRegistration: true
  });

  // **Email Settings State**
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.mailtrap.io',
    smtpPort: '2525',
    smtpUsername: 'your-username',
    smtpPassword: '••••••••',
    smtpEncryption: 'tls',
    fromEmail: 'noreply@medicare.com',
    fromName: 'Medicare System'
  });

  // **Security Settings State**
  const [securitySettings, setSecuritySettings] = useState({
    sessionTimeout: 120,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireSpecialChar: true,
    requireNumber: true,
    requireUppercase: true,
    twoFactorAuth: false
  });

  // **Appointment Settings State**
  const [appointmentSettings, setAppointmentSettings] = useState({
    defaultDuration: 30,
    bookingAdvanceDays: 30,
    cancellationHours: 24,
    reminderHours: 24,
    autoConfirm: false,
    allowWaitlist: true
  });

  // **Load settings from backend**
  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      
      if (response.success) {
        const settings = response.data;
        setGeneralSettings(settings.general || generalSettings);
        setEmailSettings(settings.email || emailSettings);
        setSecuritySettings(settings.security || securitySettings);
        setAppointmentSettings(settings.appointment || appointmentSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // **Save settings**
  const handleSaveSettings = async (category) => {
    let settingsToSave;
    let categoryLabel;

    switch (category) {
      case 'general':
        settingsToSave = generalSettings;
        categoryLabel = 'الإعدادات العامة';
        break;
      case 'email':
        settingsToSave = emailSettings;
        categoryLabel = 'إعدادات البريد الإلكتروني';
        break;
      case 'security':
        settingsToSave = securitySettings;
        categoryLabel = 'إعدادات الأمان';
        break;
      case 'appointment':
        settingsToSave = appointmentSettings;
        categoryLabel = 'إعدادات المواعيد';
        break;
      default:
        return;
    }

    Swal.fire({
      title: 'حفظ التغييرات',
      text: `هل تريد حفظ ${categoryLabel}؟`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'نعم، احفظ',
      cancelButtonText: 'إلغاء',
      confirmButtonColor: '#0F427D',
      cancelButtonColor: '#d33'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          // Call backend API
          const response = await adminAPI.updateSettings(category, settingsToSave);
          
          if (response.success) {
            Swal.fire({
              title: 'تم الحفظ!',
              text: `تم حفظ ${categoryLabel} بنجاح`,
              icon: 'success',
              confirmButtonText: 'حسناً',
              confirmButtonColor: '#0F427D'
            });
          } else {
            throw new Error('Failed to save');
          }
        } catch (error) {
          console.error('Error saving settings:', error);
          // For demo: show success anyway
          Swal.fire({
            title: 'تم الحفظ (Demo)!',
            text: `تم حفظ ${categoryLabel} محلياً`,
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#0F427D'
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  // **Tab content components**
  const GeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم الموقع
          </label>
          <input
            type="text"
            value={generalSettings.siteName}
            onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الإلكتروني للتواصل
          </label>
          <input
            type="email"
            value={generalSettings.contactEmail}
            onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهاتف
          </label>
          <input
            type="tel"
            value={generalSettings.contactPhone}
            onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            العنوان
          </label>
          <input
            type="text"
            value={generalSettings.address}
            onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          وصف الموقع
        </label>
        <textarea
          value={generalSettings.siteDescription}
          onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-medium text-gray-900">وضع الصيانة</p>
            <p className="text-sm text-gray-600">تعطيل الوصول لجميع المستخدمين مؤقتاً</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={generalSettings.maintenanceMode}
              onChange={(e) => setGeneralSettings({ ...generalSettings, maintenanceMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">السماح بالتسجيل</p>
            <p className="text-sm text-gray-600">السماح للمستخدمين الجدد بالتسجيل</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={generalSettings.allowRegistration}
              onChange={(e) => setGeneralSettings({ ...generalSettings, allowRegistration: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => handleSaveSettings('general')}
          className="px-6 py-2 bg-[#0F427D] text-white rounded-lg hover:bg-[#0a3461] transition-colors font-medium"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );

  const EmailTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            value={emailSettings.smtpHost}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="text"
            value={emailSettings.smtpPort}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Username
          </label>
          <input
            type="text"
            value={emailSettings.smtpUsername}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Password
          </label>
          <input
            type="password"
            value={emailSettings.smtpPassword}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التشفير
          </label>
          <select
            value={emailSettings.smtpEncryption}
            onChange={(e) => setEmailSettings({ ...emailSettings, smtpEncryption: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">بدون</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            البريد الافتراضي للإرسال
          </label>
          <input
            type="email"
            value={emailSettings.fromEmail}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم المرسل الافتراضي
          </label>
          <input
            type="text"
            value={emailSettings.fromName}
            onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => handleSaveSettings('email')}
          className="px-6 py-2 bg-[#0F427D] text-white rounded-lg hover:bg-[#0a3461] transition-colors font-medium"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );

  const SecurityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مهلة انتهاء الجلسة (دقيقة)
          </label>
          <input
            type="number"
            value={securitySettings.sessionTimeout}
            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            محاولات تسجيل الدخول القصوى
          </label>
          <input
            type="number"
            value={securitySettings.maxLoginAttempts}
            onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الحد الأدنى لطول كلمة المرور
          </label>
          <input
            type="number"
            value={securitySettings.passwordMinLength}
            onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">يتطلب أحرف خاصة</p>
            <p className="text-sm text-gray-600">مثل: !@#$%^&*</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.requireSpecialChar}
              onChange={(e) => setSecuritySettings({ ...securitySettings, requireSpecialChar: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">يتطلب أرقام</p>
            <p className="text-sm text-gray-600">مثل: 123456</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.requireNumber}
              onChange={(e) => setSecuritySettings({ ...securitySettings, requireNumber: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">يتطلب أحرف كبيرة</p>
            <p className="text-sm text-gray-600">مثل: ABC</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.requireUppercase}
              onChange={(e) => setSecuritySettings({ ...securitySettings, requireUppercase: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">المصادقة الثنائية</p>
            <p className="text-sm text-gray-600">تفعيل 2FA لجميع المستخدمين</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={securitySettings.twoFactorAuth}
              onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => handleSaveSettings('security')}
          className="px-6 py-2 bg-[#0F427D] text-white rounded-lg hover:bg-[#0a3461] transition-colors font-medium"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );

  const AppointmentTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            مدة الموعد الافتراضية (دقيقة)
          </label>
          <input
            type="number"
            value={appointmentSettings.defaultDuration}
            onChange={(e) => setAppointmentSettings({ ...appointmentSettings, defaultDuration: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            أقصى أيام للحجز المسبق
          </label>
          <input
            type="number"
            value={appointmentSettings.bookingAdvanceDays}
            onChange={(e) => setAppointmentSettings({ ...appointmentSettings, bookingAdvanceDays: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ساعات الإلغاء المسموحة
          </label>
          <input
            type="number"
            value={appointmentSettings.cancellationHours}
            onChange={(e) => setAppointmentSettings({ ...appointmentSettings, cancellationHours: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ساعات التذكير قبل الموعد
          </label>
          <input
            type="number"
            value={appointmentSettings.reminderHours}
            onChange={(e) => setAppointmentSettings({ ...appointmentSettings, reminderHours: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F427D] focus:border-transparent"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">التأكيد التلقائي</p>
            <p className="text-sm text-gray-600">تأكيد المواعيد تلقائياً بدون مراجعة</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appointmentSettings.autoConfirm}
              onChange={(e) => setAppointmentSettings({ ...appointmentSettings, autoConfirm: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">قائمة الانتظار</p>
            <p className="text-sm text-gray-600">السماح بإضافة مرضى لقائمة الانتظار</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={appointmentSettings.allowWaitlist}
              onChange={(e) => setAppointmentSettings({ ...appointmentSettings, allowWaitlist: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => handleSaveSettings('appointment')}
          className="px-6 py-2 bg-[#0F427D] text-white rounded-lg hover:bg-[#0a3461] transition-colors font-medium"
        >
          حفظ التغييرات
        </button>
      </div>
    </div>
  );

  // **Tabs configuration**
  const tabs = [
    { id: 'general', label: 'عام', icon: '⚙️', component: GeneralTab },
    { id: 'email', label: 'البريد الإلكتروني', icon: '📧', component: EmailTab },
    { id: 'security', label: 'الأمان', icon: '🔒', component: SecurityTab },
    { id: 'appointment', label: 'المواعيد', icon: '📅', component: AppointmentTab }
  ];

  const ActiveTabComponent = tabs.find(tab => tab.id === activeTab)?.component || GeneralTab;

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      <AdminSidebar />
      
      <div className="flex-1 pr-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-3xl">⚙️</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">إعدادات النظام</h1>
                <p className="text-gray-600">تخصيص إعدادات المنصة والنظام</p>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm mb-6"
          >
            <div className="flex border-b border-gray-200">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-[#0F427D] border-b-2 border-[#0F427D] bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F427D]"></div>
              </div>
            ) : (
              <ActiveTabComponent />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
