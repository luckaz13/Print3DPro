import React from 'react';
import { usePWA } from '@/hooks/use-pwa';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Download, RefreshCw, WifiOff, Smartphone } from 'lucide-react';

export function PWANotifications() {
  const { 
    isInstallable, 
    isOffline, 
    installApp, 
    updateAvailable, 
    updateApp,
    isInstalled 
  } = usePWA();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Notificação de instalação */}
      {isInstallable && !isInstalled && (
        <Card className="border-blue-200 bg-blue-50 shadow-lg animate-in slide-in-from-right-full duration-300">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Smartphone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900">
                  Instalar Print3DPro
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Adicione nosso app à sua tela inicial para acesso rápido
                </p>
                <div className="mt-3 flex space-x-2">
                  <Button
                    size="sm"
                    onClick={installApp}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Instalar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notificação de atualização */}
      {updateAvailable && (
        <Card className="border-green-200 bg-green-50 shadow-lg animate-in slide-in-from-right-full duration-300">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-900">
                  Atualização disponível
                </p>
                <p className="text-xs text-green-700 mt-1">
                  Uma nova versão do app está disponível
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    onClick={updateApp}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Atualizar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notificação offline */}
      {isOffline && (
        <Alert className="border-orange-200 bg-orange-50 shadow-lg animate-in slide-in-from-right-full duration-300">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <span className="font-medium">Modo offline</span>
            <br />
            <span className="text-xs">
              Você está navegando offline. Algumas funcionalidades podem estar limitadas.
            </span>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}