import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  Check,
  ChevronRight,
  Flame,
  Headphones,
  Lock,
  LogOut,
  PlayCircle,
  Sparkles,
  UserCircle,
} from 'lucide-react';
import { getArcById, getArcFamily } from '../data/arcs';
import { STATIC_CONTENT } from '../staticContent';
import { UserProfile } from '../services/gamification';
import {
  createMatrixProgressResolver,
  deriveMatrixRows,
  getMatrixArcNodes,
  getMatrixPlacementValidation,
  getArcNodeIdValidation,
} from '../services/worldSpineMatrix';
import {
  HistoryArc,
  MatrixNodeProgressState,
  MatrixRow,
  TimelineNode,
  TimelineNodeStub,
} from '../types';
import { getImageUrlWithFallback } from '../utils/imageUtils';

interface WorldSpineMatrixProps {
  nodes: TimelineNodeStub[];
  arcs: HistoryArc[];
  userProfile: UserProfile;
  selectedNode: TimelineNode | null;
  selectedNodeLoading: boolean;
  initialScrollTop: number;
  initialLaneScrollLefts: Record<string, number>;
  unlockAll?: boolean;
  onMatrixScrollTopChange: (scrollTop: number) => void;
  onLaneScrollLeftChange: (laneKey: string, scrollLeft: number) => void;
  onSelectNode: (node: TimelineNodeStub, bypassLockCheck?: boolean) => void;
  onOpenLesson: () => void;
  onOpenProfile: () => void;
  onSignOut: () => void | Promise<void>;
}

