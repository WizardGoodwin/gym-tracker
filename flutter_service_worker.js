// Ликвидатор старых service worker'ов.
// Раньше сборка регистрировала SW с cache-first — он продолжал отдавать
// устаревшие файлы из кэша (особенно в PWA на телефонах). Новые версии
// приложение в целом не используют service worker, но этот файл обязан
// существовать по старому адресу: браузер проверяет его при запуске PWA,
// получает новый скрипт, активирует его — и тот удаляет все старые кэши
// и регистрацию самого себя.
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((c) => c.navigate(c.url));
    } catch (e) {
      // молча: главное — unregister ниже уже выполнен или повторится
    }
  })());
});
