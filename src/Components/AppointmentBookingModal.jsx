import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarCheck, Clock3, Stethoscope, RefreshCcw, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { patientAPI } from '../services/api';

const APPOINTMENT_TYPES = [
  {
    key: 'new',
    label: 'كشف',
    description: 'زيارة أولى وتشخيص مبدئي كامل',
    icon: Stethoscope,
  },
  {
    key: 'follow_up',
    label: 'مراجعة',
    description: 'متابعة علاج أو مراجعة نتائج',
    icon: RefreshCcw,
  },
];

const ARABIC_WEEK_DAYS = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const ARABIC_MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];

function formatDateLabel(date) {
  const dayName = ARABIC_WEEK_DAYS[date.getDay()];
  const day = date.getDate();
  const month = ARABIC_MONTHS[date.getMonth()];
  return `${dayName} - ${day} ${month}`;
}

function toDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generateCandidateDates(days = 14) {
  const result = [];
  const now = new Date();

  for (let i = 0; i < days; i += 1) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);

    result.push({
      key: toDateKey(date),
      label: formatDateLabel(date),
      isToday: i === 0,
    });
  }

  return result;
}

async function fetchAvailabilityForDate(doctorId, dateKey) {
  const response = await patientAPI.getDoctorAvailability(doctorId, dateKey);
  const slots = Array.isArray(response?.data?.slots)
    ? response.data.slots
    : Array.isArray(response?.slots)
      ? response.slots
      : [];

  return slots
    .map((slot) => ({
      time: slot.time || slot.slot_time || slot.value || '',
      available: Boolean(slot.available ?? slot.is_available ?? true),
    }))
    .filter((slot) => slot.time);
}

async function fetchDatesBatch(doctorId, batch) {
  const results = await Promise.all(
    batch.map(async (item) => {
      try {
        const slots = await fetchAvailabilityForDate(doctorId, item.key);
        return { item, slots };
      } catch {
        return { item, slots: [] };
      }
    })
  );

  const map = {};
  const dates = [];

  results.forEach(({ item, slots }) => {
    map[item.key] = slots;
    if (slots.some((s) => s.available)) {
      dates.push(item);
    }
  });

  return { map, dates };
}

