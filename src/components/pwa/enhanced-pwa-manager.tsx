'use client';

import { useState, useEffect } from 'react';
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
  Bell,
  Cloud,
  Database,
  Settings,
  CheckCircle,
  XCircle
} from 'lucide-react';


interface PWAStatus {
  isInstalled: boolean;
  isOnline: boolean;
  hasPushPermission: boolean;
  isPushEnabled: boolean;
  cacheSize: number;
  lastSync: Date | null;
  offlineData: string[];
}

interface EnhancedPWAManagerProps {
  className?: string;
}

export function EnhancedPWAManager({ className = "" }: EnhancedPWAManagerProps) {
  const [pwaStatus, setPwaStatus] = useState<PWAStatus>({
    isInstalled: false,
    isOnline: navigator.onLine,
    hasPushPermission: false,
    isPushEnabled: false,
    cacheSize: 0,
    lastSync: null,
    offlineData: []
  });

  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

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
    const handleOnline = () => setPwaStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setPwaStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Check push notification permissions
  useEffect(() => {
    const checkPushPermissions = async () => {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        const hasPermission = permission === 'granted';
        setPwaStatus(prev => ({ 
          ...prev, 
          hasPushPermission: hasPermission,
          isPushEnabled: hasPermission && localStorage.getItem('push-enabled') === 'true'
        }));
      }
    };

    checkPushPermissions();
  }, []);

  // Check cache size and offline data
  useEffect(() => {
    const checkCacheStatus = async () => {
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          let totalSize = 0;
          const offlineData: string[] = [];

          for (const name of cacheNames) {
            const cache = await caches.open(name);
            const requests = await cache.keys();
            offlineData.push(`${name}: ${requests.length} items`);
          }

          setPwaStatus(prev => ({ 
            ...prev, 
            cacheSize: totalSize,
            offlineData 
          }));
        } catch (error) {
          console.error('Error checking cache status:', error);
        }
      }
    };

    checkCacheStatus();
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const togglePushNotifications = async () => {
    if (!pwaStatus.hasPushPermission) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPwaStatus(prev => ({ ...prev, hasPushPermission: true, isPushEnabled: true }));
        localStorage.setItem('push-enabled', 'true');
        subscribeToPushNotifications();
      }
    } else {
      const newState = !pwaStatus.isPushEnabled;
      setPwaStatus(prev => ({ ...prev, isPushEnabled: newState }));
      localStorage.setItem('push-enabled', newState.toString());
      
      if (newState) {
        subscribeToPushNotifications();
      }
    }
  };

  const subscribeToPushNotifications = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
        });
        
        // Send subscription to server
        console.log('Push subscription:', subscription);
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
      }
    }
  };

  const sendTestNotification = () => {
    if (pwaStatus.isPushEnabled && 'Notification' in window) {
      const notification = new Notification('FixMyEvent', {
        body: 'This is a test notification from your PWA!',
        icon: '/images/icon-192x192.svg',
        badge: '/images/badge-72x72.svg',
        tag: 'test-notification'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const clearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        setPwaStatus(prev => ({ ...prev, cacheSize: 0, offlineData: [] }));
      } catch (error) {
        console.error('Error clearing cache:', error);
      }
    }
  };

  const syncOfflineData = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync process
    for (let i = 0; i <= 100; i += 10) {
      setSyncProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    setPwaStatus(prev => ({ ...prev, lastSync: new Date() }));
    setIsSyncing(false);
    setSyncProgress(0);
  };

  const getStatusIcon = (status: boolean) => {
    return status ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* PWA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            PWA Status
          </CardTitle>
          <CardDescription>Your Progressive Web App status and capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Status Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getStatusIcon(pwaStatus.isInstalled)}
              </div>
              <p className="text-sm font-medium">Installed</p>
              <p className={`text-xs ${getStatusColor(pwaStatus.isInstalled)}`}>
                {pwaStatus.isInstalled ? 'Yes' : 'No'}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                {pwaStatus.isOnline ? <Wifi className="h-4 w-4 text-green-500" /> : <WifiOff className="h-4 w-4 text-red-500" />}
              </div>
              <p className="text-sm font-medium">Connection</p>
              <p className={`text-xs ${getStatusColor(pwaStatus.isOnline)}`}>
                {pwaStatus.isOnline ? 'Online' : 'Offline'}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                {getStatusIcon(pwaStatus.hasPushPermission)}
              </div>
              <p className="text-sm font-medium">Push Enabled</p>
              <p className={`text-xs ${getStatusColor(pwaStatus.isPushEnabled)}`}>
                {pwaStatus.isPushEnabled ? 'Yes' : 'No'}
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Database className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-sm font-medium">Cache Size</p>
              <p className="text-xs text-gray-600">
                {pwaStatus.cacheSize} MB
              </p>
            </div>
          </div>

          {/* Install Prompt */}
          {showInstallPrompt && !pwaStatus.isInstalled && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Install FixMyEvent</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Add to your home screen for the best experience
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleInstall}>
                    Install
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowInstallPrompt(false)}
                  >
                    Later
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={sendTestNotification}
              disabled={!pwaStatus.isPushEnabled}
            >
              <Bell className="h-4 w-4 mr-2" />
              Test Notification
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
            >
              <Database className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Settings className="h-4 w-4 mr-2" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced PWA Settings */}
      {showAdvanced && (
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>Configure advanced PWA features and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Push Notifications */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Push Notifications
                </Label>
                <Switch
                  id="push-notifications"
                  checked={pwaStatus.isPushEnabled}
                  onCheckedChange={togglePushNotifications}
                  disabled={!pwaStatus.hasPushPermission}
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive notifications about bookings, updates, and special offers
              </p>
            </div>

            {/* Offline Sync */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Offline Data Sync
                </Label>
                <Button
                  size="sm"
                  onClick={syncOfflineData}
                  disabled={isSyncing || !pwaStatus.isOnline}
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
              
              {isSyncing && (
                <div className="space-y-2">
                  <Progress value={syncProgress} className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Syncing offline data... {syncProgress}%
                  </p>
                </div>
              )}
              
              {pwaStatus.lastSync && (
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Last synced: {pwaStatus.lastSync.toLocaleString()}
                </p>
              )}
            </div>

            {/* Offline Data */}
            {pwaStatus.offlineData.length > 0 && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Offline Data
                </Label>
                <div className="space-y-2">
                  {pwaStatus.offlineData.map((data, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-sm">{data}</span>
                      <Badge variant="secondary" className="text-xs">
                        Available Offline
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PWA Features */}
            <div className="space-y-3">
              <Label>PWA Features</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Offline Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Installable</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Background Sync</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
