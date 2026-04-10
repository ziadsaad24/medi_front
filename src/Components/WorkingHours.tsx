import { useState } from 'react';
import { Clock, Plus, Trash2, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useEffect } from 'react';
import doctorApi from '../services/doctorApi';

interface TimeSlot { start: string; end: string; }
interface WorkingDay { day: string; enabled: boolean; slots: TimeSlot[]; }

export function WorkingHours() {
  const { isDark } = useTheme();
  const daysMap = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>([
    { day: 'السبت', enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الأحد', enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الاثنين', enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الثلاثاء', enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الأربعاء', enabled: true, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الخميس', enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
    { day: 'الجمعة', enabled: false, slots: [{ start: '09:00', end: '17:00' }] },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await doctorApi.getWorkingHours();
        const data = response?.data || response || {};
        const incomingDays = Array.isArray(data.days) ? data.days : [];

        if (incomingDays.length === 0) return;

        const mapped = incomingDays
          .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek)
          .map((d: any) => ({
            day: daysMap[Number(d.dayOfWeek) % 7] || 'غير معروف',
            enabled: Boolean(d.enabled),
            slots: (d.slots || []).map((s: any) => ({
              start: s.start,
              end: s.end,
            })),
          }));

        setWorkingDays(mapped);
      } catch {
        // Keep current local fallback
      }
    };

    load();
  }, []);

  const toggleDay = (index: number) => {
    const updated = [...workingDays];
    updated[index].enabled = !updated[index].enabled;
    setWorkingDays(updated);
  };

  const updateTimeSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
    const updated = [...workingDays];
    updated[dayIndex].slots[slotIndex][field] = value;
    setWorkingDays(updated);
  };

  const addTimeSlot = (dayIndex: number) => {
    const updated = [...workingDays];
    updated[dayIndex].slots.push({ start: '09:00', end: '17:00' });
    setWorkingDays(updated);
  };

  const removeTimeSlot = (dayIndex: number, slotIndex: number) => {
    const updated = [...workingDays];
    if (updated[dayIndex].slots.length > 1) {
      updated[dayIndex].slots.splice(slotIndex, 1);
      setWorkingDays(updated);
    }
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const payload = {
        days: workingDays.map((d) => ({
          dayOfWeek: daysMap.indexOf(d.day),
          enabled: d.enabled,
          slots: d.slots,
        })),
      };

      await doctorApi.updateWorkingHours(payload);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="theme-card backdrop-blur-md rounded-3xl shadow-2xl 
                    p-4 sm:p-6 md:p-8 lg:p-10 mb-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl backdrop-blur-xl border flex items-center justify-center shadow-lg ${isDark ? "bg-white/10 border-white/20" : "bg-[#0f427d]/10 border-[#0f427d]/20"}`}>
            <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${isDark ? "text-white" : "text-[#0f427d]"}`} />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold theme-title">أوقات العمل</h2>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl backdrop-blur-xl border transition-all text-sm sm:text-base ${isDark ? "bg-white/20 border-white/20 text-white hover:bg-white/30" : "bg-[#0f427d]/10 border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/15"}`}
          >
            <Edit3 className="w-4 h-4" />
            <span>تعديل</span>
          </button>
        )}
      </div>

      {/* Days */}
      <div className="space-y-4">
        {workingDays.map((day, dayIndex) => (
          <div
            key={day.day}
            className={`p-4 sm:p-5 rounded-2xl border transition-all ${
              day.enabled
                ? isDark
                  ? 'bg-slate-900/60 border-white/20 backdrop-blur-xl'
                  : 'bg-[#0f427d]/8 border-[#0f427d]/20 backdrop-blur-xl'
                : isDark
                  ? 'bg-slate-800/45 border-white/10 backdrop-blur-xl'
                  : 'bg-[#008080]/10 border-[#0f427d]/15 backdrop-blur-xl'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-3">
                {isEditing && (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={() => toggleDay(dayIndex)}
                      className="sr-only peer"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-all ${
                        isDark
                          ? "bg-white/20 peer-checked:bg-gradient-to-r peer-checked:from-blue-900 peer-checked:via-blue-800 peer-checked:to-cyan-700"
                          : "bg-slate-300 peer-checked:bg-gradient-to-r peer-checked:from-blue-900 peer-checked:via-blue-800 peer-checked:to-cyan-700"
                      } after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:start-[22px]`}
                    ></div>
                  </label>
                )}
                <span className={`font-semibold ${day.enabled ? (isDark ? 'text-white' : 'theme-title') : (isDark ? 'text-white/40' : 'text-[#0f427d]/40')} text-sm sm:text-base`}>
                  {day.day}
                </span>
              </div>

              {isEditing && day.enabled && (
                <button
                  onClick={() => addTimeSlot(dayIndex)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 border border-white/20 text-white hover:brightness-110 transition-all text-xs sm:text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة وقت</span>
                </button>
              )}
            </div>

            {/* Slots */}
            {day.enabled && (
              <div className="space-y-2 sm:space-y-3">
                {day.slots.map((slot, slotIndex) => (
                  <div key={slotIndex} className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl border ${isDark ? "bg-cyan-900/25 border-white/20" : "bg-[#008080]/8 border-[#0f427d]/20"}`}>
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                      <div className="flex-1">
                        <label className={`text-xs sm:text-sm mb-1 block ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>من</label>
                        <input
                          type="time"
                          value={slot.start}
                          disabled={!isEditing}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                          className="w-full px-3 sm:w-full sm:px-4 py-2 rounded-xl theme-input disabled:opacity-50"
                        />
                      </div>

                      <div className="flex-1">
                        <label className={`text-xs sm:text-sm mb-1 block ${isDark ? "text-white/70" : "text-[#0f427d]/70"}`}>إلى</label>
                        <input
                          type="time"
                          value={slot.end}
                          disabled={!isEditing}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 rounded-xl theme-input disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {isEditing && day.slots.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className={`p-2 rounded-xl border ${isDark ? "bg-white/10 border-white/20 text-white hover:bg-white/20" : "bg-[#0f427d]/8 border-[#0f427d]/20 text-[#0f427d] hover:bg-[#0f427d]/15"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            onClick={saveChanges}
            disabled={isSaving}
            className={`px-5 sm:px-6 py-2 sm:py-3 rounded-xl border shadow-lg transition-all font-medium text-sm sm:text-base ${isDark ? "bg-white/20 border-white/30 text-white hover:bg-white/30" : "bg-[#0f427d]/10 border-[#0f427d]/25 text-[#0f427d] hover:bg-[#0f427d]/15"}`}
          >
            {isSaving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      )}
    </div>
  );
}