import { getArcById, HISTORY_ARCS } from '../data/arcs';
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

interface MatrixArcPlacement {
  anchorNodeIdByArcId: Map<string, string>;
  canonicalArcIdByNodeId: Map<string, string>;
  laneArcIdsByAnchorNodeId: Map<string, string[]>;
  laneNodeIdsByArcId: Map<string, string[]>;
  spineNodeIds: string[];
}

const MATRIX_EXCLUDED_ARC_IDS = new Set(['world-spine']);
const MATRIX_GENERIC_ARC_IDS = new Set(['civilizations', 'ancient-cities', 'philosophy']);
const MATRIX_ARC_KIND_WEIGHT: Record<HistoryArc['kind'], number> = {
  civilization: 120,
  region: 95,
  empire: 105,
  religion: 95,
  philosophy: 85,
  technology: 90,
  trade: 85,
  migration: 80,
  war: 85,
  city: 90,
  idea: 75,
  archaeology: 70,
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
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  return getMatrixArcPlacement(nodes).spineNodeIds
    .map(nodeId => nodeById.get(nodeId))
    .filter((node): node is TimelineNodeStub => Boolean(node));
}

export function deriveMatrixRows(nodes: TimelineNodeStub[]): MatrixRow[] {
  const placement = getMatrixArcPlacement(nodes);
  const spineNodeIds = new Set(placement.spineNodeIds);
  const nodeIndexById = getNodeIndexById(nodes);
  const separators = [...WORLD_SPINE_SEPARATOR_CONFIG]
    .map(separator => ({
      ...separator,
      beforeNodeIndex: nodeIndexById.get(separator.beforeNodeId) ?? Number.POSITIVE_INFINITY,
    }))
    .sort((left, right) => left.beforeNodeIndex - right.beforeNodeIndex);
  const rows: MatrixRow[] = [];
  let nextSeparatorIndex = 0;

  nodes.forEach((node, nodeIndex) => {
    if (!spineNodeIds.has(node.id)) return;

    while (nextSeparatorIndex < separators.length && separators[nextSeparatorIndex].beforeNodeIndex <= nodeIndex) {
      const separator = separators[nextSeparatorIndex];
      rows.push({ type: 'separator', id: separator.id, label: separator.label });
      nextSeparatorIndex += 1;
    }

    rows.push({
      type: 'spine-node',
      nodeId: node.id,
      laneArcIds: placement.laneArcIdsByAnchorNodeId.get(node.id) ?? [],
    });
  });

  return rows;
}

export function getMatrixArcNodes(
  arcId: string,
  anchorNodeId: string,
  nodes: TimelineNodeStub[]
): TimelineNodeStub[] {
  const placement = getMatrixArcPlacement(nodes);
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  return (placement.laneNodeIdsByArcId.get(arcId) ?? [])
    .map(nodeId => nodeById.get(nodeId))
    .filter((node): node is TimelineNodeStub => Boolean(node));
}

export function getMatrixPlacementValidation(nodes: TimelineNodeStub[]): {
  duplicateNodeIds: string[];
  unplacedNodeIds: string[];
  visibleNodeCount: number;
  spineNodeCount: number;
  laneNodeCount: number;
} {
  const placement = getMatrixArcPlacement(nodes);
  const standaloneSpineNodeIds = placement.spineNodeIds.filter(
    nodeId => !placement.laneArcIdsByAnchorNodeId.has(nodeId)
  );
  const visibleNodeIds = [
    ...standaloneSpineNodeIds,
    ...[...placement.laneNodeIdsByArcId.values()].flat(),
  ];
  const visibleCountByNodeId = new Map<string, number>();

  for (const nodeId of visibleNodeIds) {
    visibleCountByNodeId.set(nodeId, (visibleCountByNodeId.get(nodeId) ?? 0) + 1);
  }

  return {
    duplicateNodeIds: [...visibleCountByNodeId.entries()]
      .filter(([, count]) => count > 1)
      .map(([nodeId]) => nodeId)
      .sort(),
    unplacedNodeIds: nodes
      .map(node => node.id)
      .filter(nodeId => !visibleCountByNodeId.has(nodeId))
      .sort(),
    visibleNodeCount: visibleNodeIds.length,
    spineNodeCount: placement.spineNodeIds.length,
    laneNodeCount: [...placement.laneNodeIdsByArcId.values()].reduce((total, nodeIds) => total + nodeIds.length, 0),
  };
}

