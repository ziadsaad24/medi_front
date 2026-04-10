import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMedicalRecords } from '../hooks/useMedicalRecords';
import { useAuth } from '../context/AuthContext';
import api, { patientAPI } from '../services/api';

const EmergencyCardDemo = () => {
  const { token } = useParams();
  const isPublicView = Boolean(token);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getUserRecords, deleteRecordById, refreshRecords } = useMedicalRecords();
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [privatePatient, setPrivatePatient] = useState(null);
  const [publicPatient, setPublicPatient] = useState(null);
  const [publicRecords, setPublicRecords] = useState([]);
  const [recordDetailsMap, setRecordDetailsMap] = useState({});
  const [previewState, setPreviewState] = useState({
    open: false,
    src: '',
    name: '',
    isPdf: false,
  });

  const records = isPublicView ? publicRecords : getUserRecords();

  const normalizeMedications = (record) => {
    if (Array.isArray(record)) {
      return record.map((med, index) => ({
        id: String(med?.id || med?.medication_id || index + 1),
        medicationName: med?.medicationName || med?.medication_name || med?.name || med?.drug_name || 'دواء',
        dosage: med?.dosage || '',
        frequency: med?.frequency || '',
        duration: med?.duration || '',
        instructions: med?.instructions || med?.Instructions || '',
        route: med?.route || '',
      }));
    }

    const candidates =
      record?.medications ||
      record?.medication_items ||
      record?.prescription_items ||
      record?.prescriptionItems ||
      record?.items ||
      record?.prescription?.items ||
      record?.prescription?.medications ||
      record?.prescription?.data ||
      record?.prescriptions ||
      record?.data?.items ||
      record?.data?.prescription?.items ||
      [];

    const list = Array.isArray(candidates) ? candidates : [];

    return list.map((med, index) => ({
      id: String(med?.id || med?.medication_id || index + 1),
      medicationName: med?.medicationName || med?.medication_name || med?.name || med?.drug_name || 'دواء',
      dosage: med?.dosage || '',
      frequency: med?.frequency || '',
      duration: med?.duration || '',
      instructions: med?.instructions || med?.Instructions || '',
      route: med?.route || '',
    }));
  };

  const fetchPrescriptionFallback = async (recordId, prescriptionId) => {
    const endpoints = [
      `/patient/medical-records/${recordId}/prescription`,
      `/patient/medical-records/${recordId}/prescriptions`,
      `/patient/prescriptions/${recordId}`,
      prescriptionId ? `/patient/prescriptions/${prescriptionId}/items` : null,
      prescriptionId ? `/patient/prescriptions/${prescriptionId}` : null,
      `/public/medical-records/${recordId}/prescription`,
      `/public/medical-records/${recordId}/prescriptions`,
    ].filter(Boolean);

    for (const endpoint of endpoints) {
      try {
        const response = await api.get(endpoint);
        const payload = response?.data || response || {};
        const meds = normalizeMedications(payload);
        if (meds.length > 0) return meds;
      } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 405 || status === 403) {
          continue;
        }
      }
    }

    return [];
  };

  const pickFirstValue = (...values) => {
    const found = values.find((v) => v !== undefined && v !== null && String(v).trim() !== '');
    return found ?? null;
  };

  const normalizePublicPatient = (payload) => {
    const patientRaw =
      payload?.patient ||
      payload?.data?.patient ||
      payload?.patient_summary ||
      payload?.data?.patient_summary ||
      payload?.patientInfo ||
      payload?.data?.patientInfo ||
      payload?.user ||
      payload?.data?.user ||
      null;

    if (!patientRaw) return null;

    return {
      name: pickFirstValue(patientRaw?.name, patientRaw?.full_name, patientRaw?.patient_name),
      phone: pickFirstValue(patientRaw?.phone, patientRaw?.phone_number, patientRaw?.mobile),
      blood_type: pickFirstValue(patientRaw?.blood_type, patientRaw?.bloodType, patientRaw?.blood_group),
      allergies: pickFirstValue(patientRaw?.allergies, patientRaw?.allergy_notes, patientRaw?.medical_allergies),
      medical_card_id: pickFirstValue(patientRaw?.medical_card_id, patientRaw?.medicalCardId, patientRaw?.card_id),
    };
  };

  const normalizePublicRecords = (payload) => {
    const list =
      payload?.records ||
      payload?.data?.records ||
      payload?.timeline ||
      payload?.data?.timeline ||
      payload?.items ||
      payload?.data?.items ||
      [];

    return (Array.isArray(list) ? list : []).map((item, idx) => {
      const attachment =
        item?.attachment ||
        item?.file ||
        (Array.isArray(item?.attachments) ? item.attachments[0] : null) ||
        null;

      const fileUrl =
        attachment?.file_url ||
        attachment?.url ||
        attachment?.public_url ||
        attachment?.download_url ||
        null;

      const fileName = attachment?.original_name || attachment?.name || 'medical-file';
      const mimeType = attachment?.mime_type || '';
      const source = item?.source || item?.entry_source || 'patient_upload';
      const diagnosis = item?.diagnosis || item?.medical_diagnosis || '';
      const chiefComplaint = item?.chief_complaint || item?.chiefComplaint || '';
      const clinicalNotes = item?.clinical_notes || item?.clinicalNotes || '';
      const instructions = item?.instructions || item?.doctor_instructions || '';
      const visitDate = item?.visit_date || item?.visitDate || '';
      const medicationsCount = Number(item?.medications_count || item?.medicationsCount || 0);
      const medications = normalizeMedications(item);

      return {
        id: String(item?.record_id || item?.id || idx + 1),
        createdAt: item?.created_at || item?.createdAt || new Date().toISOString(),
        notes: item?.notes || clinicalNotes || '',
        source,
        doctorName: item?.doctor_name || item?.doctorName || null,
        diagnosis,
        chiefComplaint,
        clinicalNotes,
        instructions,
        visitDate,
        medicationsCount: medications.length > 0 ? medications.length : medicationsCount,
        medications,
        files: fileUrl
          ? [
              {
                id: String(attachment?.id || item?.record_id || 'file'),
                name: fileName,
                data: fileUrl,
                type: mimeType.includes('pdf') ? 'pdf' : item?.category || 'file',
              },
            ]
          : [],
      };
    });
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoadError('');
      try {
        if (isPublicView && token) {
          const response = await patientAPI.getPublicPatientRecordsByToken(token);
          const payload = response?.data || response || {};
          const patient = normalizePublicPatient(payload);
          const normalized = normalizePublicRecords(payload);

          if (isMounted) {
            setPublicPatient(patient);
            setPublicRecords(normalized);
          }
        } else {
          await refreshRecords();

          try {
            const profileResponse = await api.get('/patient/profile');
            const profilePayload = profileResponse?.data?.data || profileResponse?.data || null;
            if (isMounted && profilePayload) {
              setPrivatePatient(profilePayload);
            }
          } catch {
            // Keep UI usable if profile endpoint fails temporarily.
          }
        }
      } catch (error) {
        if (isMounted) {
          const status = error?.response?.status;
          if (status === 404) {
            setLoadError('الرابط غير صالح.');
          } else if (status === 410) {
            setLoadError('الرابط غير نشط أو منتهي الصلاحية.');
          } else {
            setLoadError('تعذر تحميل السجلات حالياً.');
          }
        }
      } finally {
        if (isMounted) setLoadingRecords(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [isPublicView, token]);

  useEffect(() => {
    if (isPublicView) return;

    const doctorRecordsNeedingDetails = records.filter((record) => {
      const source = String(record?.source || '').toLowerCase();
      const isDoctorRecord = ['doctor', 'doctor_entry', 'doctor-entry', 'doctorentry'].includes(source);
      const hasMeds = Array.isArray(record?.medications) && record.medications.length > 0;
      const hasChecked = Boolean(recordDetailsMap[String(record?.id)]?.checked);

      return isDoctorRecord && !hasMeds && !hasChecked;
    });

    if (doctorRecordsNeedingDetails.length === 0) return;

    let active = true;

    const loadDetails = async () => {
      const results = await Promise.allSettled(
        doctorRecordsNeedingDetails.map(async (record) => {
          const response = await patientAPI.getMedicalRecord(record.id);
          const payload = response?.data || response || {};
          const detailedRecord = payload?.record || payload?.data?.record || payload;

          let medications = normalizeMedications(detailedRecord);

          if (medications.length === 0) {
            const prescriptionId =
              detailedRecord?.prescription_id ||
              detailedRecord?.prescriptionId ||
              detailedRecord?.prescription?.id ||
              null;

            medications = await fetchPrescriptionFallback(record.id, prescriptionId);
          }

          return {
            recordId: String(record.id),
            medications,
          };
        })
      );

      if (!active) return;

      const nextMap = {};

      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') return;

        const sourceRecord = doctorRecordsNeedingDetails[index];
        const medications = result.value?.medications || [];
        nextMap[String(sourceRecord.id)] = {
          checked: true,
          medications,
          medicationsCount: medications.length,
        };
      });

      if (Object.keys(nextMap).length > 0) {
        setRecordDetailsMap((prev) => ({ ...prev, ...nextMap }));
      }
    };

    loadDetails();

    return () => {
      active = false;
    };
  }, [isPublicView, records, recordDetailsMap]);

  const latestRecord = records[0] || null;
  const sourcePatient = isPublicView ? publicPatient : (privatePatient || user || {});

  const patientInfo = {
    name: sourcePatient?.name || 'غير متاح',
    phone: sourcePatient?.phone || sourcePatient?.phone_number || 'غير متاح',
    bloodType: sourcePatient?.blood_type || sourcePatient?.bloodType || 'غير مسجل',
    allergies: sourcePatient?.allergies || (latestRecord?.notes ? 'مذكورة داخل آخر ملاحظات طبية' : 'لا توجد حساسية مسجلة'),
    medicalCardId: sourcePatient?.medical_card_id || sourcePatient?.medicalCardId || 'غير متاح',
  };

  const timelineRecords = records.map((record, idx) => {
    const firstFile = Array.isArray(record?.files) ? record.files[0] : null;
    const isDoctorRecord = ['doctor', 'doctor_entry', 'doctor-entry'].includes(String(record?.source || '').toLowerCase());
    const detailOverride = recordDetailsMap[String(record?.id)] || null;
    const mergedMedications = Array.isArray(record?.medications) && record.medications.length > 0
      ? record.medications
      : (detailOverride?.medications || []);
    const mergedMedicationsCount = mergedMedications.length > 0
      ? mergedMedications.length
      : Number(record?.medicationsCount || detailOverride?.medicationsCount || 0);

    return {
      id: record.id,
      date: record?.createdAt
        ? new Date(record.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
        : '--',
      type: 'patient_upload',
      title: firstFile?.name || 'سجل طبي بدون مرفق',
      uploadedBy: isDoctorRecord ? (record?.doctorName || 'الطبيب') : 'المريض',
      isDoctorRecord,
      file: firstFile?.name || null,
      fileData: firstFile?.data || null,
      fileSize: firstFile?.data ? `${Math.max(1, Math.round(firstFile.data.length / 1024))} KB` : '--',
      notes: record?.notes || '',
      rawRecordId: record.id,
      order: idx + 1,
      source: record?.source || 'patient_upload',
      doctorName: record?.doctorName || null,
      diagnosis: record?.diagnosis || '',
      chiefComplaint: record?.chiefComplaint || '',
      clinicalNotes: record?.clinicalNotes || '',
      instructions: record?.instructions || '',
      visitDate: record?.visitDate || '',
      medicationsCount: mergedMedicationsCount,
      medications: mergedMedications,
    };
  });

  const handleOpenFile = (record) => {
    if (!record?.fileData) {
      window.alert('لا يوجد ملف مرفوع في هذا السجل.');
      return;
    }

    const fileName = String(record?.file || '').toLowerCase();
    const isPdf = fileName.endsWith('.pdf') || String(record.fileData).startsWith('data:application/pdf');

    setPreviewState({
      open: true,
      src: record.fileData,
      name: record.file || 'ملف طبي',
      isPdf,
    });
  };

  const handleDelete = async (recordId) => {
    const accepted = window.confirm('هل تريد حذف هذا السجل الطبي نهائياً؟');
    if (!accepted) return;

    const deleted = await deleteRecordById(recordId);
    if (!deleted) {
      window.alert('تعذر حذف السجل. تأكد أنك صاحب السجل.');
      return;
    }
  };

  if (!isPublicView && !user) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#020617_55%,_#01020f_100%)] text-white" dir="rtl">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center space-y-4">
          <h1 className="text-3xl font-black">سجلاتي الطبية</h1>
          <p className="text-slate-300">يلزم تسجيل الدخول لعرض وإدارة السجلات الطبية.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors font-bold"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e3a8a_0%,_#020617_55%,_#01020f_100%)] text-white" dir="rtl">
      <div className="pointer-events-none fixed top-20 right-[-8%] h-80 w-80 rounded-full blur-[120px] bg-blue-500/25" />
      <div className="pointer-events-none fixed bottom-10 left-[-8%] h-80 w-80 rounded-full blur-[120px] bg-violet-500/20" />

      <div className="max-w-4xl mx-auto p-6 relative z-10">
        <div className="mb-6 -mx-2 md:-mx-4 lg:-mx-6 xl:-mx-10">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-r from-[#224999]/90 via-[#1c408b]/90 to-[#173773]/90 backdrop-blur-2xl shadow-[0_30px_80px_rgba(2,12,40,0.45)] max-w-7xl mx-auto">
            <div className="pointer-events-none absolute -top-24 left-10 h-56 w-56 rounded-full bg-cyan-300/20 blur-[120px]" />

            <div className="relative px-5 py-4 md:px-7 md:py-5 lg:px-8 lg:py-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">بيانات المريض</h1>
                  <p className="mt-1 text-sm text-blue-100/85">
                    {isPublicView
                      ? 'عرض معلومات الحالة عبر رابط QR.'
                      : 'معلومات محدثة مباشرة من حساب المريض.'}
                  </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/40 bg-cyan-400/10 px-3 py-2 text-sm font-bold text-cyan-100 shadow-lg shadow-cyan-900/20">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  رقم البطاقة: {patientInfo.medicalCardId}
                </div>
              </div>
            </div>
          </section>

          <section className="max-w-7xl mx-auto mt-4 md:mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
              <article className="rounded-2xl border border-white/20 bg-white/[0.06] p-4 md:p-5 backdrop-blur-xl transition-all hover:bg-white/[0.10] hover:-translate-y-0.5">
                <p className="text-xs text-blue-100/70 mb-1.5">اسم المريض</p>
                <p className="text-lg md:text-xl font-extrabold text-white break-words leading-tight">{patientInfo.name}</p>
              </article>

              <article className="rounded-2xl border border-white/20 bg-white/[0.06] p-4 md:p-5 backdrop-blur-xl transition-all hover:bg-white/[0.10] hover:-translate-y-0.5">
                <p className="text-xs text-blue-100/70 mb-1.5">رقم الهاتف</p>
                <p className="text-lg md:text-xl font-extrabold text-white" dir="ltr">{patientInfo.phone}</p>
              </article>

              <article className="rounded-2xl border border-cyan-200/35 bg-gradient-to-br from-cyan-400/15 to-blue-400/10 p-4 md:p-5 backdrop-blur-xl transition-all hover:brightness-110 hover:-translate-y-0.5">
                <p className="text-xs text-cyan-100/90 mb-1.5">فصيلة الدم</p>
                <p className="text-xl md:text-2xl font-black text-cyan-50">{patientInfo.bloodType}</p>
              </article>

              <article className="rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-400/12 to-yellow-400/8 p-4 md:p-5 backdrop-blur-xl transition-all hover:brightness-110 hover:-translate-y-0.5">
                <p className="text-xs text-amber-100/90 mb-1.5">تنبيه الحساسية</p>
                <p className="text-sm md:text-base font-bold text-amber-50 break-words leading-7">{patientInfo.allergies}</p>
              </article>
            </div>
          </section>
        </div>

        <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-3 md:p-4 backdrop-blur-xl shadow-[0_12px_40px_rgba(8,15,35,0.35)]">
          {!isPublicView ? (
            <div className="flex gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => navigate('/recorded')}
                className="flex-1 min-w-[220px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3.5 px-4 rounded-xl font-black transition-all duration-300 shadow-xl shadow-blue-900/30 border border-blue-300/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>📤</span>
                إنشاء سجل جديد
              </button>

              <button
                type="button"
                onClick={() => navigate('/patient/home')}
                className="flex-1 min-w-[220px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-3.5 px-4 rounded-xl font-black transition-all duration-300 shadow-xl shadow-emerald-900/30 border border-emerald-300/20 hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <span>🏠</span>
                الرجوع للرئيسية
              </button>
            </div>
          ) : (
            <p className="text-center text-sm md:text-base text-cyan-200 font-black">
              وضع عرض فقط عبر QR: يمكنك مشاهدة السجلات والملفات فقط.
            </p>
          )}

          <p className="mt-3 text-center text-xs md:text-sm text-slate-300">
            إجمالي السجلات المتاحة الآن: <span className="font-black text-cyan-200">{timelineRecords.length}</span>
          </p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-3xl font-black text-white flex items-center justify-center gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]">
            <span>📋</span>
            السجل الطبي الموحد
          </h2>
          <p className="mt-2 text-blue-100/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.16)]">سجل زمني واضح لكل الملفات والملاحظات الطبية الخاصة بك.</p>
        </div>

        {loadingRecords ? (
          <div className="mt-8 bg-white/5 border border-white/15 rounded-2xl p-6 text-center backdrop-blur-xl">
            <p className="text-slate-100 font-black">جارٍ تحميل السجلات...</p>
          </div>
        ) : loadError ? (
          <div className="mt-8 bg-rose-500/10 border border-rose-300/25 rounded-2xl p-6 text-center backdrop-blur-xl">
            <p className="text-rose-200 font-black">{loadError}</p>
          </div>
        ) : timelineRecords.length === 0 ? (
          <div className="mt-8 bg-white/5 border border-white/15 rounded-2xl p-6 text-center backdrop-blur-xl">
            <p className="text-slate-100 font-black">لا توجد سجلات حالياً</p>
            <p className="text-slate-400 text-sm mt-1">ارفع أول سجل من صفحة السجل الطبي وسيظهر هنا بنفس التصميم.</p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute right-8 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-300 via-violet-300 to-emerald-300 opacity-80"></div>

            {timelineRecords.map((record) => (
              <div key={record.id} className="relative mb-6 mr-16">
                <div className={`absolute -right-[4.5rem] top-6 w-6 h-6 rounded-full border-4 shadow-lg ${record.isDoctorRecord ? 'bg-emerald-400 border-emerald-100 shadow-emerald-900/50' : 'bg-cyan-400 border-cyan-100 shadow-cyan-900/50'}`}></div>

                <div className="rounded-2xl shadow-xl overflow-hidden border border-white/15 transition-all hover:shadow-2xl hover:scale-[1.01] bg-white/5 backdrop-blur-2xl">
                  <div className={`px-6 py-3 ${record.isDoctorRecord ? 'bg-gradient-to-r from-emerald-700 to-teal-700' : 'bg-gradient-to-r from-cyan-600 to-blue-700'}`}>
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{record.isDoctorRecord ? '🩺' : '📄'}</span>
                        <div>
                          <h3 className="text-lg font-black">{record.title}</h3>
                          <p className="text-xs opacity-90">🗓️ {record.date}</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full text-xs font-black bg-black/25 border border-white/20">
                        {record.isDoctorRecord ? `🩺 سجل طبي بواسطة الطبيب #${record.order}` : `👤 رفع شخصي #${record.order}`}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-3 bg-slate-900/40 rounded-xl p-4 border border-white/10">
                      <span className="text-3xl">👤</span>
                      <div>
                        <p className="text-xs text-slate-400">رفع بواسطة</p>
                        <p className="font-black text-slate-100">{record.uploadedBy}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/40 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-2xl">📎</span>
                          <span className="font-black text-slate-100 truncate">{record.file || 'بدون مرفق'}</span>
                        </div>
                        <span className="text-sm text-slate-400 whitespace-nowrap">{record.fileSize}</span>
                      </div>

                      {record.notes && (
                        <div className="mt-3 bg-blue-500/10 p-3 rounded-lg border border-blue-300/25">
                          <p className="text-xs text-blue-200 mb-1">📝 ملاحظات</p>
                          <p className="text-sm text-slate-200 leading-7">{record.notes}</p>
                        </div>
                      )}

                      {record.isDoctorRecord && (
                        <div className="mt-3 rounded-lg border border-emerald-300/30 bg-gradient-to-br from-emerald-500/14 to-teal-500/10 p-3 space-y-2">
                          <p className="text-sm text-emerald-50 mb-1 font-extrabold tracking-wide">🩺 بيانات أضافها الطبيب</p>
                          {record.chiefComplaint && (
                            <p className="text-sm text-emerald-100"><span className="font-extrabold text-emerald-50">سبب الزيارة:</span> {record.chiefComplaint}</p>
                          )}
                          {record.diagnosis && (
                            <p className="text-sm text-emerald-100"><span className="font-extrabold text-emerald-50">التشخيص:</span> {record.diagnosis}</p>
                          )}
                          {record.instructions && (
                            <p className="text-sm text-emerald-100"><span className="font-extrabold text-emerald-50">تعليمات الطبيب:</span> {record.instructions}</p>
                          )}
                          {record.visitDate && (
                            <p className="text-sm text-emerald-100"><span className="font-extrabold text-emerald-50">تاريخ الزيارة:</span> {record.visitDate}</p>
                          )}
                          {record.medicationsCount > 0 && (
                            <p className="text-sm text-emerald-100"><span className="font-extrabold text-emerald-50">عدد الأدوية:</span> {record.medicationsCount}</p>
                          )}

                          {Array.isArray(record.medications) && record.medications.length > 0 && (
                            <div className="mt-2 rounded-lg border border-emerald-200/20 bg-emerald-400/10 p-3">
                              <p className="inline-flex items-center gap-1.5 text-sm text-emerald-50 mb-2 font-extrabold tracking-wide bg-emerald-300/15 border border-emerald-200/25 px-2.5 py-1 rounded-lg">
                                📋 الروشتة المضافة
                              </p>
                              <div className="space-y-2">
                                {record.medications.map((med, medIndex) => (
                                  <div key={med.id || medIndex} className="text-sm text-emerald-50/95 leading-7 border-b border-emerald-100/10 pb-2 last:border-b-0 last:pb-0">
                                    <p><span className="font-extrabold text-emerald-50">{medIndex + 1}. {med.medicationName}</span></p>
                                    {(med.dosage || med.frequency || med.duration) && (
                                      <p>
                                        {[med.dosage, med.frequency, med.duration].filter(Boolean).join(' - ')}
                                      </p>
                                    )}
                                    {med.route && <p><span className="font-semibold text-emerald-100">طريقة الاستخدام:</span> {med.route}</p>}
                                    {med.instructions && <p><span className="font-semibold text-emerald-100">تعليمات:</span> {med.instructions}</p>}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenFile(record)}
                        className="flex-1 min-w-[120px] bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 px-4 rounded-lg font-black transition-all"
                      >
                        عرض الملف
                      </button>
                      {!isPublicView && (
                        <button
                          type="button"
                          onClick={() => handleDelete(record.rawRecordId)}
                          disabled={record.isDoctorRecord}
                          className="flex-1 min-w-[120px] bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white py-2 px-4 rounded-lg font-black transition-all"
                        >
                          {record.isDoctorRecord ? 'لا يمكن حذف سجل الطبيب' : 'حذف السجل'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 bg-cyan-500/10 border border-cyan-300/25 rounded-xl p-4 text-center">
          <p className="text-cyan-200 font-black">{isPublicView ? 'أنت في صفحة عرض السجلات عبر QR' : 'تقدر من هنا تعرض وتحذف سجلاتك الطبية بسهولة'}</p>
          <p className="text-slate-300 text-sm mt-1">{isPublicView ? 'الوضع الحالي للعرض فقط: لا يمكن إنشاء أو حذف السجلات.' : 'روابط QR وصفحة عرض السجل مخصصة للعرض فقط بدون تعديل.'}</p>
        </div>
      </div>

      {previewState.open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4" dir="rtl">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setPreviewState({ open: false, src: '', name: '', isPdf: false })}
          />
          <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-white/15 bg-slate-950/95 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="text-sm md:text-base font-black text-slate-100 truncate">{previewState.name}</h3>
              <button
                type="button"
                onClick={() => setPreviewState({ open: false, src: '', name: '', isPdf: false })}
                className="px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold bg-white/10 hover:bg-white/20 text-slate-100"
              >
                إغلاق
              </button>
            </div>

            <div className="p-3 md:p-4 h-[75vh] overflow-auto bg-slate-900/70">
              {previewState.isPdf ? (
                <iframe
                  title="file-preview"
                  src={previewState.src}
                  className="w-full h-full min-h-[520px] rounded-xl border border-white/10"
                />
              ) : (
                <img
                  src={previewState.src}
                  alt={previewState.name}
                  className="max-w-full max-h-full mx-auto rounded-xl border border-white/10 object-contain"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyCardDemo;
