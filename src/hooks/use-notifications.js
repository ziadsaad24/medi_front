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

const normalizeNotification = (item, index) => {
  const minutesUntilDue = getMinutesUntilDueAt(item);

  return {
    id: String(item?.id ?? `notification-${index}`),
    type: item?.type ?? 'general',
    priority: item?.priority ?? 'normal',
    title: item?.title ?? 'تنبيه',
    message: item?.message ?? '',
    meta: minutesUntilDue !== null ? formatRelativeMinutes(minutesUntilDue) : formatNotificationMeta(item?.meta),
    route: '/medications',
  };
};

export const useNotifications = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? 'anonymous';
  const readStorageKey = `notifications-read-${userId}`;

  const [notifications, setNotifications] = useState([]);
  const [readNotificationIds, setReadNotificationIds] = useState(() => {
    try {
      const stored = sessionStorage.getItem(readStorageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(readStorageKey);
      setReadNotificationIds(stored ? JSON.parse(stored) : []);
    } catch {
      setReadNotificationIds([]);
    }
  }, [readStorageKey]);

  useEffect(() => {
    sessionStorage.setItem(readStorageKey, JSON.stringify(readNotificationIds));
  }, [readNotificationIds, readStorageKey]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await patientAPI.getUpcomingNotifications();
        const items = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.notifications)
            ? response.notifications
            : Array.isArray(response)
              ? response
              : [];

        setNotifications(items.map((item, index) => normalizeNotification(item, index)).slice(0, 8));
      } catch (error) {
        console.warn('Unable to load notifications from API:', error);
        setNotifications([]);
      }
    };

    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const notificationsWithReadState = useMemo(() => {
    const readSet = new Set(readNotificationIds);
    return notifications.map((item) => ({
      ...item,
      isRead: readSet.has(item.id),
    }));
  }, [notifications, readNotificationIds]);

  const markAsRead = (notificationId) => {
    setReadNotificationIds((prev) => {
      if (prev.includes(notificationId)) return prev;
      return [...prev, notificationId];
    });
  };

  const markAllAsRead = () => {
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
