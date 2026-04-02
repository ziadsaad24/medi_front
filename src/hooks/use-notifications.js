import { useEffect, useMemo, useState } from 'react';

const MEDICATIONS_KEY = 'medications-data';
const APPOINTMENTS_KEY = 'appointments-data';

const parseJSON = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const parseAppointmentDateTime = (date, time24) => {
  if (!date || !time24) return null;
  const d = new Date(`${date}T${time24}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
};

const nextMedicationTime = (time) => {
  if (!time) return null;
  const [h, m] = time.split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;

  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);

  if (next < now) {
    next.setDate(next.getDate() + 1);
  }
  return next;
};

const minutesDiff = (futureDate, now) => Math.round((futureDate.getTime() - now.getTime()) / 60000);

const relativeLabel = (mins) => {
  if (mins <= 60) return `بعد ${Math.max(1, mins)} دقيقة`;
  const hrs = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem === 0 ? `بعد ${hrs} ساعة` : `بعد ${hrs}س ${rem}د`;
};

export const useNotifications = () => {
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRefreshTick((prev) => prev + 1);
    }, 60000);

    const onStorage = () => setRefreshTick((prev) => prev + 1);
    window.addEventListener('storage', onStorage);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const notifications = useMemo(() => {
    const now = new Date();
    const meds = parseJSON(localStorage.getItem(MEDICATIONS_KEY), []);
    const appointments = parseJSON(localStorage.getItem(APPOINTMENTS_KEY), []);
    const nextItems = [];

    for (const med of meds) {
      if (!med || med.taken) continue;
      const dueAt = nextMedicationTime(med.time);
      if (!dueAt) continue;
      const mins = minutesDiff(dueAt, now);
      if (mins < 0 || mins > 180) continue;

      nextItems.push({
        id: `med-${med.id}`,
        type: 'medication',
        priority: mins <= 45 ? 'urgent' : 'normal',
        title: 'ميعاد دواء قريب',
        message: `${med.name} - ${med.dosage}`,
        meta: relativeLabel(mins),
        route: '/medications',
        dueAt,
      });
    }

    for (const appt of appointments) {
      if (!appt || appt.status !== 'مؤكد') continue;
      const dueAt = parseAppointmentDateTime(appt.date, appt.time24);
      if (!dueAt) continue;
      const mins = minutesDiff(dueAt, now);
      if (mins < 0 || mins > 24 * 60) continue;

      nextItems.push({
        id: `appt-${appt.id}`,
        type: 'appointment',
        priority: mins <= 120 ? 'urgent' : 'normal',
        title: 'موعد حجز قريب',
        message: `${appt.doctorName} - ${appt.specialty}`,
        meta: relativeLabel(mins),
        route: '/appointments',
        dueAt,
      });
    }

    return nextItems
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
      .slice(0, 8);
  }, [refreshTick]);

  return {
    notifications,
    unreadCount: notifications.length,
  };
};
