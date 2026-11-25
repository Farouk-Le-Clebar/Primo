import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { getAlertPreferences, readAlertedIds, saveAlertedIds } from "../components/navbar/components/newsPopup/alertPreferences";
import { getNewsHeadline } from "../components/navbar/components/newsPopup/newsHeadline";
import { getNewsKind, NEWS_KINDS } from "../components/navbar/components/newsPopup/newsKinds";
import { openNewsPopup } from "../components/navbar/components/newsPopup/newsPreferences";
import type { NotificationResponse } from "../requests/notificationRequests";
import { playNotificationSound, unlockNotificationSound } from "../utils/notificationSound";
import { onServiceWorkerMessage, showSystemNotification } from "../utils/serviceWorker";

const FRESH_ON_LOAD_MS = 2 * 60 * 1000;

type AlertContent = { title: string; body: string; tag: string };

const describe = (fresh: NotificationResponse[]): AlertContent => {
  if (fresh.length > 1) return { title: "Primo", body: `${fresh.length} nouvelles notifications`, tag: "primo-batch" };
  const [notification] = fresh;
  const kind = getNewsKind(notification);
  const { actor, action } = getNewsHeadline(notification, kind);
  const sentence = `${actor}${action}`.trim();
  if (kind === "system") return { title: notification.title, body: notification.message, tag: notification.id };
  return { title: notification.title || NEWS_KINDS[kind].label, body: sentence || notification.message, tag: notification.id };
};

const focusNewsPopup = () => {
  window.focus();
  openNewsPopup();
};

const showDesktopNotification = ({ title, body, tag }: AlertContent) => {
  void showSystemNotification(title, { body, tag, icon: "/icons/icon-192.png" }, focusNewsPopup);
};

export function useNotificationAlerts(notifications: NotificationResponse[], isLoading: boolean): void {
  const knownIds = useRef<Set<string> | null>(null);

  useEffect(() => unlockNotificationSound(), []);

  useEffect(() => onServiceWorkerMessage("open-news", focusNewsPopup), []);

  useEffect(() => {
    if (isLoading) return;
    const alerted = readAlertedIds();
    const isFresh = (notification: NotificationResponse) =>
      knownIds.current ? !knownIds.current.has(notification.id) : Date.now() - new Date(notification.createdAt).getTime() < FRESH_ON_LOAD_MS;
    const fresh = notifications.filter((notification) => !notification.isRead && !alerted.has(notification.id) && isFresh(notification));
    knownIds.current = new Set(notifications.map((notification) => notification.id));
    if (fresh.length === 0) return;

    fresh.forEach((notification) => alerted.add(notification.id));
    saveAlertedIds(alerted);

    const preferences = getAlertPreferences();
    const content = describe(fresh);
    if (preferences.sound) playNotificationSound();
    if (document.hidden && preferences.desktop && preferences.permission === "granted") showDesktopNotification(content);
    else toast(`${content.title} · ${content.body}`, { icon: "🔔", id: content.tag, duration: 5000 });
  }, [notifications, isLoading]);
}
