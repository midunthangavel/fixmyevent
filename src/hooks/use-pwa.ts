import { useState, useEffect } from 'react';

interface PWAState {
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  isLoading: boolean;
}

export function usePWA() {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstalled: false,
    isOnline: navigator.onLine,
    isUpdateAvailable: false,
    isLoading: true,
  });

  useEffect(() => {
    let registration: ServiceWorkerRegistration | null = null;

    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setPwaState(prev => ({
        ...prev,
        isInstalled: isStandalone || isIOSStandalone,
        isLoading: false,
      }));
    };

    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
    };

    const handleUpdateFound = () => {
      setPwaState(prev => ({ ...prev, isUpdateAvailable: true }));
    };

    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);

          // Check for updates
          registration.addEventListener('updatefound', handleUpdateFound);

          // Listen for service worker updates
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker updated, reloading...');
            window.location.reload();
          });

        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      }
    };

    // Initial setup
    checkInstallation();
    registerServiceWorker();

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for app installation changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      mediaQuery.removeEventListener('change', checkInstallation);
      
      if (registration) {
        registration.removeEventListener('updatefound', handleUpdateFound);
      }
    };
  }, []);

  const updateApp = () => {
    if (pwaState.isUpdateAvailable) {
      window.location.reload();
    }
  };

  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        await navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
      } catch (error) {
        console.error('Failed to check for updates:', error);
      }
    }
  };

  return {
    ...pwaState,
    updateApp,
    checkForUpdates,
  };
}