export const WorldSpineMatrix: React.FC<WorldSpineMatrixProps> = ({
  nodes,
  arcs,
  userProfile,
  selectedNode,
  selectedNodeLoading,
  initialScrollTop,
  initialLaneScrollLefts,
  unlockAll = false,
  onMatrixScrollTopChange,
  onLaneScrollLeftChange,
  onSelectNode,
  onOpenLesson,
  onOpenProfile,
  onSignOut,
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const hasAppliedInitialScrollTop = useRef(false);
  const hasAppliedInitialLaneScrolls = useRef(false);
  const [activeLaneArcIds, setActiveLaneArcIds] = useState<Record<string, string>>({});
  const [expandedMobileNodeId, setExpandedMobileNodeId] = useState<string | null>(null);

  const nodeById = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const rows = useMemo(() => deriveMatrixRows(nodes), [nodes]);
  const completedNodeIds = useMemo(() => new Set(userProfile.nodesCompleted), [userProfile.nodesCompleted]);
  const progress = useMemo(
    () => createMatrixProgressResolver(completedNodeIds, nodes, unlockAll),
    [completedNodeIds, nodes, unlockAll]
  );
  const matrixSections = useMemo(() => groupMatrixRowsIntoSections(rows), [rows]);
  const totalLessonCount = nodes.length;
  const completedCount = completedNodeIds.size;
  const progressPercent = totalLessonCount > 0 ? Math.min(100, Math.round((completedCount / totalLessonCount) * 100)) : 0;

  const selectedRelatedArcs = useMemo(() => {
    if (!selectedNode?.arcIds) return [];
    return selectedNode.arcIds
      .filter(arcId => arcId !== 'world-spine')
      .map(getArcById)
      .filter((arc): arc is HistoryArc => Boolean(arc))
      .slice(0, 6);
  }, [selectedNode]);

  useEffect(() => {
    const missingArcReferences = getArcNodeIdValidation(nodes, arcs);
    if (missingArcReferences.length > 0) {
      console.warn(`[WorldSpineMatrix] Missing arc node references: ${missingArcReferences.join(', ')}`);
    }

    const placementValidation = getMatrixPlacementValidation(nodes);
    if (placementValidation.duplicateNodeIds.length > 0 || placementValidation.unplacedNodeIds.length > 0) {
      console.warn('[WorldSpineMatrix] Invalid matrix placement', placementValidation);
    }
  }, [arcs, nodes]);

  useEffect(() => {
    if (!scrollRef.current || hasAppliedInitialScrollTop.current) return;
    scrollRef.current.scrollTop = initialScrollTop;
    hasAppliedInitialScrollTop.current = true;
  }, [initialScrollTop]);

  useEffect(() => {
    if (hasAppliedInitialLaneScrolls.current) return;

    for (const [laneKey, scrollLeft] of Object.entries(initialLaneScrollLefts)) {
      const lane = laneRefs.current[laneKey];
      if (lane) lane.scrollLeft = scrollLeft;
    }

    hasAppliedInitialLaneScrolls.current = true;
  }, [initialLaneScrollLefts, rows]);

  const getActiveLaneArcId = (row: Extract<MatrixRow, { type: 'spine-node' }>): string | null => {
    const validLaneArcIds = row.laneArcIds.filter(arcId => Boolean(getArcById(arcId)));
    return activeLaneArcIds[row.nodeId] ?? validLaneArcIds[0] ?? null;
  };

  const selectMatrixNode = (node: TimelineNodeStub, state: MatrixNodeProgressState) => {
    if (state === 'future-locked') return;
    setExpandedMobileNodeId(current => (current === node.id ? null : node.id));
    onSelectNode(node, true);
  };

  return (
    <div className="flex h-screen w-screen max-w-full flex-col overflow-hidden bg-[#071014] text-stone-200 font-sans md:grid md:grid-cols-[minmax(0,1fr)_minmax(320px,400px)]">
      <section className="relative min-h-0 min-w-0 flex-1 overflow-hidden border-y border-stone-800/80 bg-[#071014] md:h-screen md:border-y-0 md:border-r">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        <div className="relative z-10 flex h-full flex-col px-3 py-3 md:px-5 md:py-4">
          <MatrixTopBar
            userProfile={userProfile}
            progressPercent={progressPercent}
            completedCount={completedCount}
            totalLessonCount={totalLessonCount}
            onOpenProfile={onOpenProfile}
            onSignOut={onSignOut}
          />

          <div className="mb-3 grid gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 md:sticky md:top-0 md:z-30 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="rounded border border-stone-800 bg-black/50 px-3 py-2">World Spine</div>
            <div className="hidden rounded border border-stone-800 bg-black/50 px-3 py-2 md:block">Arcs</div>
          </div>

          <div
            ref={scrollRef}
            onScroll={event => {
              onMatrixScrollTopChange(event.currentTarget.scrollTop);
            }}
            className="chronos-scroll-y relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded border border-stone-800/90 bg-black/35 shadow-2xl"
          >
            <div>
              {matrixSections.map((section, sectionIndex) => {
                const isFutureSection =
                  !unlockAll &&
                  section.spineRows.length > 0 &&
                  section.spineRows.every(
                    row => progress.getSpineNodeState(row.nodeId) === 'future-locked'
                  );

                if (isFutureSection) {
                  return (
                    <CollapsedEraSection
                      key={section.separator?.id ?? `collapsed-${sectionIndex}`}
                      label={section.separator?.label ?? 'Upcoming'}
                      lessonCount={section.spineRows.length}
                    />
                  );
                }

                return (
                  <React.Fragment key={section.separator?.id ?? `section-${sectionIndex}`}>
                    {section.separator && <SeparatorRow row={section.separator} />}
                    {section.spineRows.map(row => {
                      const node = nodeById.get(row.nodeId);
                      if (!node) return null;

                      const state = progress.getSpineNodeState(node.id);
                      const laneArcId = getActiveLaneArcId(row);
                      const activeArc = getArcById(laneArcId);
                      const arcNodes = laneArcId ? getMatrixArcNodes(laneArcId, row.nodeId, nodes) : [];
                      const isArcRow = Boolean(laneArcId && activeArc);
                      const isSelected = isArcRow
                        ? arcNodes.some(arcNode => arcNode.id === selectedNode?.id)
                        : selectedNode?.id === node.id;
                      const isMobileExpanded = expandedMobileNodeId === node.id || isSelected;

                      return (
                        <div
                          key={row.nodeId}
                          className="grid min-h-[104px] border-b border-cyan-900/30 md:h-[104px] md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]"
                        >
                          <div className="sticky left-0 z-20 flex h-full items-center border-r border-stone-800 bg-[#071014]/95 px-2 backdrop-blur md:px-3">
                            {isArcRow && activeArc && laneArcId ? (
                              <ArcSpineCard
                                arc={activeArc}
                                state={state}
                                selected={isSelected}
                                familyTitle={getArcFamily(activeArc)?.title ?? activeArc.kind}
                                nodeCount={arcNodes.length}
                                onSelect={() => {
                                  if (state === 'future-locked') return;

                                  const firstSelectableArcNode =
                                    arcNodes.find(
                                      arcNode => progress.getLaneNodeState(laneArcId, arcNode.id) !== 'future-locked'
                                    ) ?? arcNodes[0];
                                  if (!firstSelectableArcNode) return;

                                  selectMatrixNode(
                                    firstSelectableArcNode,
                                    progress.getLaneNodeState(laneArcId, firstSelectableArcNode.id)
                                  );
                                }}
                              />
                            ) : (
                              <SpineNodeCard
                                node={node}
                                state={state}
                                selected={isSelected}
                                role={node.arcRoles?.['world-spine']}
                                onSelect={() => selectMatrixNode(node, state)}
                              />
                            )}
                          </div>

                          <div
                            className={`${isMobileExpanded ? 'block' : 'hidden'} h-auto px-3 py-2 md:flex md:h-full md:items-center md:py-0`}
                          >
                            {laneArcId ? (
                              <ArcLane
                                anchorNodeId={row.nodeId}
                                arcId={laneArcId}
                                nodes={nodes}
                                selectedNodeId={selectedNode?.id ?? null}
                                laneUnlocked={progress.isLaneUnlocked(row.nodeId)}
                                completedNodeIds={completedNodeIds}
                                getLaneNodeState={progress.getLaneNodeState}
                                onSelectNode={(laneNode, laneNodeState) => selectMatrixNode(laneNode, laneNodeState)}
                                onLaneScrollLeftChange={onLaneScrollLeftChange}
                                laneRefs={laneRefs}
                              />
                            ) : (
                              <div aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <LessonPreviewPanel
        selectedNode={selectedNode}
        selectedNodeLoading={selectedNodeLoading}
        relatedArcs={selectedRelatedArcs}
        onOpenLesson={onOpenLesson}
      />
    </div>
  );
};

interface MatrixTopBarProps {
  userProfile: UserProfile;
  progressPercent: number;
  completedCount: number;
  totalLessonCount: number;
  onOpenProfile: () => void;
  onSignOut: () => void | Promise<void>;
}

const MatrixTopBar: React.FC<MatrixTopBarProps> = ({
  userProfile,
  progressPercent,
  completedCount,
  totalLessonCount,
  onOpenProfile,
  onSignOut,
}) => {
  return (
    <header className="mb-3 rounded-md border border-stone-800 bg-black/30 p-3 shadow-lg backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[150px]">
          <h1 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">CHRONOS</h1>
          <div className="mt-1.5 h-px w-24 bg-cyan-400/60" />
        </div>

        <div className="flex min-w-[190px] flex-1 items-center gap-3 rounded border border-stone-800 bg-stone-950/45 px-3 py-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold leading-none text-white">{progressPercent}%</span>
              <span className="text-xs text-stone-500">complete</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-stone-900">
              <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
            </div>
            <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-stone-500">
              {completedCount} / {totalLessonCount} lessons
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="min-w-[154px] rounded border border-stone-800 bg-stone-950/45 px-3 py-2 text-left transition-colors hover:border-cyan-500/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950/30 text-cyan-200">
              <UserCircle size={22} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">Explorer {userProfile.level}</div>
              <div className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-stone-500">{userProfile.xp} XP</div>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSignOut}
            className="rounded border border-stone-800 bg-stone-950/45 p-2 text-stone-500 transition-colors hover:border-red-500/40 hover:text-red-300"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

interface MatrixSection {
  separator: Extract<MatrixRow, { type: 'separator' }> | null;
  spineRows: Extract<MatrixRow, { type: 'spine-node' }>[];
}

function groupMatrixRowsIntoSections(rows: MatrixRow[]): MatrixSection[] {
  const sections: MatrixSection[] = [];
  let current: MatrixSection = { separator: null, spineRows: [] };

  for (const row of rows) {
    if (row.type === 'separator') {
      if (current.separator !== null || current.spineRows.length > 0) {
        sections.push(current);
      }
      current = { separator: row, spineRows: [] };
      continue;
    }

    current.spineRows.push(row);
  }

  if (current.separator !== null || current.spineRows.length > 0) {
    sections.push(current);
  }

  return sections;
}

const CollapsedEraSection: React.FC<{ label: string; lessonCount: number }> = ({ label, lessonCount }) => (
  <div className="grid h-10 border-b border-stone-800/80 bg-black/25 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]">
    <div className="sticky left-0 z-20 flex items-center gap-2 border-r border-stone-800 bg-[#071014]/95 px-4 backdrop-blur">
      <Lock size={12} className="shrink-0 text-stone-600" />
      <span className="truncate text-[10px] font-mono font-bold uppercase tracking-widest text-stone-600">{label}</span>
      <span className="ml-auto shrink-0 text-[9px] font-mono uppercase tracking-wider text-stone-700">
        {lessonCount} {lessonCount === 1 ? 'lesson' : 'lessons'}
      </span>
    </div>
    <div className="hidden items-center px-3 md:flex">
      <div className="h-px w-full bg-stone-800/60" />
    </div>
  </div>
);

const SeparatorRow: React.FC<{ row: Extract<MatrixRow, { type: 'separator' }> }> = ({ row }) => (
  <div
    className="grid h-8 border-b border-stone-800/80 bg-black/40 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[280px_minmax(0,1fr)]"
  >
    <div className="sticky left-0 z-20 flex items-center border-r border-stone-800 bg-[#071014]/95 px-5 backdrop-blur">
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">{row.label}</span>
    </div>
    <div className="flex items-center px-3">
      <div className="h-px w-full bg-stone-800" />
    </div>
  </div>
);

interface SpineNodeCardProps {
  node: TimelineNodeStub;
  state: MatrixNodeProgressState;
  selected: boolean;
  role?: string;
  onSelect: () => void;
}

const SpineNodeCard: React.FC<SpineNodeCardProps> = ({ node, state, selected, role, onSelect }) => {
  const isLocked = state === 'future-locked';
  const content = STATIC_CONTENT[node.id];
  const imageUrl = getImageUrlWithFallback(content?.heroImageUrl);

  return (
    <button
      type="button"
      data-node-id={node.id}
      onClick={onSelect}
      disabled={isLocked}
      className={`group relative flex h-[82px] w-full items-center gap-2 rounded-md border p-2 text-left transition-all ${
        selected
          ? 'border-cyan-400 bg-cyan-950/35 shadow-[0_0_18px_rgba(34,211,238,0.16)]'
          : isLocked
            ? 'cursor-not-allowed border-stone-800 bg-stone-950/40 opacity-55'
            : 'border-stone-800 bg-stone-950/65 hover:border-cyan-500/50 hover:bg-cyan-950/15'
      }`}
    >
      <div className="absolute -left-[1.12rem] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-cyan-900 bg-[#071014]">
        <div className={`absolute inset-0.5 rounded-full ${selected ? 'bg-cyan-300' : state === 'completed' ? 'bg-emerald-400' : isLocked ? 'bg-stone-700' : 'bg-cyan-600'}`} />
      </div>
      <div className="absolute -left-[0.72rem] top-1/2 h-px w-3 -translate-y-1/2 bg-cyan-900/80" />

      <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-stone-800 bg-stone-900">
        {isLocked ? (
          <div className="flex h-full w-full items-center justify-center text-stone-600">
            <Lock size={18} />
          </div>
        ) : (
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-95" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className={`truncate text-[10px] font-mono font-bold ${isLocked ? 'text-stone-600' : 'text-cyan-300'}`}>
            {node.year}
          </span>
          <StateGlyph state={state} />
        </div>
        <div className={`line-clamp-2 text-xs font-bold leading-tight ${isLocked ? 'text-stone-500' : 'text-white'}`}>
          {node.title}
        </div>
        {role && !isLocked && (
          <span className="mt-1 inline-block rounded border border-cyan-500/30 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider text-cyan-200">
            {role.replace('_', ' ')}
          </span>
        )}
      </div>
    </button>
  );
};

interface ArcSpineCardProps {
  arc: HistoryArc;
  state: MatrixNodeProgressState;
  selected: boolean;
  familyTitle: string;
  nodeCount: number;
  onSelect: () => void;
}

const ArcSpineCard: React.FC<ArcSpineCardProps> = ({
  arc,
  state,
  selected,
  familyTitle,
  nodeCount,
  onSelect,
}) => {
  const isLocked = state === 'future-locked';
  const imageUrl = getImageUrlWithFallback(undefined);

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={isLocked}
      className={`group relative flex h-[82px] w-full items-center gap-2 rounded-md border p-2 text-left transition-all ${
        selected
          ? 'border-cyan-400 bg-cyan-950/35 shadow-[0_0_18px_rgba(34,211,238,0.16)]'
          : isLocked
            ? 'cursor-not-allowed border-stone-800 bg-stone-950/40 opacity-55'
            : 'border-stone-800 bg-stone-950/65 hover:border-cyan-500/50 hover:bg-cyan-950/15'
      }`}
    >
      <div className="absolute -left-[1.12rem] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-cyan-900 bg-[#071014]">
        <div className={`absolute inset-0.5 rounded-full ${selected ? 'bg-cyan-300' : state === 'completed' ? 'bg-emerald-400' : isLocked ? 'bg-stone-700' : 'bg-cyan-600'}`} />
      </div>
      <div className="absolute -left-[0.72rem] top-1/2 h-px w-3 -translate-y-1/2 bg-cyan-900/80" />

      <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-stone-800 bg-stone-900">
        <img src={imageUrl} alt="" className={`h-full w-full object-cover ${isLocked ? 'opacity-30 grayscale' : 'opacity-65 transition-opacity group-hover:opacity-85'}`} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className={`truncate text-[10px] font-mono font-bold uppercase ${isLocked ? 'text-stone-600' : 'text-cyan-300'}`}>
            Arc
          </span>
          <StateGlyph state={state} />
        </div>
        <div className={`line-clamp-2 text-xs font-bold leading-tight ${isLocked ? 'text-stone-500' : 'text-white'}`}>
          {arc.title}
        </div>
        <div className="mt-1 flex items-center gap-1.5">
          <span className="rounded border border-cyan-500/25 px-1.5 py-0.5 text-[8px] font-mono uppercase tracking-wider text-cyan-200">
            {familyTitle}
          </span>
          <span className="text-[8px] font-mono uppercase tracking-wider text-stone-500">
            {nodeCount} {nodeCount === 1 ? 'lesson' : 'lessons'}
          </span>
        </div>
      </div>
    </button>
  );
};

interface ArcLaneProps {
  anchorNodeId: string;
  arcId: string;
  nodes: TimelineNodeStub[];
  selectedNodeId: string | null;
  laneUnlocked: boolean;
  completedNodeIds: Set<string>;
  getLaneNodeState: (arcId: string, nodeId: string) => MatrixNodeProgressState;
  onSelectNode: (node: TimelineNodeStub, state: MatrixNodeProgressState) => void;
  onLaneScrollLeftChange: (laneKey: string, scrollLeft: number) => void;
  laneRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const ArcLane: React.FC<ArcLaneProps> = ({
  anchorNodeId,
  arcId,
  nodes,
  selectedNodeId,
  laneUnlocked,
  completedNodeIds,
  getLaneNodeState,
  onSelectNode,
  onLaneScrollLeftChange,
  laneRefs,
}) => {
  const arc = getArcById(arcId);
  const [laneScrolling, setLaneScrolling] = useState(false);
  const laneScrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (laneScrollTimeoutRef.current) {
        window.clearTimeout(laneScrollTimeoutRef.current);
      }
    };
  }, []);

  if (!arc) return null;

  const arcNodes = getMatrixArcNodes(arcId, anchorNodeId, nodes);
  const laneKey = getLaneKey(anchorNodeId, arcId);

  if (!laneUnlocked) {
    return (
      <div className="chronos-scroll-x flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
        {arcNodes.map(node => (
          <LockedArcNodePreview key={node.id} node={node} />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={element => {
        laneRefs.current[laneKey] = element;
      }}
      onScroll={event => {
        onLaneScrollLeftChange(laneKey, event.currentTarget.scrollLeft);
        setLaneScrolling(true);
        if (laneScrollTimeoutRef.current) {
          window.clearTimeout(laneScrollTimeoutRef.current);
        }
        laneScrollTimeoutRef.current = window.setTimeout(() => {
          setLaneScrolling(false);
          laneScrollTimeoutRef.current = null;
        }, 900);
      }}
      className={`chronos-scroll-x flex min-w-0 flex-1 gap-2 overflow-x-auto py-1 ${laneScrolling ? 'is-scrolling' : ''}`}
    >
      {arcNodes.map(node => {
        const state = getLaneNodeState(arcId, node.id);
        return (
          <ArcNodeCard
            key={node.id}
            node={node}
            state={state}
            selected={selectedNodeId === node.id}
            completed={completedNodeIds.has(node.id)}
            onSelect={() => onSelectNode(node, state)}
          />
        );
      })}
    </div>
  );
};

interface ArcNodeCardProps {
  node: TimelineNodeStub;
  state: MatrixNodeProgressState;
  selected: boolean;
  completed: boolean;
  onSelect: () => void;
}

const ArcNodeCard: React.FC<ArcNodeCardProps> = ({ node, state, selected, completed, onSelect }) => {
  const isLocked = state === 'future-locked';
  const content = STATIC_CONTENT[node.id];
  const imageUrl = getImageUrlWithFallback(content?.heroImageUrl);

  return (
    <button
      type="button"
      data-node-id={node.id}
      onClick={onSelect}
      disabled={isLocked}
      className={`group relative flex h-[62px] w-[160px] shrink-0 items-center gap-2 overflow-hidden rounded-md border px-2 text-left transition-all ${
        selected
          ? 'border-cyan-400 bg-cyan-950/35'
          : isLocked
            ? 'cursor-not-allowed border-stone-800 bg-stone-950/55 opacity-70'
            : 'border-stone-800 bg-stone-950/70 hover:border-cyan-500/40 hover:bg-cyan-950/15'
      }`}
    >
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded border border-stone-800 bg-stone-900">
        {isLocked ? (
          <div className="flex h-full w-full items-center justify-center text-stone-600">
            <Lock size={14} />
          </div>
        ) : (
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-75 group-hover:opacity-95" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={`line-clamp-2 text-[11px] font-semibold leading-tight ${isLocked ? 'text-stone-500' : 'text-stone-200'}`}>
          {node.title}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          <span className="truncate text-[9px] font-mono uppercase tracking-wider text-stone-600">{node.year}</span>
          {completed && <Check size={12} className="text-emerald-400" />}
        </div>
      </div>
      {isLocked && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-end bg-black/18 pr-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-stone-700 bg-black/70 text-stone-500">
            <Lock size={13} />
          </div>
        </div>
      )}
    </button>
  );
};

const LockedArcNodePreview: React.FC<{ node: TimelineNodeStub }> = ({ node }) => (
  <div
    data-node-id={node.id}
    className="relative flex h-[62px] w-[160px] shrink-0 items-center gap-2 overflow-hidden rounded-md border border-stone-800 bg-stone-950/55 px-2 opacity-70"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-stone-800 bg-stone-900 text-stone-600">
      <Lock size={14} />
    </div>
    <div className="min-w-0 flex-1">
      <div className="line-clamp-2 text-[11px] font-semibold leading-tight text-stone-500">
        {node.title}
      </div>
      <div className="mt-1 truncate text-[9px] font-mono uppercase tracking-wider text-stone-600">
        {node.year}
      </div>
    </div>
    <div className="pointer-events-none absolute inset-0 bg-black/18" />
  </div>
);

interface LessonPreviewPanelProps {
  selectedNode: TimelineNode | null;
  selectedNodeLoading: boolean;
  relatedArcs: HistoryArc[];
  onOpenLesson: () => void;
}

const LessonPreviewPanel: React.FC<LessonPreviewPanelProps> = ({
  selectedNode,
  selectedNodeLoading,
  relatedArcs,
  onOpenLesson,
}) => {
  const content = selectedNode?.content ?? (selectedNode ? STATIC_CONTENT[selectedNode.id] : undefined);
  const heroImageUrl = getImageUrlWithFallback(content?.heroImageUrl);
  const resources = content?.resources ?? [];
  const summary = content?.summary ?? 'Select an unlocked World Spine node or arc card to preview the lesson.';
  const summaryPreview = summary.split('\n').filter(Boolean).join(' ');

  return (
    <aside className="chronos-scroll-y hidden overflow-y-auto bg-[#081217] p-4 md:block md:h-screen md:p-4 lg:p-5">
      <div className="rounded-md border border-stone-800 bg-black/30 p-3 md:p-3 lg:p-4">
        {selectedNode ? (
          <>
            <div className="aspect-[16/9] overflow-hidden rounded border border-stone-800 bg-stone-900">
              <img src={heroImageUrl} alt="" className="h-full w-full object-cover opacity-85" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-mono font-bold text-cyan-300">{selectedNode.year}</div>
              <h2 className="mt-1 font-display text-2xl font-bold leading-tight text-white">{selectedNode.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedNode.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="rounded border border-stone-700 bg-stone-950 px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-stone-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-300">
                <BookOpen size={14} />
                Field Report
              </div>
              <p className="chronos-field-report-clamp text-sm leading-relaxed text-stone-300">
                {selectedNodeLoading && !content ? 'Loading lesson preview...' : summaryPreview}
              </p>
            </div>

            {resources.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">Resources</div>
                <div className="grid grid-cols-3 gap-2">
                  {resources.slice(0, 3).map(resource => (
                    <div key={`${resource.type}-${resource.title}`} className="flex items-center justify-center gap-1 rounded border border-stone-800 bg-stone-950 px-2 py-2 text-[10px] text-stone-300">
                      {resource.type === 'Video' ? <PlayCircle size={13} /> : resource.type === 'Podcast' ? <Headphones size={13} /> : <BookOpen size={13} />}
                      {resource.type}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {relatedArcs.length > 0 && (
              <div className="mt-5">
                <div className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">Related Arcs</div>
                <div className="flex flex-wrap gap-2">
                  {relatedArcs.map(arc => (
                    <span key={arc.id} className="rounded-full border border-stone-700 bg-stone-950 px-2.5 py-1 text-[10px] text-stone-300">
                      {arc.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <button
                type="button"
                onClick={onOpenLesson}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-300"
              >
                <BookOpen size={17} />
                Open Lesson
              </button>
            </div>
          </>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
            <Sparkles size={36} className="mb-4 text-cyan-500/60" />
            <h2 className="font-display text-xl font-bold text-white">Select a Lesson</h2>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-stone-500">{summary}</p>
          </div>
        )}
      </div>
    </aside>
  );
};

const StateGlyph: React.FC<{ state: MatrixNodeProgressState }> = ({ state }) => {
  if (state === 'completed') return <Check size={14} className="text-emerald-400" />;
  if (state === 'current') return <Flame size={14} className="text-amber-400" />;
  if (state === 'available') return <ChevronRight size={14} className="text-cyan-300" />;
  return <Lock size={13} className="text-stone-600" />;
};

function getLaneKey(anchorNodeId: string, arcId: string): string {
  return `${anchorNodeId}:${arcId}`;
}
