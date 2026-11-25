const OFFLINE_HTML = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Primo</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;font-family:system-ui,sans-serif;background:#fff;color:#18181b;text-align:center;padding:24px}button{margin-top:16px;padding:10px 20px;border:0;border-radius:10px;background:#18181b;color:#fff;font-size:15px}</style></head><body><div><h1 style="font-size:20px">Pas de connexion</h1><p style="color:#71717a">Primo a besoin d'internet pour charger vos données.</p><button onclick="location.reload()">Réessayer</button></div></body></html>`;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(
      () => new Response(OFFLINE_HTML, { headers: { "Content-Type": "text/html; charset=utf-8" } }),
    ),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const client = windows[0];
      if (!client) return self.clients.openWindow("/");
      client.postMessage({ type: "open-news" });
      return client.focus();
    }),
  );
});
