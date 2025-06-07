// Script de teste PWA - Execute no console do navegador
// Para testar as funcionalidades PWA implementadas

console.log('🚀 Testando funcionalidades PWA do Print3DPro...\n');

// 1. Verificar Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log('✅ Service Worker registrado:', registrations[0].scope);
      
      // Verificar estado do service worker
      const sw = registrations[0];
      if (sw.active) {
        console.log('✅ Service Worker ativo');
      }
      if (sw.waiting) {
        console.log('⏳ Service Worker aguardando ativação');
      }
    } else {
      console.log('❌ Service Worker não encontrado');
    }
  });
} else {
  console.log('❌ Service Worker não suportado');
}

// 2. Verificar Manifest
fetch('/Print3DPro/manifest.json')
  .then(response => response.json())
  .then(manifest => {
    console.log('✅ Manifest carregado:', manifest.name);
    console.log('📱 Ícones disponíveis:', manifest.icons.length);
    console.log('🎯 Shortcuts:', manifest.shortcuts?.length || 0);
  })
  .catch(error => {
    console.log('❌ Erro ao carregar manifest:', error);
  });

// 3. Verificar instalabilidade
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✅ App é instalável');
  deferredPrompt = e;
});

// 4. Verificar se já está instalado
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('✅ App já está instalado (modo standalone)');
} else if (window.navigator.standalone === true) {
  console.log('✅ App já está instalado (iOS)');
} else {
  console.log('📱 App não está instalado');
}

// 5. Verificar status online/offline
console.log('🌐 Status de conexão:', navigator.onLine ? 'Online' : 'Offline');

window.addEventListener('online', () => {
  console.log('🌐 Voltou online');
});

window.addEventListener('offline', () => {
  console.log('📴 Ficou offline');
});

// 6. Testar cache
caches.keys().then(cacheNames => {
  console.log('💾 Caches disponíveis:', cacheNames);
  
  cacheNames.forEach(cacheName => {
    caches.open(cacheName).then(cache => {
      cache.keys().then(keys => {
        console.log(`📦 Cache "${cacheName}": ${keys.length} itens`);
      });
    });
  });
});

// 7. Função para instalar o app (se disponível)
window.installPWA = function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ Usuário aceitou instalar o PWA');
      } else {
        console.log('❌ Usuário rejeitou instalar o PWA');
      }
      deferredPrompt = null;
    });
  } else {
    console.log('❌ Prompt de instalação não disponível');
  }
};

// 8. Função para testar notificações (se suportado)
window.testNotifications = function() {
  if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification('Print3DPro PWA', {
        body: 'Notificações funcionando!',
        icon: '/Print3DPro/generated-icon.png'
      });
      console.log('✅ Notificação enviada');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('Print3DPro PWA', {
            body: 'Notificações ativadas!',
            icon: '/Print3DPro/generated-icon.png'
          });
          console.log('✅ Permissão concedida e notificação enviada');
        }
      });
    }
  } else {
    console.log('❌ Notificações não suportadas');
  }
};

// 9. Informações do dispositivo
console.log('📱 Informações do dispositivo:');
console.log('- User Agent:', navigator.userAgent);
console.log('- Plataforma:', navigator.platform);
console.log('- Idioma:', navigator.language);
console.log('- Conexão:', navigator.connection?.effectiveType || 'Desconhecida');

// 10. Comandos disponíveis
console.log('\n🛠️ Comandos disponíveis:');
console.log('- installPWA(): Tentar instalar o PWA');
console.log('- testNotifications(): Testar notificações');

console.log('\n✨ Teste PWA concluído! Verifique os resultados acima.');