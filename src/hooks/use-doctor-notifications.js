import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import doctorApi from '../services/doctorApi';
import AuthContext from '../context/AuthContext';

/**
 * Hook to manage doctor notifications — mirrors useNotifications for patients.
 */

const pickFirstText = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const text = String(value).trim();
    if (text) return text;
  }
  return '';
};

const includesKeyword = (text, keywords) => {
  const normalized = String(text || '').toLowerCase();
  return keywords.some((kw) => normalized.includes(kw.toLowerCase()));
};

const normalizeNotification = (item, index) => {
  const type = item?.type ?? item?.notification_type ?? 'general';
  const content = `${item?.title || ''} ${item?.body || ''} ${item?.message || ''}`.toLowerCase();

  const looksLikeAppointment = includesKeyword(type, ['appointment', 'booking', 'confirm', 'schedule', 'موعد', 'حجز', 'تاكيد', 'تأكيد']) ||
    includesKeyword(content, ['appointment', 'booking', 'confirm', 'schedule', 'موعد', 'حجز', 'تاكيد', 'تأكيد']);

  const route = looksLikeAppointment ? '/doctor/requests' : '/doctor/dashboard';

  const title = pickFirstText(item?.title, 'تنبيه');
  const message = pickFirstText(item?.body, item?.message, item?.description, 'لديك تحديث جديد');
  const meta = item?.data ? (typeof item.data === 'object' ? '' : String(item.data)) : '';

  const fallbackIdSeed = [
    type,
    pickFirstText(item?.title),
    pickFirstText(item?.body, item?.message),
    pickFirstText(item?.created_at),
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
    serverRead: Boolean(item?.is_read || item?.read_at || item?.readAt),
    createdAt: item?.created_at || item?.createdAt || null,
  };
};

const toItemsArray = (response) => {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.notifications)) return response.notifications;
  if (Array.isArray(response)) return response;
  return [];
};

export const useDoctorNotifications = () => {
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?.id ?? 'anonymous';
  const userRole = authContext?.user?.role;
  const readStorageKey = `doctor-notifications-read-${userId}`;

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

  const loadNotifications = useCallback(async () => {
    if (userRole !== 'doctor') return;

    try {
      const response = await doctorApi.getDoctorNotifications({ page: 1, per_page: 20 });
      const items = toItemsArray(response);

      // Deduplicate by id
      const deduped = Array.from(
        new Map(items.map((item, index) => [String(item?.id ?? `notif-${index}`), item])).values()
      );

      const normalized = deduped
        .map((item, index) => normalizeNotification(item, index))
        .slice(0, 15);

      setNotifications(normalized);
    } catch (error) {
      console.warn('Unable to load doctor notifications:', error);
    }
  }, [userRole]);

  useEffect(() => {
    if (userRole !== 'doctor') {
      setNotifications([]);
      return;
    }

    loadNotifications();

    const interval = window.setInterval(loadNotifications, 30000);

    const handleFocus = () => loadNotifications();
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') loadNotifications();
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [userRole, loadNotifications]);

  const notificationsWithReadState = useMemo(() => {
    const readSet = new Set(readNotificationIds);
    return notifications.map((item) => ({
      ...item,
      isRead: item.serverRead || readSet.has(item.id),
    }));
  }, [notifications, readNotificationIds]);

  const markAsRead = useCallback(async (notificationId) => {
    const normalizedId = String(notificationId);

    try {
      await doctorApi.markNotificationRead(normalizedId);
    } catch (error) {
      console.warn('Unable to sync doctor notification read state:', error);
    }

    setReadNotificationIds((prev) => {
      if (prev.includes(normalizedId)) return prev;
      return [...prev, normalizedId];
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await doctorApi.markAllNotificationsRead();
    } catch (error) {
      console.warn('Unable to mark all doctor notifications as read:', error);
    }

    setReadNotificationIds(notifications.map((item) => item.id));
  }, [notifications]);

  const unreadCount = notificationsWithReadState.filter((item) => !item.isRead).length;

  return {
    notifications: notificationsWithReadState,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refreshNotifications: loadNotifications,
  };
};
