'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Wifi, 
  Download, 
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface PWADebugInfo {
  isPWA: boolean;
  isInstallable: boolean;
  hasManifest: boolean;
  hasServiceWorker: boolean;
  isOnline: boolean;
  deferredPrompt: boolean;
  displayMode: string;
}

export function PWADebug() {
  const [debugInfo, setDebugInfo] = useState<PWADebugInfo>({
    isPWA: false,
    isInstallable: false,
    hasManifest: false,
    hasServiceWorker: false,
    isOnline: navigator.onLine,
    deferredPrompt: false,
    displayMode: 'browser',
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkPWAStatus = async () => {
      // Check if running as PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      // Check if manifest exists
      let manifestExists = false;
      try {
        const response = await fetch('/manifest.json');
        manifestExists = response.ok;
      } catch (error) {
        console.log('Manifest not found');
      }

      // Check service worker
      const hasSW = 'serviceWorker' in navigator;

      // Check if installable
      const isInstallable = !isStandalone && !isIOSStandalone && manifestExists && hasSW;

      setDebugInfo({
        isPWA: isStandalone || isIOSStandalone,
        isInstallable,
        hasManifest: manifestExists,
        hasServiceWorker: hasSW,
        isOnline: navigator.onLine,
        deferredPrompt: false, // Will be updated by InstallPrompt
        displayMode: isStandalone ? 'standalone' : isIOSStandalone ? 'ios-standalone' : 'browser',
      });
    };

    checkPWAStatus();
    
    // Listen for online/offline changes
    const handleOnline = () => setDebugInfo(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setDebugInfo(prev => ({ ...prev, isOnline: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 left-4 z-50"
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        PWA Debug
      </Button>
    );
  }

  return (
    <div className="fixed inset-4 z-50 overflow-auto bg-black/50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              PWA Debug Information
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Installation Status</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {debugInfo.isPWA ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Running as PWA</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.isInstallable ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Can be installed</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Technical Requirements</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {debugInfo.hasManifest ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Manifest exists</span>
                </div>
                <div className="flex items-center gap-2">
                  {debugInfo.hasServiceWorker ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-500" />
                  )}
                  <span className="text-sm">Service Worker</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Current Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Display Mode:</span>
                <Badge variant="secondary" className="ml-2">
                  {debugInfo.displayMode}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Network:</span>
                <Badge 
                  variant={debugInfo.isOnline ? "default" : "destructive"}
                  className="ml-2"
                >
                  {debugInfo.isOnline ? 'Online' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Troubleshooting</h3>
            <div className="text-sm space-y-1 text-gray-600">
              {!debugInfo.hasManifest && (
                <p>❌ Manifest file not found. Check if /public/manifest.json exists.</p>
              )}
              {!debugInfo.hasServiceWorker && (
                <p>❌ Service Worker not supported in this browser.</p>
              )}
              {debugInfo.isPWA && (
                <p>✅ App is already running as PWA. Install icon won't show.</p>
              )}
              {debugInfo.isInstallable && (
                <p>✅ App meets all PWA requirements. Install icon should appear in browser.</p>
              )}
              {!debugInfo.isInstallable && debugInfo.hasManifest && debugInfo.hasServiceWorker && (
                <p>❌ App meets requirements but install icon not showing. Try refreshing or check browser support.</p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Refresh Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
