import { getArcById, getArcNodes, HISTORY_ARCS } from '../data/arcs';
import { HistoryArc, MatrixNodeProgressState, MatrixRow, TimelineNodeStub } from '../types';

interface WorldSpineSeparatorConfig {
  id: string;
  label: string;
  beforeNodeId: string;
}

const WORLD_SPINE_SEPARATOR_CONFIG: WorldSpineSeparatorConfig[] = [
  { id: 'prehistory', label: 'Prehistory', beforeNodeId: 'younger_dryas_reset' },
  { id: 'first-cities-bronze-age', label: 'First Cities and Bronze Age', beforeNodeId: 'uruk' },
  { id: 'classical-axial-age', label: 'Classical and Axial Age', beforeNodeId: 'zoroastrianism' },
  { id: 'post-classical-connections', label: 'Post-Classical Connections', beforeNodeId: 'paper' },
  { id: 'early-modern-world', label: 'Early Modern World', beforeNodeId: 'zheng_he' },
  { id: 'industrial-global-conflict', label: 'Industrial and Global Conflict', beforeNodeId: 'why_industrial_revolution' },
  { id: 'modern-digital-age', label: 'Modern and Digital Age', beforeNodeId: 'internet_arpanet' },
];

export const WORLD_SPINE_LANE_ARC_IDS_BY_NODE_ID: Record<string, string[]> = {
  younger_dryas_reset: ['migration'],
  neolithic_revolution: ['ancient-cities'],
  uruk: ['mesopotamia', 'sumer', 'ancient-cities'],
  sumer_writing: ['writing', 'mesopotamia'],
  narmer: ['egypt', 'nile-valley'],
  indus_cities: ['indus', 'bronze-age-trade', 'ancient-cities'],
  caral_norte_chico: ['andes', 'ancient-cities'],
  olmec: ['mesoamerica', 'olmec'],
  oracle_bones: ['china', 'writing', 'confucian-order'],
  zoroastrianism: ['persia', 'philosophy', 'abrahamic-philosophy'],
  cyrus: ['persia', 'mediterranean'],
  rome_founded: ['rome', 'mediterranean', 'ancient-cities'],
  buddha: ['buddhism', 'indian-philosophy', 'axial-age-philosophy'],
  confucius: ['confucian-order', 'chinese-philosophy', 'china'],
  socrates: ['greek-philosophy', 'axial-age-philosophy', 'philosophy'],
  qin_shi_huang: ['china', 'confucian-order'],
  alexander: ['greece', 'persia', 'warfare-systems'],
  augustus: ['rome', 'christianity'],
  jesus: ['christianity', 'judaism', 'abrahamic-philosophy'],
  paper: ['paper-printing', 'writing', 'china'],
  silk_road: ['silk-road', 'steppe', 'china'],
  islam_origins: ['islam', 'indian-ocean-trade', 'silk-road'],
  lindisfarne: ['ships-navigation'],
  ghana: ['trans-saharan-trade', 'sub-saharan-africa', 'islam'],
  polynesian_settlement: ['ships-navigation', 'migration'],
  genghis: ['mongols', 'steppe', 'silk-road'],
  mali_empire: ['trans-saharan-trade', 'sub-saharan-africa', 'islam'],
  zheng_he: ['ships-navigation', 'indian-ocean-trade'],
  columbus: ['atlantic-world', 'global-capitalism', 'ships-navigation'],
  galileo: ['scientific-revolution', 'philosophy'],
  locke: ['enlightenment-philosophy', 'philosophy'],
  why_industrial_revolution: ['industrialization', 'steam-electricity-computing-ai', 'global-capitalism'],
  ww1: ['world-wars', 'warfare-systems', 'gunpowder'],
  ww2_start: ['world-wars', 'warfare-systems'],
  internet_arpanet: ['steam-electricity-computing-ai', 'ai-ethics'],
  ai_boom: ['ai-ethics', 'steam-electricity-computing-ai', 'philosophy'],
};

export interface MatrixProgressResolver {
  completedNodeIds: Set<string>;
  worldSpineNodeIds: string[];
  getSpineNodeState: (nodeId: string) => MatrixNodeProgressState;
  getLaneNodeState: (arcId: string, nodeId: string) => MatrixNodeProgressState;
  isLaneUnlocked: (anchorNodeId: string) => boolean;
}

