import { TimelineNodeStub } from '../types';

/**
 * Configuration for node locking behavior within eras
 */
export interface NodeLockingConfig {
  /**
   * If true, all nodes will be unlocked regardless of completion status.
   * Useful for development/testing. When enabled, this takes precedence over
   * all other locking rules. (default: false)
   */
  unlockAll?: boolean;
  
  /**
   * Whether the first node in each era should always be unlocked when the era is unlocked (default: true)
   */
  firstNodeAlwaysUnlocked?: boolean;
  
  /**
   * Custom function to determine if a node should be locked
   * If provided, this overrides the default sequential locking behavior
   * 
   * @param node - The node to check
   * @param nodeIndex - The index of the node within its era
   * @param previousNode - The previous node in the era (if any)
   * @param completedNodeIds - Set of completed node IDs
   * @param eraNodes - All nodes in the same era
   * @returns true if the node should be locked, false otherwise
   */
  customLockCheck?: (
    node: TimelineNodeStub,
    nodeIndex: number,
    previousNode: TimelineNodeStub | null,
    completedNodeIds: Set<string>,
    eraNodes: TimelineNodeStub[]
  ) => boolean;
}

const DEFAULT_CONFIG: Required<Omit<NodeLockingConfig, 'customLockCheck'>> & { customLockCheck?: NodeLockingConfig['customLockCheck'] } = {
  unlockAll: false,
  firstNodeAlwaysUnlocked: true, // First node in each era is unlocked when era is unlocked
  customLockCheck: undefined as any,
};

/**
 * Parse a year string to extract a numeric year for sorting
 * Handles formats like "c. 10,800 BCE", "776 BCE", "1492 CE", etc.
 * Returns a number that can be used for chronological sorting
 */
function parseYearForSorting(year: string): number {
  // Remove "c. ", "ca. ", "circa ", etc.
  let cleaned = year.replace(/^(c\.|ca\.|circa|~)\s*/i, '').trim();
  
  // Remove commas
  cleaned = cleaned.replace(/,/g, '');
  
  // Extract number (may have decimals)
  const match = cleaned.match(/(\d+(?:\.\d+)?)/);
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  
  // Handle BCE (negative years, with year 0 = 1 BCE)
  if (cleaned.toUpperCase().includes('BCE') || cleaned.toUpperCase().includes('BC')) {
    return -num; // Negative for BCE
  }
  
  // Handle CE/AD (positive years)
  return num;
}

/**
 * Sort nodes within an era chronologically by year
 */
function sortNodesByYear(nodes: TimelineNodeStub[]): TimelineNodeStub[] {
  return [...nodes].sort((a, b) => {
    const yearA = parseYearForSorting(a.year);
    const yearB = parseYearForSorting(b.year);
    return yearA - yearB; // Earlier years first
  });
}

/**
 * Get all nodes for a specific era, sorted chronologically
 */
export function getEraNodesSorted(eraId: string, allNodes: TimelineNodeStub[]): TimelineNodeStub[] {
  const eraNodes = allNodes.filter(node => node.eraId === eraId);
  return sortNodesByYear(eraNodes);
}

/**
 * Check if a node should be locked based on completion status
 * 
 * Default behavior:
 * - First node in era is unlocked when era is unlocked (if firstNodeAlwaysUnlocked is true)
 * - Each subsequent node is locked until the previous node is completed
 * 
 * @param node - The node to check
 * @param eraId - The ID of the era this node belongs to
 * @param allNodes - All timeline nodes
 * @param completedNodeIds - Set of completed node IDs
 * @param isEraLocked - Whether the era containing this node is locked
 * @param config - Optional configuration to customize locking behavior
 * @returns true if the node should be locked, false otherwise
 */
export function isNodeLocked(
  node: TimelineNodeStub,
  eraId: string,
  allNodes: TimelineNodeStub[],
  completedNodeIds: Set<string>,
  isEraLocked: boolean,
  config: NodeLockingConfig = {}
): boolean {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // If the era is locked, all nodes in it are locked
  if (isEraLocked) {
    return true;
  }
  
  // If unlockAll is true, all nodes are unlocked
  if (finalConfig.unlockAll) {
    return false;
  }
  
  // Get sorted nodes for this era
  const eraNodes = getEraNodesSorted(eraId, allNodes);
  const nodeIndex = eraNodes.findIndex(n => n.id === node.id);
  
  // If node not found in era, lock it (shouldn't happen, but safety check)
  if (nodeIndex === -1) {
    return true;
  }
  
  // Use custom lock check if provided
  if (finalConfig.customLockCheck) {
    const previousNode = nodeIndex > 0 ? eraNodes[nodeIndex - 1] : null;
    return finalConfig.customLockCheck(node, nodeIndex, previousNode, completedNodeIds, eraNodes);
  }
  
  // Default sequential locking behavior
  // First node is always unlocked (if configured)
  if (nodeIndex === 0 && finalConfig.firstNodeAlwaysUnlocked) {
    return false;
  }
  
  // If there's no previous node and firstNodeAlwaysUnlocked is false, lock it
  if (nodeIndex === 0) {
    return true; // Locked if firstNodeAlwaysUnlocked is false
  }
  
  // Lock this node if the previous node is not completed
  const previousNode = eraNodes[nodeIndex - 1];
  return !completedNodeIds.has(previousNode.id);
}

/**
 * Get locked status for all nodes in a specific era
 * 
 * @param eraId - The ID of the era
 * @param allNodes - All timeline nodes
 * @param completedNodeIds - Set of completed node IDs
 * @param isEraLocked - Whether the era is locked
 * @param config - Optional configuration to customize locking behavior
 * @returns A map of node ID to locked status
 */
export function getEraNodeLockStatus(
  eraId: string,
  allNodes: TimelineNodeStub[],
  completedNodeIds: Set<string>,
  isEraLocked: boolean,
  config: NodeLockingConfig = {}
): Record<string, boolean> {
  const eraNodes = getEraNodesSorted(eraId, allNodes);
  const lockStatus: Record<string, boolean> = {};
  
  eraNodes.forEach(node => {
    lockStatus[node.id] = isNodeLocked(node, eraId, allNodes, completedNodeIds, isEraLocked, config);
  });
  
  return lockStatus;
}

/**
 * Get locked status for all nodes across all eras
 * 
 * @param eras - All eras
 * @param allNodes - All timeline nodes
 * @param completedNodeIds - Set of completed node IDs
 * @param eraLockStatus - Map of era ID to locked status
 * @param config - Optional configuration to customize locking behavior
 * @returns A map of node ID to locked status
 */
export function getAllNodeLockStatus(
  eras: { id: string }[],
  allNodes: TimelineNodeStub[],
  completedNodeIds: Set<string>,
  eraLockStatus: Record<string, boolean>,
  config: NodeLockingConfig = {}
): Record<string, boolean> {
  const nodeLockStatus: Record<string, boolean> = {};
  
  eras.forEach(era => {
    const eraNodeStatus = getEraNodeLockStatus(
      era.id,
      allNodes,
      completedNodeIds,
      eraLockStatus[era.id] ?? false,
      config
    );
    Object.assign(nodeLockStatus, eraNodeStatus);
  });
  
  return nodeLockStatus;
}
