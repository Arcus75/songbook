const CACHE_NAME = 'project-songbook-v1';
const urlsToCache = [
    '/',
    '/js/config.js',
    '/js/code.js',
    '/js/model/Song.js',
    '/js/class/WebLoader.js',
    '/js/class/InterpretDB.js',
    '/js/class/SongDB.js',
    '../styles/style.css',
    '../html_sections/chords.html',
    '../html_sections/songbook.html',
    '../html_sections/editor.html'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});