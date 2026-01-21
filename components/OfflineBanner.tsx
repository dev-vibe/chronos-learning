/**
 * Offline Banner Component
 * Shows sync status at the top of the app
 */

import React from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff, Loader, CheckCircle, AlertCircle, Database } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { syncStatus, queueSize } = useUserProfile();
  const isOnline = useOnlineStatus();

  // Don't show banner if everything is synced and online
  if (isOnline && syncStatus === 'synced' && queueSize === 0) {
    return null;
  }

  // Determine banner appearance based on status
  let bgColor = 'bg-stone-900/95';
  let borderColor = 'border-stone-700';
  let textColor = 'text-stone-300';
  let icon = null;
  let message = '';

  if (!isOnline) {
    bgColor = 'bg-amber-950/95';
    borderColor = 'border-amber-500/50';
    textColor = 'text-amber-300';
    icon = <WifiOff size={16} />;
    message = `Offline Mode${queueSize > 0 ? ` • ${queueSize} action${queueSize > 1 ? 's' : ''} queued` : ''}`;
  } else if (syncStatus === 'syncing') {
    bgColor = 'bg-blue-950/95';
    borderColor = 'border-blue-500/50';
    textColor = 'text-blue-300';
    icon = <Loader size={16} className="animate-spin" />;
    message = 'Syncing to cloud...';
  } else if (syncStatus === 'error') {
    bgColor = 'bg-red-950/95';
    borderColor = 'border-red-500/50';
    textColor = 'text-red-300';
    icon = <AlertCircle size={16} />;
    message = 'Sync error - changes saved locally';
  } else if (queueSize > 0) {
    bgColor = 'bg-amber-950/95';
    borderColor = 'border-amber-500/50';
    textColor = 'text-amber-300';
    icon = <Database size={16} />;
    message = `${queueSize} action${queueSize > 1 ? 's' : ''} waiting to sync`;
  }

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 border-b ${borderColor} ${bgColor} backdrop-blur-sm`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className={`flex items-center justify-center gap-2 text-xs font-mono ${textColor}`}>
          {icon}
          <span className="uppercase tracking-wider">{message}</span>
        </div>
      </div>
    </div>
  );
};
