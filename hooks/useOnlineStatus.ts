/**
 * Online Status Hook
 * Detects network connectivity and provides online/offline status
 */

import { useState, useEffect } from 'react';

export const useOnlineStatus = (): boolean => {
  // Initialize with navigator.onLine (browser's network status)
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    // Handler for when the connection comes back online
    const handleOnline = () => {
      console.log('Network: Connection restored');
      setIsOnline(true);
    };

    // Handler for when the connection goes offline
    const handleOffline = () => {
      console.log('Network: Connection lost');
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};
