/* สมุดประจำวิชา: เก็บไฟล์แอปไว้ในเครื่องให้เปิดได้แม้ไม่มีอินเทอร์เน็ต (ไม่มีข้อมูลนักเรียนในไฟล์นี้) */
const VERSION="classbook-v2-2569-11-25";
const FILES=["./","index.html","manifest.webmanifest","icon-180.png","icon-192.png","icon-512.png","xlsx.full.min.js","jszip.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET") return;
  const url=new URL(req.url);
  if(url.origin!==location.origin){ // fonts: network first, then cache
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));return r}).catch(()=>caches.match(req)));return}
  // app files: network first (to get updates), fall back to cache when offline
  e.respondWith(fetch(req).then(r=>{if(r.ok){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp))}return r}).catch(()=>caches.match(req).then(m=>m||caches.match("index.html"))));
});
