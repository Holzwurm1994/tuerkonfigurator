/* Service Worker: Seite immer zuerst aus dem Netz (Updates kommen sofort an), offline aus dem Speicher */
const CACHE="tuerkonfig-202611201045";
const CORE=["./","index.html","manifest.webmanifest","vendor/jspdf.umd.min.js","vendor/jspdf.plugin.autotable.min.js","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png","icons/favicon-64.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);
  if(r.mode==="navigate"||(u.origin===location.origin&&/\/(index\.html)?$/.test(u.pathname))){
    e.respondWith(fetch(r,{cache:"no-store"}).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put("index.html",c));return res}).catch(()=>caches.match("index.html")));return}
  if(u.hostname.endsWith("fonts.googleapis.com")||u.hostname.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})));return}
  if(u.origin===location.origin){
    e.respondWith(caches.match(r).then(m=>{const net=fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c))}return res});return m||net}))}
});
