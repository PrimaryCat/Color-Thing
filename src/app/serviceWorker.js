const version = "2.0.0";

const cacheName = "colorThing-v" + version;
const shellFiles = [
    // Enter point files
    "../index.html",
    "../style.css",
    "../app.js",
    // Data
    "../data/colors.json",
    "../data/version.json",
    // Assets
    "../assets/darkMode.png",
    "../assets/lightMode.png",
    "../assets/logo.svg",
    "../assets/wheel.png",
    "../assets/darkAbout.png",
    "../assets/lightAbout.png",
    // Classes
    "../classes/color.js",
    "../classes/colorGenerator.js",
    "../classes/colorWheel.js",
    "../classes/domManager.js",
    "../classes/exporter.js",
    "../classes/indexer.js",
    "../classes/swatch.js",
    "../classes/swatchDisplay.js",
    "../classes/themer.js",
    "../classes/notificationManager.js",
    "../classes/aboutDisplay.js",
    "../classes/paletteViewer.js",
    // Modules
    "../modules/debugger.js",
    "../modules/elements.js",
    "../modules/tools.js"
];

self.addEventListener("message", (event) => {
    if(event.data === "version"){
        event.source.postMessage(version);
    };
});

self.addEventListener('install', (e) => {
    self.skipWaiting();
    console.log('Service worker installed. Version: ' + version);
    console.log('Service worker clearing old caches...');
    caches.keys().then(function(names) {
        for (let name of names)
            if(name != cacheName){
                caches.delete(name);
        };
    });
    e.waitUntil((async () => {
      const cache = await caches.open(cacheName);
      console.log('Service worker caching all: app shell and content.');
      await cache.addAll(shellFiles);
      console.log("Service worker cached all: app shell and content.")
    })());
});

self.addEventListener('fetch', (e) => {
    // Cache http and https only, skip unsupported chrome-extension:// and file://...
    if (!(
       e.request.url.startsWith('http:') || e.request.url.startsWith('https:')
    )){
        return; 
    }

    e.respondWith((async () => {
        const r = await caches.match(e.request);
        if (r) return r;

        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);
        console.log(`Service worker caching new resource: ${e.request.url}`);
        cache.put(e.request, response.clone());
        return response;
      })());
});