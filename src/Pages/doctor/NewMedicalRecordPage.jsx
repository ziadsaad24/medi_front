import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  Droplets,
  ShieldAlert,
  Stethoscope,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  Pill,
} from 'lucide-react';
import DoctorLayout from '../../Components/DoctorLayout';
import { useTheme } from '../../context/ThemeContext';
import { useDoctorWorkflow } from '../../context/DoctorWorkflowContext';
import doctorApi from '../../services/doctorApi';

const createMedication = () => ({
  medicationName: '',
  dosage: '',
  frequency: '',
  duration: '',
  instructions: '',
});

export default function NewMedicalRecordPage() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { startConsultation, completeConsultation, currentConsultationContext } = useDoctorWorkflow();

  const appointmentContext = location.state?.appointmentContext || currentConsultationContext;
  const hasValidAppointmentContext = Boolean(
    appointmentContext?.appointmentId &&
      appointmentContext?.patientId &&
      !String(appointmentContext.appointmentId).startsWith('A-')
  );

  const [formData, setFormData] = useState({
    visitDate: appointmentContext?.requestedDate || '',
    chiefComplaint: appointmentContext?.reason || '',
    clinicalNotes: '',
    diagnosis: '',
    doctorInstructions: '',
    followUpDate: '',
  });

  const [medications, setMedications] = useState([createMedication()]);
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [snapshotError, setSnapshotError] = useState('');
  const [patientSnapshot, setPatientSnapshot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!hasValidAppointmentContext) return;

    startConsultation(appointmentContext.appointmentId).catch(() => {
      // Submit flow handles backend validation errors.
    });
  }, [appointmentContext?.appointmentId, hasValidAppointmentContext, startConsultation]);

  useEffect(() => {
    const patientId = appointmentContext?.patientId;
    if (!patientId) return;

    const loadSnapshot = async () => {
      setSnapshotLoading(true);
      setSnapshotError('');
      try {
        const response = await doctorApi.getPatientClinicalSummary(patientId);
        const data = response?.data || response || {};
        setPatientSnapshot({
          age: data.age || '-',
          bloodType: data.bloodType || data.blood_type || '-',
          allergies: data.allergies || '-',
          chronicDiseases: data.chronicDiseases || data.chronic_diseases || '-',
          emergencyContactName: data.emergencyContactName || data.emergency_contact_name || '-',
          emergencyContactPhone: data.emergencyContactPhone || data.emergency_contact_phone || '-',
        });
      } catch {
        setSnapshotError('تعذر تحميل الملخص الطبي للمريض حالياً.');
      } finally {
        setSnapshotLoading(false);
      }
    };

    loadSnapshot();
  }, [appointmentContext?.patientId]);

  const snapshotView = useMemo(
    () =>
      patientSnapshot || {
        age: '-',
        bloodType: '-',
        allergies: '-',
        chronicDiseases: '-',
        emergencyContactName: '-',
        emergencyContactPhone: '-',
      },
    [patientSnapshot]
  );

  const updateMedication = (index, field, value) => {
    setMedications((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addMedication = () => setMedications((prev) => [...prev, createMedication()]);
  const removeMedication = (index) => {
    setMedications((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (!appointmentContext?.appointmentId) {
      setSubmitError('لا يمكن حفظ السجل الطبي لأن معرف الموعد غير متاح. ارجع إلى صفحة الطلبات أو لوحة التحكم ثم ابدأ الكشف مرة أخرى.');
      return;
    }

    const items = medications
      .filter((m) => m.medicationName.trim().length > 0)
      .map((m) => ({
        medicationName: m.medicationName,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration,
        instructions: m.instructions,
      }));

    try {
      setSubmitting(true);
      await completeConsultation({
        appointmentId: appointmentContext.appointmentId,
        patientId: appointmentContext.patientId,
        visitDate: formData.visitDate,
        chiefComplaint: formData.chiefComplaint,
        diagnosis: formData.diagnosis,
        clinicalNotes: formData.clinicalNotes,
        instructions: formData.doctorInstructions,
        medications: items,
      });

      navigate('/doctor/patients?tab=records', { replace: true });
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'تعذر حفظ السجل الطبي حالياً.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasValidAppointmentContext) {
    return (
      <DoctorLayout>
        <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-full theme-page">
          <div className={`max-w-3xl mx-auto rounded-3xl border shadow-2xl p-6 sm:p-8 ${isDark ? 'bg-slate-900/70 border-white/20 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
            <h2 className="text-2xl font-black mb-3">لا يمكن فتح السجل الطبي مباشرة</h2>
            <p className={`${isDark ? 'text-white/70' : 'text-[#0f427d]/70'} mb-6`}>
              ابدأ من موعد مقبول عبر زر "ابدأ الكشف" من لوحة التحكم أو صفحة الطلبات حتى يتم تحميل سياق الموعد الصحيح.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white font-bold"
              >
                <ArrowRight className="w-4 h-4" />
                العودة إلى لوحة التحكم
              </button>
              <button
                onClick={() => navigate('/doctor/requests')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold border ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/10'}`}
              >
                فتح صفحة الطلبات
              </button>
            </div>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="p-4 sm:p-6 md:p-8 lg:p-10 min-h-full theme-page space-y-6">
        <div className={`max-w-6xl mx-auto rounded-3xl border shadow-2xl p-5 sm:p-7 ${isDark ? 'bg-slate-900/70 border-white/20' : 'bg-white border-[#0f427d]/15'}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-black mb-2 ${isDark ? 'text-white' : 'text-[#0f427d]'}`}>
                إنشاء سجل طبي جديد
              </h1>
              <p className={`${isDark ? 'text-white/70' : 'text-[#0f427d]/70'}`}>
                للمريض: {appointmentContext.patientName} - {appointmentContext.patientId}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-[#0f427d]/10 text-[#0f427d] border border-[#0f427d]/20'}`}>
                <CalendarDays className="w-4 h-4" />
                {appointmentContext.requestedDate}
              </span>
              <span className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm ${isDark ? 'bg-white/10 text-white border border-white/20' : 'bg-[#0f427d]/10 text-[#0f427d] border border-[#0f427d]/20'}`}>
                <Clock3 className="w-4 h-4" />
                {appointmentContext.requestedTime}
              </span>
            </div>
          </div>
        </div>

        <div className={`max-w-6xl mx-auto rounded-3xl border shadow-2xl p-5 sm:p-7 ${isDark ? 'bg-amber-500/10 border-amber-300/30' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h2 className={`text-xl font-black ${isDark ? 'text-amber-200' : 'text-amber-800'}`}>ملخص طبي مهم قبل الكشف</h2>
          </div>

          {snapshotLoading && (
            <p className={`mb-3 text-sm ${isDark ? 'text-amber-100' : 'text-amber-800'}`}>جارٍ تحميل الملخص الطبي...</p>
          )}

          {snapshotError && (
            <p className={`mb-3 text-sm ${isDark ? 'text-rose-200' : 'text-rose-700'}`}>{snapshotError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>العمر</p>
              <p className="font-black text-lg">{snapshotView.age} سنة</p>
            </div>
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>فصيلة الدم</p>
              <p className="font-black text-lg flex items-center gap-2"><Droplets className="w-4 h-4 text-red-500" />{snapshotView.bloodType}</p>
            </div>
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>الحساسية</p>
              <p className="font-bold text-sm">{snapshotView.allergies}</p>
            </div>
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>الأمراض المزمنة</p>
              <p className="font-bold text-sm">{snapshotView.chronicDiseases}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>اسم جهة الاتصال للطوارئ</p>
              <p className="font-bold text-sm">{snapshotView.emergencyContactName}</p>
            </div>
            <div className={`rounded-2xl p-4 border ${isDark ? 'bg-slate-900/65 border-white/15 text-white' : 'bg-white border-[#0f427d]/15 text-[#0f427d]'}`}>
              <p className={`text-xs mb-1 ${isDark ? 'text-white/60' : 'text-[#0f427d]/60'}`}>هاتف الطوارئ</p>
              <p className="font-bold text-sm">{snapshotView.emergencyContactPhone}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={`max-w-6xl mx-auto rounded-3xl border shadow-2xl p-5 sm:p-7 space-y-6 ${isDark ? 'bg-slate-900/70 border-white/20' : 'bg-white border-[#0f427d]/15'}`}>
          <div className="flex items-center gap-3">
            <Stethoscope className={`w-6 h-6 ${isDark ? 'text-cyan-300' : 'text-[#0f427d]'}`} />
            <h2 className={`text-xl font-black ${isDark ? 'text-white' : 'text-[#0f427d]'}`}>بيانات الكشف</h2>
          </div>

          {submitError && (
            <div className={`rounded-xl border p-3 text-sm ${isDark ? 'bg-rose-900/35 border-rose-400/30 text-rose-200' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>تاريخ الكشف</label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData((prev) => ({ ...prev, visitDate: e.target.value }))}
                className="w-full rounded-xl p-3 theme-input"
              />
            </div>
            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>سبب الزيارة</label>
              <input
                value={formData.chiefComplaint}
                onChange={(e) => setFormData((prev) => ({ ...prev, chiefComplaint: e.target.value }))}
                className="w-full rounded-xl p-3 theme-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>ملاحظات سريرية</label>
              <textarea
                rows={4}
                value={formData.clinicalNotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, clinicalNotes: e.target.value }))}
                className="w-full rounded-xl p-3 theme-input"
              />
            </div>
            <div>
              <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>التشخيص</label>
              <textarea
                rows={4}
                value={formData.diagnosis}
                onChange={(e) => setFormData((prev) => ({ ...prev, diagnosis: e.target.value }))}
                className="w-full rounded-xl p-3 theme-input"
              />
            </div>
          </div>

          <div>
            <label className={`text-sm font-semibold mb-2 block ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>تعليمات الطبيب</label>
            <textarea
              rows={3}
              value={formData.doctorInstructions}
              onChange={(e) => setFormData((prev) => ({ ...prev, doctorInstructions: e.target.value }))}
              className="w-full rounded-xl p-3 theme-input"
            />
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-lg font-black flex items-center gap-2 ${isDark ? 'text-white' : 'text-[#0f427d]'}`}>
                <Pill className="w-5 h-5" />
                الروشتة والأدوية
              </h3>

              <button
                type="button"
                onClick={addMedication}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 text-white text-sm font-bold"
              >
                <Plus className="w-4 h-4" />
                إضافة دواء
              </button>
            </div>

            <div className="space-y-3">
              {medications.map((item, index) => (
                <div key={index} className={`rounded-2xl border p-3 sm:p-4 ${isDark ? 'bg-slate-800/60 border-white/15' : 'bg-[#0f427d]/5 border-[#0f427d]/15'}`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                    <input
                      placeholder="اسم الدواء"
                      value={item.medicationName}
                      onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                      className="rounded-xl p-3 theme-input lg:col-span-2"
                    />
                    <input
                      placeholder="الجرعة"
                      value={item.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      className="rounded-xl p-3 theme-input"
                    />
                    <input
                      placeholder="عدد المرات"
                      value={item.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      className="rounded-xl p-3 theme-input"
                    />
                    <input
                      placeholder="المدة"
                      value={item.duration}
                      onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                      className="rounded-xl p-3 theme-input"
                    />
                  </div>

                  <div className="mt-3 grid grid-cols-1 lg:grid-cols-6 gap-3">
                    <textarea
                      rows={2}
                      placeholder="تعليمات الدواء"
                      value={item.instructions}
                      onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                      className="rounded-xl p-3 theme-input lg:col-span-5"
                    />

                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="rounded-xl border border-red-400/40 text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/doctor/requests')}
              className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold border ${isDark ? 'border-white/20 text-white hover:bg-white/10' : 'border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/10'}`}
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-900 via-blue-800 to-cyan-700 shadow-lg"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'جارٍ الحفظ...' : 'حفظ السجل الطبي'}
            </button>
          </div>
        </form>

        <div className={`max-w-6xl mx-auto rounded-2xl border p-4 ${isDark ? 'bg-slate-900/50 border-white/15 text-white/70' : 'bg-white border-[#0f427d]/15 text-[#0f427d]/70'}`}>
          <p className="text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            بعد الحفظ يتم تحويل الموعد تلقائياً إلى كشف مكتمل ونقله إلى سجلات المرضى.
          </p>
        </div>
      </div>
    </DoctorLayout>
  );
}
