const CACHE = 'dosetti-v2';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Puoliyöllä: aseta badge uudelleen (lääke ottamatta uusi päivä)
function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function scheduleMidnightBadge() {
  const now = new Date();
  const ms = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1) - now;
  setTimeout(() => {
    // Uusi päivä alkoi — laita badge päälle
    if ('setAppBadge' in self) {
      self.setAppBadge(1).catch(() => {});
    }
    scheduleMidnightBadge();
  }, ms);
}

scheduleMidnightBadge();
