import { useContext, useEffect, useMemo, useState } from 'react';
import { patientAPI } from '../services/api';
import AuthContext from '../context/AuthContext';

const formatRelativeMinutes = (value) => {
  const mins = Math.max(1, Math.round(Number(value)));
  if (mins < 60) return `بعد ${mins} دقيقة`;

  const hours = Math.floor(mins / 60);
  const remaining = mins % 60;
  if (remaining === 0) return `بعد ${hours} ساعة`;

  return `بعد ${hours}س ${remaining}د`;
};

const formatNotificationMeta = (meta) => {
  if (meta === null || meta === undefined) return '';

  if (typeof meta === 'number' && Number.isFinite(meta)) {
    return formatRelativeMinutes(meta);
  }

  const text = String(meta).trim();
  if (!text) return '';

  // If backend returns only a number as string, format it directly.
  if (/^\d+(?:\.\d+)?$/.test(text)) {
    return formatRelativeMinutes(Number(text));
  }

  // If text already starts with "بعد" and contains decimal number, round it.
  if (text.startsWith('بعد')) {
    return text.replace(/\d+(?:\.\d+)?/, (match) => String(Math.max(1, Math.round(Number(match)))));
  }

  return text;
};

const getMinutesUntilDueAt = (item) => {
  if (!item?.due_at) return null;

  const dueAt = new Date(item.due_at);
  if (Number.isNaN(dueAt.getTime())) return null;

  const now = new Date();
  let minutes = Math.ceil((dueAt.getTime() - now.getTime()) / 60000);

  // Medication reminders are daily. If the time already passed today,
  // calculate the next occurrence (tomorrow at the same time).
  if (item?.type === 'medication' && minutes < 0) {
    const oneDayMinutes = 24 * 60;
    minutes = ((minutes % oneDayMinutes) + oneDayMinutes) % oneDayMinutes;
    if (minutes === 0) minutes = oneDayMinutes;
  }

  return minutes;
};

const pickFirstText = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
};

const includesArabicOrEnglishKeyword = (text, keywords) => {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((keyword) => normalized.includes(keyword.toLowerCase()));
};

const buildAppointmentNotificationContent = (item) => {
  const doctorName = pickFirstText(item?.doctor_name, item?.doctorName, item?.doctor, item?.provider_name);
  const confirmedDate = pickFirstText(item?.confirmed_date, item?.confirmedDate);
  const requestedDate = pickFirstText(item?.requested_date, item?.requestedDate, item?.date);
  const confirmedTime = pickFirstText(item?.confirmed_time, item?.confirmedTime);
  const requestedTime = pickFirstText(item?.requested_time, item?.requestedTime, item?.time);
  const appointmentDate = confirmedDate || requestedDate;
  const appointmentTime = confirmedTime || requestedTime;
  const rejectReason = pickFirstText(item?.reject_reason, item?.rejectReason, item?.reason);
  const rawStatus = pickFirstText(item?.status, item?.booking_status, item?.appointment_status, item?.type);

  const isRejected = includesArabicOrEnglishKeyword(rawStatus, ['rejected', 'رفض', 'rejected_request']) ||
    includesArabicOrEnglishKeyword(item?.title, ['رفض']) ||
    includesArabicOrEnglishKeyword(item?.message, ['رفض']) ||
    includesArabicOrEnglishKeyword(item?.body, ['رفض']);

  const title = isRejected ? 'تم رفض طلب الحجز' : 'تم تحديث حالة الحجز';

  const parts = [];
  if (doctorName) parts.push(`مع د. ${doctorName}`);
  if (appointmentDate) parts.push(`بتاريخ ${appointmentDate}`);
  if (appointmentTime) parts.push(`الساعة ${appointmentTime}`);

  let message =
    parts.length > 0
      ? `حالة موعدك ${isRejected ? 'اتغيرت إلى مرفوض' : 'اتأكدت بنجاح'} ${parts.join(' - ')}.`
      : `حالة موعدك ${isRejected ? 'اتغيرت إلى مرفوض' : 'اتأكدت بنجاح'}.`;

  if (isRejected && rejectReason) {
    message += ` السبب: ${rejectReason}.`;
  }

  const metaSegments = [];
  if (doctorName) metaSegments.push(`الطبيب: ${doctorName}`);
  if (appointmentDate) metaSegments.push(`التاريخ: ${appointmentDate}`);
  if (appointmentTime) metaSegments.push(`الوقت: ${appointmentTime}`);
  if (isRejected && rejectReason) metaSegments.push(`السبب: ${rejectReason}`);

  return {
    title,
    message,
    meta: metaSegments.join(' | '),
  };
};

