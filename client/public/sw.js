// Service Worker para Print3DPro
// Versão do cache - incrementar quando houver mudanças
const CACHE_VERSION = 'v1.0.0';
const CACHE_NAME = `print3dpro-${CACHE_VERSION}`;

// Recursos para cache
const STATIC_CACHE_URLS = [
  '/Print3DPro/',
  '/Print3DPro/index.html',
  '/Print3DPro/manifest.json',
  '/Print3DPro/404.html'
];

// Recursos de imagem para cache
const IMAGE_CACHE_URLS = [
  '/Print3DPro/1.jpg',
  '/Print3DPro/2.jpg',
  '/Print3DPro/3d-printer.jpg',
  '/Print3DPro/generated-icon.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache aberto');
        // Cache recursos estáticos essenciais
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        // Força a ativação imediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erro durante instalação:', error);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Remove caches antigos
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Assume controle de todas as páginas
        return self.clients.claim();
      })
      .catch((error) => {
        console.error('Service Worker: Erro durante ativação:', error);
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Apenas intercepta requisições do mesmo domínio
  if (url.origin !== location.origin) {
    return;
  }
  
  // Estratégia Cache First para recursos estáticos
  if (isStaticResource(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  
  // Estratégia Network First para páginas HTML
  if (isHTMLRequest(request)) {
    event.respondWith(networkFirst(request));
    return;
  }
  
  // Estratégia Stale While Revalidate para imagens
  if (isImageRequest(request)) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// Verifica se é um recurso estático
function isStaticResource(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/assets/') || 
         url.pathname.endsWith('.js') || 
         url.pathname.endsWith('.css') ||
         url.pathname.endsWith('.woff2') ||
         url.pathname.endsWith('.woff');
}

// Verifica se é uma requisição HTML
function isHTMLRequest(request) {
  return request.headers.get('accept')?.includes('text/html');
}

// Verifica se é uma requisição de imagem
function isImageRequest(request) {
  return request.headers.get('accept')?.includes('image/') ||
         request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
}

// Estratégia Cache First
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First falhou:', error);
    return new Response('Recurso não disponível offline', { status: 503 });
  }
}

// Estratégia Network First
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network falhou, tentando cache:', error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para página offline
    if (isHTMLRequest(request)) {
      return caches.match('/Print3DPro/404.html');
    }
    
    return new Response('Página não disponível offline', { status: 503 });
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  // Busca nova versão em background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Falha silenciosa na atualização
  });
  
  // Retorna cache imediatamente se disponível, senão espera network
  return cachedResponse || fetchPromise;
}

// Listener para mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_VERSION });
  }
});

// Pré-cache de imagens importantes em background
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache imagens importantes em background
        IMAGE_CACHE_URLS.forEach((url) => {
          fetch(url).then((response) => {
            if (response.ok) {
              cache.put(url, response);
            }
          }).catch(() => {
            // Falha silenciosa
          });
        });
      })
  );
});