'use client';

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { usePWA } from '@/hooks/use-pwa';

export function NetworkStatus() {
  const { isOnline, isUpdateAvailable } = usePWA();
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    if (!isOnline || isUpdateAvailable) {
      setShowStatus(true);
      
      // Hide status after 5 seconds for online status
      if (isOnline && !isUpdateAvailable) {
        const timer = setTimeout(() => setShowStatus(false), 5000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowStatus(false);
    }
  }, [isOnline, isUpdateAvailable]);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOnline ? (
        <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">You're offline</span>
        </div>
      ) : isUpdateAvailable ? (
        <div className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Update available</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 text-xs underline hover:no-underline"
          >
            Reload
          </button>
        </div>
      ) : (
        <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top-2">
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      )}
    </div>
  );
}