export function getWorldSpineArc(): HistoryArc {
  const worldSpineArc = getArcById('world-spine');
  if (!worldSpineArc) {
    throw new Error('Missing required world-spine arc.');
  }
  return worldSpineArc;
}

export function getWorldSpineNodes(nodes: TimelineNodeStub[]): TimelineNodeStub[] {
  return getArcNodes(getWorldSpineArc(), nodes);
}

export function deriveMatrixRows(nodes: TimelineNodeStub[]): MatrixRow[] {
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const separatorsByNodeId = new Map(WORLD_SPINE_SEPARATOR_CONFIG.map(separator => [separator.beforeNodeId, separator]));
  const rows: MatrixRow[] = [];

  for (const nodeId of getWorldSpineArc().nodeIds) {
    if (!nodeById.has(nodeId)) continue;

    const separator = separatorsByNodeId.get(nodeId);
    if (separator) {
      rows.push({ type: 'separator', id: separator.id, label: separator.label });
    }

    rows.push({
      type: 'spine-node',
      nodeId,
      laneArcIds: WORLD_SPINE_LANE_ARC_IDS_BY_NODE_ID[nodeId] ?? getFallbackLaneArcIds(nodeId),
    });
  }

  return rows;
}

export function createMatrixProgressResolver(
  completedNodeIds: Set<string>,
  nodes: TimelineNodeStub[],
  unlockAll = false
): MatrixProgressResolver {
  const worldSpineNodeIds = getWorldSpineNodes(nodes).map(node => node.id);
  const firstIncompleteSpineIndex = worldSpineNodeIds.findIndex(nodeId => !completedNodeIds.has(nodeId));
  const currentSpineIndex = firstIncompleteSpineIndex === -1 ? worldSpineNodeIds.length : firstIncompleteSpineIndex;

  const getSpineNodeState = (nodeId: string): MatrixNodeProgressState => {
    if (completedNodeIds.has(nodeId)) return 'completed';
    if (unlockAll) return 'available';

    const spineIndex = worldSpineNodeIds.indexOf(nodeId);
    if (spineIndex === -1) return 'future-locked';
    if (spineIndex === currentSpineIndex) return 'current';
    return spineIndex < currentSpineIndex ? 'available' : 'future-locked';
  };

  const getLaneNodeState = (arcId: string, nodeId: string): MatrixNodeProgressState => {
    if (completedNodeIds.has(nodeId)) return 'completed';
    if (unlockAll) return 'available';

    const arc = getArcById(arcId);
    if (!arc) return 'future-locked';

    const arcNodeIds = getArcNodes(arc, nodes).map(node => node.id);
    const nodeIndex = arcNodeIds.indexOf(nodeId);
    if (nodeIndex === -1) return 'future-locked';

    const firstIncompleteArcIndex = arcNodeIds.findIndex(candidateNodeId => !completedNodeIds.has(candidateNodeId));
    if (firstIncompleteArcIndex === -1) return 'available';

    return nodeIndex === firstIncompleteArcIndex ? 'current' : 'future-locked';
  };

  return {
    completedNodeIds,
    worldSpineNodeIds,
    getSpineNodeState,
    getLaneNodeState,
    isLaneUnlocked: (anchorNodeId: string) => {
      const state = getSpineNodeState(anchorNodeId);
      return state !== 'future-locked';
    },
  };
}

export function getArcNodeIdValidation(nodes: TimelineNodeStub[], arcs: HistoryArc[] = HISTORY_ARCS): string[] {
  const knownNodeIds = new Set(nodes.map(node => node.id));
  const missingReferences: string[] = [];

  for (const arc of arcs) {
    for (const nodeId of [...arc.startNodeIds, ...arc.nodeIds]) {
      if (!knownNodeIds.has(nodeId)) {
        missingReferences.push(`${arc.id}:${nodeId}`);
      }
    }
  }

  return [...new Set(missingReferences)].sort();
}

function getFallbackLaneArcIds(nodeId: string): string[] {
  return HISTORY_ARCS
    .filter(arc => arc.id !== 'world-spine')
    .filter(arc => arc.startNodeIds.includes(nodeId))
    .slice(0, 3)
    .map(arc => arc.id);
}
