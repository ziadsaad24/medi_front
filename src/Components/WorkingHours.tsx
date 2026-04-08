import { useState } from 'react';
import { Clock, Plus, Trash2, Edit3 } from 'lucide-react';

interface TimeSlot { start: string; end: string; }
interface WorkingDay { day: string; enabled: boolean; slots: TimeSlot[]; }

export function WorkingHours() {
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

  const saveChanges = () => setIsEditing(false);

  return (
    <div className="bg-gradient-to-l from-blue-950/95 via-blue-900/90 to-cyan-800/85 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl 
                    p-4 sm:p-6 md:p-8 lg:p-10 mb-8 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-lg">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">أوقات العمل</h2>
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30 transition-all text-sm sm:text-base"
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
                ? 'bg-blue-950/55 border-white/20 backdrop-blur-xl'
                : 'bg-cyan-800/55 border-white/10 backdrop-blur-xl'
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
                    <div className="w-11 h-6 bg-white/20 rounded-full peer-checked:bg-white/40 after:content-[''] after:absolute after:top-[2px] after:start-[22px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                )}
                <span className={`font-semibold ${day.enabled ? 'text-white' : 'text-white/40'} text-sm sm:text-base`}>
                  {day.day}
                </span>
              </div>

              {isEditing && day.enabled && (
                <button
                  onClick={() => addTimeSlot(dayIndex)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-br from-[#144A89] to-[#008080] border border-white/20 text-white hover:bg-white/20 transition-all text-xs sm:text-sm font-medium"
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
                  <div key={slotIndex} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 bg-cyan-800/35 p-3 sm:p-4 rounded-xl border border-white/20">
                    
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                      <div className="flex-1">
                        <label className="text-xs sm:text-sm text-white/70 mb-1 block">من</label>
                        <input
                          type="time"
                          value={slot.start}
                          disabled={!isEditing}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'start', e.target.value)}
                          className="w-full px-3 sm:w-full sm:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50"
                        />
                      </div>

                      <div className="flex-1">
                        <label className="text-xs sm:text-sm text-white/70 mb-1 block">إلى</label>
                        <input
                          type="time"
                          value={slot.end}
                          disabled={!isEditing}
                          onChange={(e) => updateTimeSlot(dayIndex, slotIndex, 'end', e.target.value)}
                          className="w-full px-3 sm:px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {isEditing && day.slots.length > 1 && (
                      <button
                        onClick={() => removeTimeSlot(dayIndex, slotIndex)}
                        className="p-2 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-white/20"
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
            className="px-5 sm:px-6 py-2 sm:py-3 rounded-xl bg-white/20 border border-white/30 text-white shadow-lg hover:bg-white/30 transition-all font-medium text-sm sm:text-base"
          >
            حفظ التغييرات
          </button>
        </div>
      )}
    </div>
  );
}