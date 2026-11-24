import { useSyncExternalStore } from "react";

const SOUND_KEY = "primo-news-sound";
const DESKTOP_KEY = "primo-news-desktop";
const ALERTED_KEY = "primo-news-alerted";
const CHANGE_EVENT = "primo:alert-preferences";

export type DesktopPermission = NotificationPermission | "unsupported";

export type AlertPreferences = {
  sound: boolean;
  desktop: boolean;
  permission: DesktopPermission;
};

const readPermission = (): DesktopPermission => ("Notification" in window ? Notification.permission : "unsupported");

let snapshot: AlertPreferences = {
  sound: localStorage.getItem(SOUND_KEY) !== "0",
  desktop: localStorage.getItem(DESKTOP_KEY) !== "0",
  permission: readPermission(),
};

const refresh = () => {
  snapshot = { sound: localStorage.getItem(SOUND_KEY) !== "0", desktop: localStorage.getItem(DESKTOP_KEY) !== "0", permission: readPermission() };
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

const subscribe = (listener: () => void) => {
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
};

export const getAlertPreferences = (): AlertPreferences => snapshot;

export const useAlertPreferences = (): AlertPreferences => useSyncExternalStore(subscribe, getAlertPreferences);

export const setSoundEnabled = (enabled: boolean): void => {
  localStorage.setItem(SOUND_KEY, enabled ? "1" : "0");
  refresh();
};

export async function setDesktopEnabled(enabled: boolean): Promise<void> {
  localStorage.setItem(DESKTOP_KEY, enabled ? "1" : "0");
  if (enabled && readPermission() === "default") await Notification.requestPermission();
  refresh();
}

export const readAlertedIds = (): Set<string> => {
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(ALERTED_KEY) || "[]");
    return new Set(Array.isArray(value) ? value.map(String) : []);
  } catch {
    return new Set();
  }
};

export const saveAlertedIds = (ids: Set<string>): void => {
  sessionStorage.setItem(ALERTED_KEY, JSON.stringify([...ids].slice(-200)));
};
