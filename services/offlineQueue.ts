/**
 * Offline Queue Service
 * Manages failed API calls and processes them when connection is restored
 */

import { LocalStorageService, OfflineAction } from './localStorage';
import { UserAPI } from './userAPI';

export type QueueStatus = 'idle' | 'processing' | 'error';

export const OfflineQueue = {
  /**
   * Add action to queue
   */
  enqueue: (type: OfflineAction['type'], payload: any): void => {
    LocalStorageService.enqueueAction({ type, payload });
  },

  /**
   * Get current queue
   */
  getQueue: (): OfflineAction[] => {
    return LocalStorageService.getQueue();
  },

  /**
   * Get queue size
   */
  getQueueSize: (): number => {
    return LocalStorageService.getQueue().length;
  },

  /**
   * Clear entire queue
   */
  clearQueue: (): void => {
    LocalStorageService.clearQueue();
  },

  /**
   * Process a single action
   */
  processAction: async (action: OfflineAction, userId: string): Promise<boolean> => {
    try {
      switch (action.type) {
        case 'ADD_XP': {
          const result = await UserAPI.addXp(userId, action.payload.amount);
          return result !== null;
        }

        case 'UNLOCK_ARTIFACT': {
          const result = await UserAPI.unlockArtifact(userId, action.payload.artifactId);
          return result;
        }

        case 'COMPLETE_NODE': {
          const result = await UserAPI.completeNode(
            userId,
            action.payload.nodeId,
            action.payload.quizScore,
            action.payload.quizAttempts
          );
          return result;
        }

        default:
          console.warn('Unknown action type:', action.type);
          return false;
      }
    } catch (error) {
      console.error('Error processing action:', error);
      return false;
    }
  },

  /**
   * Process entire queue
   * Returns number of successfully processed actions
   */
  processQueue: async (userId: string, onProgress?: (processed: number, total: number) => void): Promise<number> => {
    const queue = LocalStorageService.getQueue();
    if (queue.length === 0) {
      return 0;
    }

    let processed = 0;
    const total = queue.length;

    for (const action of queue) {
      // Skip actions that have failed too many times
      if (action.retryCount >= 3) {
        console.warn('Action failed too many times, removing from queue:', action);
        LocalStorageService.dequeueAction(action.id);
        continue;
      }

      const success = await OfflineQueue.processAction(action, userId);

      if (success) {
        // Remove from queue on success
        LocalStorageService.dequeueAction(action.id);
        processed++;
      } else {
        // Increment retry count on failure
        LocalStorageService.incrementRetryCount(action.id);
      }

      // Report progress
      if (onProgress) {
        onProgress(processed, total);
      }
    }

    return processed;
  },

  /**
   * Process queue with exponential backoff for retries
   * This is a more sophisticated version that could be used in the future
   */
  processQueueWithBackoff: async (
    userId: string,
    onProgress?: (processed: number, total: number) => void
  ): Promise<number> => {
    const queue = LocalStorageService.getQueue();
    if (queue.length === 0) {
      return 0;
    }

    let processed = 0;
    const total = queue.length;

    for (const action of queue) {
      // Skip actions that have failed too many times
      if (action.retryCount >= 5) {
        console.warn('Action failed too many times, removing from queue:', action);
        LocalStorageService.dequeueAction(action.id);
        continue;
      }

      // Calculate backoff delay: 2^retryCount seconds
      const backoffDelay = Math.pow(2, action.retryCount) * 1000;
      const timeSinceLastAttempt = Date.now() - action.timestamp;

      // Skip if not enough time has passed since last attempt
      if (timeSinceLastAttempt < backoffDelay) {
        continue;
      }

      const success = await OfflineQueue.processAction(action, userId);

      if (success) {
        LocalStorageService.dequeueAction(action.id);
        processed++;
      } else {
        LocalStorageService.incrementRetryCount(action.id);
      }

      if (onProgress) {
        onProgress(processed, total);
      }
    }

    return processed;
  },

  /**
   * Check if there are any actions in the queue
   */
  hasQueuedActions: (): boolean => {
    return LocalStorageService.getQueue().length > 0;
  }
};
