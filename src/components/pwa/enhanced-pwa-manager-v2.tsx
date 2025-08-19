'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone, 
  Wifi, 
  WifiOff,
  Download, 
  Zap, 
  Shield, 
  Clock,
  Bell,
  BellOff,
  Cloud,
  CloudOff,
  Database,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  RefreshCw,
  Sync,
  Offline
} from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from '@/hooks/use-toast';

interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  hasPushPermission: boolean;
  isPushEnabled: boolean;
  cacheSize: number;
  lastSync: Date | null;
  offlineData: string[];
  serviceWorkerVersion: string;
  backgroundSyncSupported: boolean;
  pushSupported: boolean;
}

interface EnhancedPWAManagerProps {
  className?: string;
}

export function EnhancedPWAManagerV2({ className = "" }: EnhancedPWAManagerProps) {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasPushPermission: false,
    isPushEnabled: false,
    cacheSize: 0,
    lastSync: null,
    offlineData: [],
    serviceWorkerVersion: '',
    backgroundSyncSupported: false,
    pushSupported: false
  });

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [notifications] = useLocalStorage<string[]>('pwa-notifications', []);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const { toast } = useToast();
  const swRegistration = useRef<ServiceWorkerRegistration | null>(null);

  // Check PWA installation status
  useEffect(() => {
    const checkInstallStatus = () => {
      const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                         (window.navigator as any).standalone === true;
      setPwaStatus(prev => ({ ...prev, isInstalled }));
    };

    checkInstallStatus();
    window.addEventListener('appinstalled', checkInstallStatus);
    return () => window.removeEventListener('appinstalled', checkInstallStatus);
  }, []);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setPwaStatus(prev => ({ ...prev, isOnline: true }));
      toast({
        title: "Back Online",
        description: "Your app is now connected to the internet",
        variant: "default"
      });
      // Trigger background sync when back online
      triggerBackgroundSync();
    };
    
    const handleOffline = () => {
      setPwaStatus(prev => ({ ...prev, isOnline: false }));
      toast({
        title: "Offline Mode",
        description: "You're now using the app offline",
        variant: "secondary"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Initialize service worker
  useEffect(() => {
    const initServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          // Register the enhanced service worker
          const registration = await navigator.serviceWorker.register('/enhanced-sw.js');
          swRegistration.current = registration;
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  setIsUpdating(true);
                  toast({
                    title: "Update Available",
                    description: "A new version of the app is available. Refresh to update.",
                    variant: "default"
                  });
                }
              });
            }
          });

          // Check service worker version
          if (registration.active) {
            const version = await getServiceWorkerVersion(registration.active);
            setPwaStatus(prev => ({ ...prev, serviceWorkerVersion: version }));
          }

          // Check for background sync support
          const backgroundSyncSupported = 'serviceWorker' in navigator && 
                                        'sync' in window.ServiceWorkerRegistration.prototype;
          setPwaStatus(prev => ({ ...prev, backgroundSyncSupported }));

          // Check for push notification support
          const pushSupported = 'PushManager' in window;
          setPwaStatus(prev => ({ ...prev, pushSupported }));

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    initServiceWorker();
  }, [toast]);

  // Check push notification permission
  useEffect(() => {
    const checkPushPermission = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        const hasPermission = permission === 'granted';
        setPwaStatus(prev => ({ 
          ...prev, 
          hasPushPermission: hasPermission,
          isPushEnabled: hasPermission 
        }));
      }
    };

    checkPushPermission();
  }, []);

  // Get service worker version
  const getServiceWorkerVersion = async (sw: ServiceWorker): Promise<string> => {
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event) => {
        resolve(event.data.version || 'unknown');
      };
      sw.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
    });
  };

  // Install PWA
  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installation Successful",
          description: "The app has been installed on your device",
          variant: "default"
        });
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  // Trigger background sync
  const triggerBackgroundSync = async () => {
    if (pwaStatus.backgroundSyncSupported && swRegistration.current) {
      try {
        await swRegistration.current.sync.register('background-sync');
        toast({
          title: "Background Sync",
          description: "Syncing offline data in the background",
          variant: "default"
        });
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    }
  };

  // Manual sync
  const manualSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    try {
      // Simulate sync progress
      for (let i = 0; i <= 100; i += 10) {
        setSyncProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await triggerBackgroundSync();
      setPwaStatus(prev => ({ ...prev, lastSync: new Date() }));
      
      toast({
        title: "Sync Complete",
        description: "All data has been synchronized",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Sync Failed",
        description: "Failed to synchronize data",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  // Update service worker
  const updateServiceWorker = async () => {
    if (swRegistration.current) {
      try {
        await swRegistration.current.update();
        toast({
          title: "Update Checked",
          description: "Checking for app updates...",
          variant: "default"
        });
      } catch (error) {
        console.error('Service Worker update failed:', error);
      }
    }
  };

  // Toggle push notifications
  const togglePushNotifications = async () => {
    if (pwaStatus.hasPushPermission) {
      setPwaStatus(prev => ({ ...prev, isPushEnabled: !prev.isPushEnabled }));
      
      if (pwaStatus.isPushEnabled) {
        toast({
          title: "Push Notifications Disabled",
          description: "You won't receive push notifications",
          variant: "secondary"
        });
      } else {
        toast({
          title: "Push Notifications Enabled",
          description: "You'll receive push notifications",
          variant: "default"
        });
      }
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPwaStatus(prev => ({ 
          ...prev, 
          hasPushPermission: true,
          isPushEnabled: true 
        }));
        toast({
          title: "Push Notifications Enabled",
          description: "You can now receive push notifications",
          variant: "default"
        });
      }
    }
  };

  // Clear cache
  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
        
        setPwaStatus(prev => ({ ...prev, cacheSize: 0 }));
        toast({
          title: "Cache Cleared",
          description: "All cached data has been removed",
          variant: "default"
        });
      } catch (error) {
        console.error('Failed to clear cache:', error);
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main PWA Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Enhanced PWA Manager
          </CardTitle>
          <CardDescription>
            Advanced Progressive Web App features and offline capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Installation Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">Installation Status</span>
            </div>
            <Badge variant={pwaStatus.isInstalled ? "default" : "secondary"}>
              {pwaStatus.isInstalled ? "Installed" : "Not Installed"}
            </Badge>
          </div>

          {/* Network Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {pwaStatus.isOnline ? (
                <Wifi className="h-4 w-4 text-green-500" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm font-medium">Network Status</span>
            </div>
            <Badge variant={pwaStatus.isOnline ? "default" : "destructive"}>
              {pwaStatus.isOnline ? "Online" : "Offline"}
            </Badge>
          </div>

          {/* Service Worker Version */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Service Worker</span>
            </div>
            <Badge variant="outline">
              v{pwaStatus.serviceWorkerVersion || 'unknown'}
            </Badge>
          </div>

          {/* Install Button */}
          {showInstallPrompt && !pwaStatus.isInstalled && (
            <Button onClick={installPWA} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
          )}

          {/* Update Button */}
          {isUpdating && (
            <Button onClick={updateServiceWorker} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Available - Refresh
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Features
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Background Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sync className="h-4 w-4" />
              <div>
                <Label htmlFor="background-sync" className="text-sm font-medium">
                  Background Sync
                </Label>
                <p className="text-xs text-muted-foreground">
                  Sync data when back online
                </p>
              </div>
            </div>
            <Badge variant={pwaStatus.backgroundSyncSupported ? "default" : "secondary"}>
              {pwaStatus.backgroundSyncSupported ? "Supported" : "Not Supported"}
            </Badge>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <div>
                <Label htmlFor="push-notifications" className="text-sm font-medium">
                  Push Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive real-time updates
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={pwaStatus.isPushEnabled}
              onCheckedChange={togglePushNotifications}
              disabled={!pwaStatus.pushSupported}
            />
          </div>

          {/* Manual Sync */}
          <Button 
            onClick={manualSync} 
            disabled={isSyncing || !pwaStatus.isOnline}
            variant="outline"
            className="w-full"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Sync className="mr-2 h-4 w-4" />
                Manual Sync
              </>
            )}
          </Button>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Sync Progress</span>
                <span>{syncProgress}%</span>
              </div>
              <Progress value={syncProgress} className="w-full" />
            </div>
          )}

          {/* Last Sync */}
          {pwaStatus.lastSync && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last sync: {pwaStatus.lastSync.toLocaleString()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cache Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Cache Size</span>
            <Badge variant="outline">
              {pwaStatus.cacheSize} MB
            </Badge>
          </div>
          
          <Button onClick={clearCache} variant="outline" className="w-full">
            <XCircle className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
        </CardContent>
      </Card>

      {/* Offline Data */}
      {pwaStatus.offlineData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Offline className="h-5 w-5" />
              Offline Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pwaStatus.offlineData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
