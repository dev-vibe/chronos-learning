import { Era, TimelineNodeStub } from '../types';
import { GamificationService } from './gamification';

/**
 * Configuration for era locking behavior
 * This makes it easy to adjust locking rules without changing the core logic
 * 
 * Example usage:
 * ```typescript
 * // Unlock all eras (for development/testing)
 * getEraLockStatus(eras, nodes, completedIds, { unlockAll: true });
 * 
 * // Custom locking logic
 * getEraLockStatus(eras, nodes, completedIds, {
 *   customLockCheck: (era, index, prevEra, completed, allNodes) => {
 *     // Your custom logic here
 *     return false; // unlocked
 *   }
 * });
 * ```
 */
export interface EraLockingConfig {
  /**
   * If true, all eras will be unlocked regardless of completion status.
   * Useful for development/testing. When enabled, this takes precedence over
   * all other locking rules. (default: false)
   */
  unlockAll?: boolean;
  
  /**
   * Whether the first era should always be unlocked (default: true)
   */
  firstEraAlwaysUnlocked?: boolean;
  
  /**
   * Custom function to determine if an era should be locked
   * If provided, this overrides the default sequential locking behavior
   * 
   * @param era - The era to check
   * @param eraIndex - The index of the era in the eras array
   * @param previousEra - The previous era (if any)
   * @param completedNodeIds - Set of completed node IDs
   * @param allNodes - All timeline nodes
   * @returns true if the era should be locked, false otherwise
   */
  customLockCheck?: (
    era: Era,
    eraIndex: number,
    previousEra: Era | null,
    completedNodeIds: Set<string>,
    allNodes: TimelineNodeStub[]
  ) => boolean;
}

const DEFAULT_CONFIG: Required<Omit<EraLockingConfig, 'customLockCheck'>> & { customLockCheck?: EraLockingConfig['customLockCheck'] } = {
  unlockAll: false,
  firstEraAlwaysUnlocked: true, // Only the first era (Prelude: The Thaw) is unlocked by default
  customLockCheck: undefined as any,
};

/**
 * Get all node IDs for a specific era
 */
function getEraNodeIds(eraId: string, allNodes: TimelineNodeStub[]): string[] {
  return allNodes
    .filter(node => node.eraId === eraId)
    .map(node => node.id);
}

/**
 * Check if all nodes in an era are completed
 */
function isEraCompleted(eraId: string, allNodes: TimelineNodeStub[], completedNodeIds: Set<string>): boolean {
  const eraNodeIds = getEraNodeIds(eraId, allNodes);
  if (eraNodeIds.length === 0) return true; // Empty eras are considered "completed"
  return eraNodeIds.every(nodeId => completedNodeIds.has(nodeId));
}

/**
 * Check if an era should be locked based on completion status
 * 
 * Default behavior:
 * - First era is always unlocked (if firstEraAlwaysUnlocked is true)
 * - Each subsequent era is locked until all nodes from the previous era are completed
 * 
 * @param era - The era to check
 * @param eraIndex - The index of the era in the eras array
 * @param allEras - All eras in order
 * @param allNodes - All timeline nodes
 * @param completedNodeIds - Set of completed node IDs
 * @param config - Optional configuration to customize locking behavior
 * @returns true if the era should be locked, false otherwise
 */
export function isEraLocked(
  era: Era,
  eraIndex: number,
  allEras: Era[],
  allNodes: TimelineNodeStub[],
  completedNodeIds: Set<string>,
  config: EraLockingConfig = {}
): boolean {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // If unlockAll is true, all eras are unlocked
  if (finalConfig.unlockAll) {
    return false;
  }
  
  // Use custom lock check if provided
  if (finalConfig.customLockCheck) {
    const previousEra = eraIndex > 0 ? allEras[eraIndex - 1] : null;
    return finalConfig.customLockCheck(era, eraIndex, previousEra, completedNodeIds, allNodes);
  }
  
  // Default sequential locking behavior
  // First era is always unlocked (if configured)
  if (eraIndex === 0 && finalConfig.firstEraAlwaysUnlocked) {
    return false;
  }
  
  // If there's no previous era and firstEraAlwaysUnlocked is false, lock it
  if (eraIndex === 0) {
    return true; // Locked if firstEraAlwaysUnlocked is false
  }
  
  // Lock this era if the previous era is not completed
  const previousEra = allEras[eraIndex - 1];
  return !isEraCompleted(previousEra.id, allNodes, completedNodeIds);
}

/**
 * Get locked status for all eras
 * This is a convenience function that computes locked status for the entire era list
 * 
 * @param eras - All eras in order
 * @param allNodes - All timeline nodes
 * @param completedNodeIds - Set of completed node IDs
 * @param config - Optional configuration to customize locking behavior
 * @returns A map of era ID to locked status
 */
export function getEraLockStatus(
  eras: Era[],
  allNodes: TimelineNodeStub[],
  completedNodeIds: Set<string>,
  config: EraLockingConfig = {}
): Record<string, boolean> {
  const lockStatus: Record<string, boolean> = {};
  
  eras.forEach((era, index) => {
    lockStatus[era.id] = isEraLocked(era, index, eras, allNodes, completedNodeIds, config);
  });
  
  return lockStatus;
}

/**
 * Get the number of completed nodes in an era
 */
export function getEraCompletionCount(eraId: string, allNodes: TimelineNodeStub[], completedNodeIds: Set<string>): number {
  const eraNodeIds = getEraNodeIds(eraId, allNodes);
  return eraNodeIds.filter(nodeId => completedNodeIds.has(nodeId)).length;
}

/**
 * Get the total number of nodes in an era
 */
export function getEraNodeCount(eraId: string, allNodes: TimelineNodeStub[]): number {
  return getEraNodeIds(eraId, allNodes).length;
}