export function createMatrixProgressResolver(
  completedNodeIds: Set<string>,
  nodes: TimelineNodeStub[],
  unlockAll = false
): MatrixProgressResolver {
  const placement = getMatrixArcPlacement(nodes);
  const worldSpineNodeIds = placement.spineNodeIds;
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

    const arcNodeIds = placement.laneNodeIdsByArcId.get(arcId) ?? [];
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

function getMatrixArcPlacement(nodes: TimelineNodeStub[]): MatrixArcPlacement {
  const nodeIndexById = getNodeIndexById(nodes);
  const matrixArcs = HISTORY_ARCS.filter(arc => !MATRIX_EXCLUDED_ARC_IDS.has(arc.id));
  const canonicalArcIdByNodeId = new Map<string, string>();

  for (const node of nodes) {
    const canonicalArc = getCanonicalMatrixArc(node.id, nodeIndexById, matrixArcs);
    if (canonicalArc) {
      canonicalArcIdByNodeId.set(node.id, canonicalArc.id);
    }
  }

  const anchorNodeIdByArcId = new Map<string, string>();
  const canonicalNodeIdsByArcId = new Map<string, string[]>();

  for (const [nodeId, arcId] of canonicalArcIdByNodeId) {
    const nodeIds = canonicalNodeIdsByArcId.get(arcId) ?? [];
    nodeIds.push(nodeId);
    canonicalNodeIdsByArcId.set(arcId, nodeIds);
  }

  for (const arc of matrixArcs) {
    const canonicalNodeIds = canonicalNodeIdsByArcId.get(arc.id);
    if (!canonicalNodeIds?.length) continue;

    const anchorNodeId = getMatrixArcAnchorNodeId(arc, canonicalNodeIds, nodeIndexById);
    if (anchorNodeId) {
      anchorNodeIdByArcId.set(arc.id, anchorNodeId);
    }
  }

  const laneArcIdsByAnchorNodeId = new Map<string, string[]>();
  const laneNodeIdsByArcId = new Map<string, string[]>();
  const anchorNodeIds = new Set(anchorNodeIdByArcId.values());
  const laneNodeIds = new Set<string>();

  for (const arc of matrixArcs) {
    const anchorNodeId = anchorNodeIdByArcId.get(arc.id);
    if (!anchorNodeId) continue;

    const laneNodeIdsForArc = (canonicalNodeIdsByArcId.get(arc.id) ?? [])
      .sort((left, right) => (nodeIndexById.get(left) ?? 0) - (nodeIndexById.get(right) ?? 0));

    if (laneNodeIdsForArc.length === 0) continue;

    laneNodeIdsByArcId.set(arc.id, laneNodeIdsForArc);
    laneNodeIdsForArc.forEach(nodeId => laneNodeIds.add(nodeId));

    const laneArcIds = laneArcIdsByAnchorNodeId.get(anchorNodeId) ?? [];
    laneArcIds.push(arc.id);
    laneArcIdsByAnchorNodeId.set(anchorNodeId, laneArcIds);
  }

  for (const [anchorNodeId, laneArcIds] of laneArcIdsByAnchorNodeId) {
    laneArcIdsByAnchorNodeId.set(
      anchorNodeId,
      laneArcIds.sort((left, right) => {
        const leftArc = getArcById(left);
        const rightArc = getArcById(right);
        return getArcSortWeight(rightArc) - getArcSortWeight(leftArc);
      })
    );
  }

  const spineNodeIds = nodes
    .map(node => node.id)
    .filter(nodeId => anchorNodeIds.has(nodeId) || !laneNodeIds.has(nodeId));

  return {
    anchorNodeIdByArcId,
    canonicalArcIdByNodeId,
    laneArcIdsByAnchorNodeId,
    laneNodeIdsByArcId,
    spineNodeIds,
  };
}

function getCanonicalMatrixArc(
  nodeId: string,
  nodeIndexById: Map<string, number>,
  matrixArcs: HistoryArc[]
): HistoryArc | null {
  const candidates = matrixArcs.filter(arc => arc.nodeIds.includes(nodeId));
  if (candidates.length === 0) return null;

  return candidates
    .map(arc => ({ arc, score: getCanonicalArcScore(nodeId, arc, nodeIndexById) }))
    .sort((left, right) => right.score - left.score || left.arc.id.localeCompare(right.arc.id))[0].arc;
}

function getCanonicalArcScore(
  nodeId: string,
  arc: HistoryArc,
  nodeIndexById: Map<string, number>
): number {
  const nodeIndex = nodeIndexById.get(nodeId) ?? 0;
  const anchorIndex = getEarliestNodeIndex([...arc.startNodeIds, ...arc.nodeIds], nodeIndexById);
  const distanceFromAnchor = Math.abs(nodeIndex - anchorIndex);

  return (
    (arc.startNodeIds.includes(nodeId) ? 10_000 : 0) +
    (arc.coverageTier === 'major' ? 500 : arc.coverageTier === 'deep' ? 250 : 0) +
    (arc.parentArcIds?.length ? 160 : 0) +
    (MATRIX_ARC_KIND_WEIGHT[arc.kind] ?? 0) +
    Math.max(0, 120 - arc.nodeIds.length) -
    (MATRIX_GENERIC_ARC_IDS.has(arc.id) ? 450 : 0) -
    distanceFromAnchor
  );
}

function getMatrixArcAnchorNodeId(
  arc: HistoryArc,
  canonicalNodeIds: string[],
  nodeIndexById: Map<string, number>
): string | null {
  const startNodeIds = arc.startNodeIds
    .filter(nodeId => canonicalNodeIds.includes(nodeId) && nodeIndexById.has(nodeId))
    .sort((left, right) => (nodeIndexById.get(left) ?? 0) - (nodeIndexById.get(right) ?? 0));

  if (startNodeIds[0]) return startNodeIds[0];

  return [...canonicalNodeIds]
    .filter(nodeId => nodeIndexById.has(nodeId))
    .sort((left, right) => (nodeIndexById.get(left) ?? 0) - (nodeIndexById.get(right) ?? 0))[0] ?? null;
}

function getNodeIndexById(nodes: TimelineNodeStub[]): Map<string, number> {
  return new Map(nodes.map((node, index) => [node.id, index]));
}

function getEarliestNodeIndex(nodeIds: string[], nodeIndexById: Map<string, number>): number {
  return Math.min(
    ...nodeIds
      .map(nodeId => nodeIndexById.get(nodeId))
      .filter((index): index is number => typeof index === 'number')
  );
}

function getArcSortWeight(arc: HistoryArc | null): number {
  if (!arc) return 0;
  return (
    (arc.coverageTier === 'major' ? 500 : arc.coverageTier === 'deep' ? 250 : 0) +
    (arc.parentArcIds?.length ? 160 : 0) +
    (MATRIX_ARC_KIND_WEIGHT[arc.kind] ?? 0) +
    Math.max(0, 120 - arc.nodeIds.length) -
    (MATRIX_GENERIC_ARC_IDS.has(arc.id) ? 450 : 0)
  );
}
