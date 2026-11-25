type ServiceWorkerMessage = { type: "open-news" };

export function registerServiceWorker(): void {
  if (!("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  });
}

export function onServiceWorkerMessage(type: ServiceWorkerMessage["type"], handler: () => void): () => void {
  if (!("serviceWorker" in navigator)) return () => undefined;
  const listener = (event: MessageEvent<ServiceWorkerMessage>) => {
    if (event.data?.type === type) handler();
  };
  navigator.serviceWorker.addEventListener("message", listener);
  return () => navigator.serviceWorker.removeEventListener("message", listener);
}

export async function showSystemNotification(title: string, options: NotificationOptions, onClick: () => void): Promise<void> {
  const registration = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistration() : undefined;
  if (registration) return registration.showNotification(title, options);
  const notification = new Notification(title, options);
  notification.onclick = () => {
    onClick();
    notification.close();
  };
}
