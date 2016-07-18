importScripts('./../lib/cache-polyfill/index.js')

var CACHE_VERSION = 'app-v1';
var CACHE_FILES = [
    '/',
    'images/background.jpeg',
    'js/app.js',
    'css/styles.css',
    'https://fonts.googleapis.com/css?family=Roboto:100'
];

self.addEventListener('install', function(event){
  console.log(event);
});

self.addEventListener('activate', function(event){
    console.log(event);
    event.waitUntil(
        caches.keys().then(function(keys){
            return Promise.all(keys.map(function(key, i){
                if(key !== CACHE_VERSION){
                    return caches.delete(keys[i]);
                }
            }))
        })
    )
});

self.addEventListener('fetch', function(event){
  // intercept the request made to server
  console.log(event.request.url);
  // return something for each interception
  event.respondWith(
    caches.match(event.request).then(function(res){
        if(res){
            return res;
        }
        requestBackend(event);
    })
  )
});

function requestBackend(event){
    var url = event.request.clone();
    return fetch(url).then(function(res){
        //if not a valid response send the error
        if(!res || res.status !== 200 || res.type !== 'basic'){
            return res;
        }

        var response = res.clone();

        caches.open(CACHE_VERSION).then(function(cache){
            cache.put(event.request, response);
        });

        return res;
    })
}