export default function AppointmentBookingModal({ isOpen, doctor, onClose, onBooked }) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState('');
  const [dateKey, setDateKey] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [availableDates, setAvailableDates] = useState([]);
  const [datesLoading, setDatesLoading] = useState(false);
  const [availabilityMap, setAvailabilityMap] = useState({});
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setAppointmentType('');
    setDateKey('');
    setTimeSlot('');
    setReason('');
    setSubmitting(false);
    setSubmitError('');
    setAvailableDates([]);
    setDatesLoading(false);
    setAvailabilityMap({});
    setSlotsLoading(false);
    setSlotsError('');
    setAvailableSlots([]);
  }, [isOpen, doctor?.id]);

  useEffect(() => {
    if (!isOpen || !doctor?.id) return;

    let active = true;

    const preloadAvailableDates = async () => {
      setDatesLoading(true);

      const candidates = generateCandidateDates(14);
      const firstBatch = candidates.slice(0, 7);
      const secondBatch = candidates.slice(7);

      try {
        const first = await fetchDatesBatch(doctor.id, firstBatch);

        if (!active) return;
        setAvailabilityMap(first.map);
        setAvailableDates(first.dates);
        setDatesLoading(false);

        if (secondBatch.length === 0) return;

        const second = await fetchDatesBatch(doctor.id, secondBatch);
        if (!active) return;

        setAvailabilityMap((prev) => ({ ...prev, ...second.map }));
        setAvailableDates((prev) => {
          const merged = [...prev, ...second.dates];
          return Array.from(new Map(merged.map((item) => [item.key, item])).values());
        });
      } finally {
        if (active) setDatesLoading(false);
      }
    };

    preloadAvailableDates();

    return () => {
      active = false;
    };
  }, [isOpen, doctor?.id]);

  useEffect(() => {
    if (!isOpen || !doctor?.id || !dateKey) {
      setAvailableSlots([]);
      return;
    }

    if (Array.isArray(availabilityMap[dateKey]) && availabilityMap[dateKey].length > 0) {
      setAvailableSlots(availabilityMap[dateKey]);
      return;
    }

    let active = true;

    const loadAvailability = async () => {
      setSlotsLoading(true);
      setSlotsError('');

      try {
        const normalized = await fetchAvailabilityForDate(doctor.id, dateKey);

        if (!active) return;
        setAvailableSlots(normalized);
        setAvailabilityMap((prev) => ({ ...prev, [dateKey]: normalized }));
      } catch (error) {
        if (!active) return;
        setSlotsError(error?.response?.data?.message || 'تعذر تحميل المواعيد المتاحة لهذا اليوم');
        setAvailableSlots([]);
      } finally {
        if (active) setSlotsLoading(false);
      }
    };

    loadAvailability();

    return () => {
      active = false;
    };
  }, [isOpen, doctor?.id, dateKey, availabilityMap]);

  const canGoNext =
    (step === 1 && Boolean(appointmentType)) ||
    (step === 2 && Boolean(dateKey)) ||
    (step === 3 && Boolean(timeSlot));

  const handleSubmit = async () => {
    if (!doctor?.id || !appointmentType || !dateKey || !timeSlot) return;

    setSubmitting(true);
    setSubmitError('');

    const payload = {
      doctor_id: doctor.id,
      appointment_type: appointmentType,
      requested_date: dateKey,
      requested_time: timeSlot,
      reason: reason.trim() || (appointmentType === 'new' ? 'كشف جديد' : 'مراجعة'),
    };

    try {
      await patientAPI.createBookingRequest(payload);
      onBooked?.({ success: true, doctorName: doctor.name, ...payload });
      onClose();
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'تعذر إرسال الحجز حالياً');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          dir="rtl"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden ${
              isDark
                ? 'bg-slate-900 border-white/15 text-white'
                : 'bg-white border-[#0f427d]/15 text-[#0f427d]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`px-5 py-4 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-[#0f427d]/10'}`}>
              <div>
                <h3 className="font-black text-xl">حجز موعد مع {doctor?.name}</h3>
                <p className={`text-sm ${isDark ? 'text-white/65' : 'text-[#0f427d]/65'}`}>{doctor?.specialty}</p>
              </div>
              <button
                onClick={onClose}
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-[#0f427d]/10 hover:bg-[#0f427d]/15'}`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-5 pt-4 pb-2">
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className={`h-1.5 rounded-full ${step >= n ? 'bg-gradient-to-r from-blue-700 to-cyan-600' : isDark ? 'bg-white/15' : 'bg-[#0f427d]/12'}`} />
                ))}
              </div>
            </div>

            <div className="p-5 min-h-[360px]">
              {step === 1 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">1) اختار نوع الموعد</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {APPOINTMENT_TYPES.map((type) => {
                      const Icon = type.icon;
                      const selected = appointmentType === type.key;

                      return (
                        <button
                          key={type.key}
                          onClick={() => setAppointmentType(type.key)}
                          className={`text-right p-4 rounded-2xl border transition-all ${
                            selected
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : isDark
                                ? 'border-white/15 bg-white/5 hover:bg-white/10'
                                : 'border-[#0f427d]/15 bg-[#0f427d]/[0.03] hover:bg-[#0f427d]/[0.06]'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Icon size={18} className="text-cyan-400" />
                            <span className="font-black">{type.label}</span>
                          </div>
                          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-[#0f427d]/70'}`}>{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">2) اختار اليوم المناسب</h4>
                  {datesLoading && (
                    <div className={`text-sm ${isDark ? 'text-white/70' : 'text-[#0f427d]/70'}`}>
                      جارٍ تحميل الأيام المتاحة من جدول الطبيب...
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto pr-1">
                    {availableDates.map((item) => {
                      const selected = dateKey === item.key;

                      return (
                        <button
                          key={item.key}
                          onClick={() => {
                            setDateKey(item.key);
                            setTimeSlot('');
                          }}
                          className={`text-right p-3 rounded-2xl border transition-all ${
                            selected
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : isDark
                                ? 'border-white/15 bg-white/5 hover:bg-white/10'
                                : 'border-[#0f427d]/15 bg-[#0f427d]/[0.03] hover:bg-[#0f427d]/[0.06]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold">{item.label}</span>
                            {item.isToday && (
                              <span className="text-[11px] px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400">اليوم</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!datesLoading && availableDates.length === 0 && (
                    <div className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      لا توجد أيام متاحة حالياً لهذا الطبيب.
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">3) اختار الساعة المتاحة</h4>
                  {slotsLoading && (
                    <div className={`text-sm ${isDark ? 'text-white/70' : 'text-[#0f427d]/70'}`}>جارٍ تحميل المواعيد المتاحة...</div>
                  )}
                  {slotsError && (
                    <div className="text-sm rounded-xl px-3 py-2 bg-rose-500/20 border border-rose-400/30 text-rose-300">
                      {slotsError}
                    </div>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {availableSlots.map((slot) => {
                      const selected = timeSlot === slot.time;

                      return (
                        <button
                          key={slot.time}
                          onClick={() => setTimeSlot(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 rounded-2xl border font-semibold transition-all ${
                            selected
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                              : !slot.available
                                ? isDark
                                  ? 'border-white/10 bg-white/5 text-white/40 cursor-not-allowed'
                                  : 'border-[#0f427d]/10 bg-[#0f427d]/[0.02] text-[#0f427d]/40 cursor-not-allowed'
                              : isDark
                                ? 'border-white/15 bg-white/5 hover:bg-white/10'
                                : 'border-[#0f427d]/15 bg-[#0f427d]/[0.03] hover:bg-[#0f427d]/[0.06]'
                          }`}
                        >
                          <span className="inline-flex items-center justify-center gap-2">
                            <Clock3 size={14} />
                            {slot.time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {!slotsLoading && !slotsError && availableSlots.length === 0 && (
                    <div className={`text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                      لا توجد مواعيد متاحة في هذا اليوم.
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-lg">4) راجع بيانات الحجز</h4>
                  <div className={`rounded-2xl border p-4 space-y-2 ${isDark ? 'border-white/15 bg-white/5' : 'border-[#0f427d]/15 bg-[#0f427d]/[0.03]'}`}>
                    <p><span className="font-bold">الطبيب:</span> {doctor?.name}</p>
                    <p><span className="font-bold">نوع الموعد:</span> {appointmentType === 'new' ? 'كشف' : 'مراجعة'}</p>
                    <p><span className="font-bold">اليوم:</span> {availableDates.find((d) => d.key === dateKey)?.label || dateKey}</p>
                    <p><span className="font-bold">الساعة:</span> {timeSlot}</p>
                  </div>

                  <div>
                    <label className={`block mb-2 text-sm font-bold ${isDark ? 'text-white/80' : 'text-[#0f427d]/80'}`}>سبب الزيارة (اختياري)</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="اكتب سبب الزيارة أو الأعراض بإيجاز"
                      rows={4}
                      className={`w-full rounded-2xl px-4 py-3 border outline-none ${isDark ? 'bg-slate-950 border-white/15 text-white placeholder:text-white/40' : 'bg-white border-[#0f427d]/15 text-[#0f427d] placeholder:text-[#0f427d]/40'}`}
                    />
                  </div>

                  {submitError && (
                    <div className="text-sm rounded-xl px-3 py-2 bg-rose-500/20 border border-rose-400/30 text-rose-300">
                      {submitError}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={`px-5 py-4 border-t flex items-center justify-between ${isDark ? 'border-white/10' : 'border-[#0f427d]/10'}`}>
              <button
                onClick={() => (step === 1 ? onClose() : setStep((s) => Math.max(1, s - 1)))}
                className={`px-4 py-2 rounded-xl font-bold inline-flex items-center gap-2 ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-[#0f427d]/10 hover:bg-[#0f427d]/15'}`}
                disabled={submitting}
              >
                <ArrowRight size={16} />
                رجوع
              </button>

              {step < 4 ? (
                <button
                  onClick={() => canGoNext && setStep((s) => Math.min(4, s + 1))}
                  disabled={!canGoNext}
                  className="px-5 py-2 rounded-xl font-bold text-white inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: 'var(--app-primary)',
                    boxShadow: '0 10px 22px color-mix(in srgb, var(--app-primary) 28%, transparent)'
                  }}
                >
                  التالي
                  <ArrowLeft size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl font-bold text-white inline-flex items-center gap-2 disabled:opacity-60"
                  style={{
                    backgroundColor: 'var(--app-primary)',
                    boxShadow: '0 10px 22px color-mix(in srgb, var(--app-primary) 28%, transparent)'
                  }}
                >
                  <CalendarCheck size={16} />
                  {submitting ? 'جارٍ تأكيد الحجز...' : 'تأكيد الحجز'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
