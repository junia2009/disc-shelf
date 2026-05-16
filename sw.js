// ==========================================================
//  Service Worker — DISC SHELF
//  ★ リリースの度に CACHE のバージョンを上げてください
//    例: 'discshelf-v1.0.0' → 'discshelf-v1.0.1'
//
//  動作の流れ:
//    1. ブラウザは sw.js を毎回ネットから取得（仕様）
//    2. CACHE 名のバイト差分を検知 → 新SWを "waiting" でインストール
//    3. skipWaiting()  : 新SWを即座に active へ昇格
//    4. activate       : 旧キャッシュを一括削除
//    5. clients.claim(): 既存タブの制御を奪取
//
//  → ユーザーが 2回開けば確実に最新バージョンが反映されます。
// ==========================================================
const CACHE = 'discshelf-v1.2.1';

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './styles.css',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
];

// ---- install: 静的アセットを事前キャッシュ ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ---- activate: 旧キャッシュを掃除して既存タブを奪取 ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ---- fetch: 同一オリジンのGETのみキャッシュ優先で返す ----
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => cached); // オフライン時のフォールバック
    })
  );
});