const normalizeNotification = (item, index) => {
  const minutesUntilDue = getMinutesUntilDueAt(item);
  const type = item?.type ?? item?.notification_type ?? 'general';
  const content = `${item?.title || ''} ${item?.message || ''}`.toLowerCase();
  const looksLikeAppointment =
    /appointment|booking|confirm|schedule|موعد|حجز|تاكيد|تأكيد/.test(type.toLowerCase()) ||
    /appointment|booking|confirm|schedule|موعد|حجز|تاكيد|تأكيد/.test(content);

  const route = looksLikeAppointment ? '/appointments' : '/medications';
  const fallbackMessage = pickFirstText(item?.message, item?.body, item?.description);
  const appointmentContent = looksLikeAppointment ? buildAppointmentNotificationContent(item) : null;

  const title = pickFirstText(item?.title, appointmentContent?.title, 'تنبيه');
  const baseMessage = pickFirstText(fallbackMessage, appointmentContent?.message, 'لديك تحديث جديد');
  const shouldAppendDetails =
    looksLikeAppointment &&
    appointmentContent?.meta &&
    !String(baseMessage).includes('التفاصيل:');
  const message = shouldAppendDetails
    ? `${baseMessage} التفاصيل: ${appointmentContent.meta}`
    : baseMessage;

  const metaFromDueAt = minutesUntilDue !== null ? formatRelativeMinutes(minutesUntilDue) : '';
  const metaFromApi = formatNotificationMeta(item?.meta);
  const meta = pickFirstText(metaFromDueAt, metaFromApi, appointmentContent?.meta);

  const fallbackIdSeed = [
    type,
    pickFirstText(item?.title),
    pickFirstText(item?.message, item?.body, item?.description),
    pickFirstText(item?.due_at, item?.created_at, item?.timestamp),
    String(index),
  ].join('|');

  return {
    id: String(item?.id ?? fallbackIdSeed),
    type,
    priority: item?.priority ?? 'normal',
    title,
    message,
    meta,
    route,
    serverRead: Boolean(item?.is_read || item?.read || item?.seen || item?.read_at),
  };
};

const toItemsArray = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.notifications)) return response.notifications;
  if (Array.isArray(response)) return response;
  return [];
};

export const useNotifications = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? 'anonymous';
  const readStorageKey = `notifications-read-${userId}`;

  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const stored = localStorage.getItem(readStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(readStorageKey);
      setReadNotificationIds(stored ? JSON.parse(stored) : []);
    } catch {
      setReadNotificationIds([]);
    }
  }, [readStorageKey]);

  useEffect(() => {
    localStorage.setItem(readStorageKey, JSON.stringify(readNotificationIds));
  }, [readNotificationIds, readStorageKey]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const [upcomingResponse, patientResponse] = await Promise.all([
          patientAPI.getUpcomingNotifications(),
          patientAPI.getPatientNotifications({ page: 1, per_page: 20 }),
        ]);

        const merged = [...toItemsArray(patientResponse), ...toItemsArray(upcomingResponse)];
        const deduped = Array.from(
          new Map(merged.map((item, index) => [String(item?.id ?? `notification-${index}`), item])).values()
        );

        setNotifications(deduped.map((item, index) => normalizeNotification(item, index)).slice(0, 8));
      } catch (error) {
        console.warn('Unable to load notifications from API:', error);
        setNotifications([]);
      }
    };

    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 30000);

    const handleFocus = () => {
      loadNotifications();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadNotifications();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const notificationsWithReadState = useMemo(() => {
    const readSet = new Set(readNotificationIds);
    return notifications.map((item) => ({
      ...item,
      isRead: item.serverRead || readSet.has(item.id),
    }));
  }, [notifications, readNotificationIds]);

  const markAsRead = async (notificationId) => {
    const normalizedId = String(notificationId);

    try {
      await patientAPI.markPatientNotificationRead(normalizedId);
    } catch (error) {
      // Keep local fallback for environments where read endpoints are not yet deployed.
      console.warn('Unable to sync notification read state with backend:', error);
    }

    setReadNotificationIds((prev) => {
      if (prev.includes(normalizedId)) return prev;
      return [...prev, normalizedId];
    });
  };

  const markAllAsRead = async () => {
    try {
      await patientAPI.markAllPatientNotificationsRead();
    } catch (error) {
      // Keep local fallback for environments where read endpoints are not yet deployed.
      console.warn('Unable to sync mark-all notifications read state with backend:', error);
    }

    setReadNotificationIds(notifications.map((item) => item.id));
  };

  const unreadCount = notificationsWithReadState.filter((item) => !item.isRead).length;

  return {
    notifications: notificationsWithReadState,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
};
