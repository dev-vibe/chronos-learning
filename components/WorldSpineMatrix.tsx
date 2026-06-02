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
  Search,
  Sparkles,
  UserCircle,
} from 'lucide-react';
import { getArcById, getArcFamily, getArcNodes } from '../data/arcs';
import { STATIC_CONTENT } from '../staticContent';
import { UserProfile } from '../services/gamification';
import {
  createMatrixProgressResolver,
  deriveMatrixRows,
  getArcNodeIdValidation,
  WORLD_SPINE_LANE_ARC_IDS_BY_NODE_ID,
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
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const laneRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLaneArcIds, setActiveLaneArcIds] = useState<Record<string, string>>({});
  const [expandedMobileNodeId, setExpandedMobileNodeId] = useState<string | null>(null);
  const [matrixHorizontalScrolling, setMatrixHorizontalScrolling] = useState(false);
  const matrixHorizontalScrollTimeoutRef = useRef<number | null>(null);

  const nodeById = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const rows = useMemo(() => deriveMatrixRows(nodes), [nodes]);
  const completedNodeIds = useMemo(() => new Set(userProfile.nodesCompleted), [userProfile.nodesCompleted]);
  const progress = useMemo(
    () => createMatrixProgressResolver(completedNodeIds, nodes, unlockAll),
    [completedNodeIds, nodes, unlockAll]
  );
  const spineRows = useMemo(
    () => rows.filter((row): row is Extract<MatrixRow, { type: 'spine-node' }> => row.type === 'spine-node'),
    [rows]
  );
  const totalLessonCount = nodes.length;
  const completedCount = completedNodeIds.size;
  const progressPercent = totalLessonCount > 0 ? Math.min(100, Math.round((completedCount / totalLessonCount) * 100)) : 0;

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];

    return nodes
      .filter(node => {
        return [node.title, node.year, node.region, ...(node.arcIds ?? [])].some(value =>
          value.toLowerCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [nodes, searchQuery]);

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
  }, [arcs, nodes]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = initialScrollTop;
  }, [initialScrollTop]);

  useEffect(() => {
    return () => {
      if (matrixHorizontalScrollTimeoutRef.current) {
        window.clearTimeout(matrixHorizontalScrollTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    for (const [laneKey, scrollLeft] of Object.entries(initialLaneScrollLefts)) {
      const lane = laneRefs.current[laneKey];
      if (lane) lane.scrollLeft = scrollLeft;
    }
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

  const handleSearchSelect = (node: TimelineNodeStub) => {
    const spineState = progress.getSpineNodeState(node.id);
    const isSpineNode = progress.worldSpineNodeIds.includes(node.id);
    const isSelectable = isSpineNode ? spineState !== 'future-locked' : completedNodeIds.has(node.id);
    if (!isSelectable) return;

    setSearchQuery('');
    onSelectNode(node, true);
    scrollToAnchorForNode(node.id);
  };

  const scrollToAnchorForNode = (nodeId: string) => {
    const anchorNodeId = getAnchorNodeIdForNode(nodeId, rows);
    if (!anchorNodeId) return;
    rowRefs.current[anchorNodeId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#071014] text-stone-200 font-sans md:grid md:grid-cols-[220px_minmax(520px,1fr)_360px] lg:grid-cols-[240px_minmax(640px,1fr)_400px]">
      <ChronosRail
        userProfile={userProfile}
        progressPercent={progressPercent}
        completedCount={completedCount}
        totalLessonCount={totalLessonCount}
        searchQuery={searchQuery}
        searchResults={searchResults}
        progress={progress}
        onSearchQueryChange={setSearchQuery}
        onSelectSearchResult={handleSearchSelect}
        onOpenProfile={onOpenProfile}
        onSignOut={onSignOut}
      />

      <section className="relative min-h-0 flex-1 overflow-hidden border-y border-stone-800/80 bg-[#071014] md:h-screen md:border-y-0 md:border-r">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.04)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
        <div className="relative z-10 flex h-full flex-col px-3 py-3 md:px-5 md:py-4">
          <div className="mb-3 grid gap-3 text-[10px] font-mono font-bold uppercase tracking-widest text-stone-400 md:sticky md:top-0 md:z-30 md:grid-cols-[minmax(230px,290px)_minmax(360px,1fr)]">
            <div className="rounded border border-stone-800 bg-black/50 px-3 py-2">World Spine</div>
            <div className="hidden rounded border border-stone-800 bg-black/50 px-3 py-2 md:block">Arc Lanes</div>
          </div>

          <div
            ref={scrollRef}
            onScroll={event => {
              onMatrixScrollTopChange(event.currentTarget.scrollTop);
              if (event.currentTarget.scrollLeft > 0) {
                setMatrixHorizontalScrolling(true);
                if (matrixHorizontalScrollTimeoutRef.current) {
                  window.clearTimeout(matrixHorizontalScrollTimeoutRef.current);
                }
                matrixHorizontalScrollTimeoutRef.current = window.setTimeout(() => {
                  setMatrixHorizontalScrolling(false);
                  matrixHorizontalScrollTimeoutRef.current = null;
                }, 900);
              }
            }}
            className={`chronos-scroll-y chronos-scroll-x relative min-h-0 flex-1 overflow-y-auto overflow-x-auto rounded border border-stone-800/90 bg-black/35 shadow-2xl ${
              matrixHorizontalScrolling ? 'is-scrolling' : ''
            }`}
          >
            <div className="md:min-w-[980px]">
              {rows.map(row => {
                if (row.type === 'separator') {
                  return <SeparatorRow key={row.id} row={row} />;
                }

                const node = nodeById.get(row.nodeId);
                if (!node) return null;

                const state = progress.getSpineNodeState(node.id);
                const laneArcId = getActiveLaneArcId(row);
                const isSelected = selectedNode?.id === node.id;
                const isMobileExpanded = expandedMobileNodeId === node.id || isSelected;

                return (
                  <div
                    key={row.nodeId}
                    ref={element => {
                      rowRefs.current[row.nodeId] = element;
                    }}
                    className="grid min-h-[104px] border-b border-cyan-900/30 md:h-[104px] md:grid-cols-[minmax(230px,290px)_minmax(620px,1fr)]"
                  >
                    <div className="sticky left-0 z-20 flex h-full items-center border-r border-stone-800 bg-[#071014]/95 px-2 backdrop-blur md:px-3">
                      <SpineNodeCard
                        node={node}
                        state={state}
                        selected={isSelected}
                        role={node.arcRoles?.['world-spine']}
                        onSelect={() => selectMatrixNode(node, state)}
                      />
                    </div>

                    <div className={`${isMobileExpanded ? 'block' : 'hidden'} h-auto px-3 py-2 md:flex md:h-full md:items-center md:py-0`}>
                      {laneArcId ? (
                        <ArcLane
                          anchorNodeId={row.nodeId}
                          arcId={laneArcId}
                          alternateArcIds={row.laneArcIds.filter(arcId => arcId !== laneArcId && Boolean(getArcById(arcId))).slice(0, 2)}
                          nodes={nodes}
                          selectedNodeId={selectedNode?.id ?? null}
                          laneUnlocked={progress.isLaneUnlocked(row.nodeId)}
                          completedNodeIds={completedNodeIds}
                          getLaneNodeState={progress.getLaneNodeState}
                          onSelectLane={arcId => {
                            setActiveLaneArcIds(current => ({ ...current, [row.nodeId]: arcId }));
                          }}
                          onSelectNode={(laneNode, laneNodeState) => selectMatrixNode(laneNode, laneNodeState)}
                          onLaneScrollLeftChange={onLaneScrollLeftChange}
                          laneRefs={laneRefs}
                        />
                      ) : (
                        <div className="text-xs font-mono uppercase tracking-widest text-stone-700">No anchored lane yet</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-stone-600">
            <span>{spineRows.length} spine nodes</span>
            <span>Locked nodes show the future path without lesson details.</span>
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

interface ChronosRailProps {
  userProfile: UserProfile;
  progressPercent: number;
  completedCount: number;
  totalLessonCount: number;
  searchQuery: string;
  searchResults: TimelineNodeStub[];
  progress: ReturnType<typeof createMatrixProgressResolver>;
  onSearchQueryChange: (query: string) => void;
  onSelectSearchResult: (node: TimelineNodeStub) => void;
  onOpenProfile: () => void;
  onSignOut: () => void | Promise<void>;
}

const ChronosRail: React.FC<ChronosRailProps> = ({
  userProfile,
  progressPercent,
  completedCount,
  totalLessonCount,
  searchQuery,
  searchResults,
  progress,
  onSearchQueryChange,
  onSelectSearchResult,
  onOpenProfile,
  onSignOut,
}) => {
  return (
    <aside className="relative z-40 shrink-0 border-b border-stone-800 bg-[#061017] px-4 py-3 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r md:px-4 md:py-5">
      <div className="flex items-center justify-between gap-3 md:block">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-white">CHRONOS</h1>
          <div className="mt-2 h-px w-24 bg-cyan-400/60" />
        </div>
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onOpenProfile}
            className="rounded border border-stone-800 bg-black/40 p-2 text-cyan-200"
            aria-label="Open profile"
          >
            <UserCircle size={18} />
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded border border-stone-800 bg-black/40 p-2 text-stone-400"
            aria-label="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      <div className="relative mt-3 md:mt-6">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" />
        <input
          value={searchQuery}
          onChange={event => onSearchQueryChange(event.target.value)}
          placeholder="Search"
          className="h-10 w-full rounded-md border border-stone-800 bg-black/35 pl-9 pr-3 text-sm text-stone-200 outline-none placeholder:text-stone-500 focus:border-cyan-500/60"
        />
        {searchResults.length > 0 && (
          <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-md border border-stone-800 bg-[#071014] shadow-2xl">
            {searchResults.map(result => {
              const state = progress.getSpineNodeState(result.id);
              const isSpineNode = progress.worldSpineNodeIds.includes(result.id);
              const isDisabled = isSpineNode ? state === 'future-locked' : !progress.completedNodeIds.has(result.id);

              return (
                <button
                  key={result.id}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => onSelectSearchResult(result)}
                  className={`block w-full border-b border-stone-900 px-3 py-2 text-left text-xs last:border-b-0 ${
                    isDisabled ? 'cursor-not-allowed text-stone-600' : 'text-stone-300 hover:bg-cyan-950/30 hover:text-white'
                  }`}
                >
                  <span className="block truncate font-medium">{isDisabled ? 'Locked future lesson' : result.title}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-wider text-stone-600">
                    {isSpineNode ? result.year : 'Complete earlier spine nodes first'}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:mt-8 md:block md:space-y-6">
        <div className="rounded-md border border-stone-800 bg-black/25 p-3">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-stone-500">Overall Progress</div>
          <div className="mt-3 flex items-end gap-2">
            <span className="font-display text-3xl font-bold text-white">{progressPercent}%</span>
            <span className="pb-1 text-xs text-stone-500">complete</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-900">
            <div className="h-full rounded-full bg-cyan-400" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="mt-2 text-[10px] font-mono uppercase tracking-wider text-stone-500">
            {completedCount} / {totalLessonCount} lessons
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenProfile}
          className="rounded-md border border-stone-800 bg-black/25 p-3 text-left transition-colors hover:border-cyan-500/50 md:w-full"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/50 bg-cyan-950/30 text-cyan-200">
              <UserCircle size={24} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-bold text-white">Explorer {userProfile.level}</div>
              <div className="mt-0.5 text-[10px] font-mono uppercase tracking-wider text-stone-500">{userProfile.xp} XP</div>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-auto hidden border-t border-stone-800 pt-4 text-[10px] font-mono uppercase tracking-wider text-stone-500 md:block">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Matrix online
          </span>
          <button type="button" onClick={onSignOut} className="text-stone-500 transition-colors hover:text-red-300">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

const SeparatorRow: React.FC<{ row: Extract<MatrixRow, { type: 'separator' }> }> = ({ row }) => (
  <div
    className="grid h-8 border-b border-stone-800/80 bg-black/40 md:grid-cols-[minmax(230px,290px)_minmax(620px,1fr)]"
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

interface ArcLaneProps {
  anchorNodeId: string;
  arcId: string;
  alternateArcIds: string[];
  nodes: TimelineNodeStub[];
  selectedNodeId: string | null;
  laneUnlocked: boolean;
  completedNodeIds: Set<string>;
  getLaneNodeState: (arcId: string, nodeId: string) => MatrixNodeProgressState;
  onSelectLane: (arcId: string) => void;
  onSelectNode: (node: TimelineNodeStub, state: MatrixNodeProgressState) => void;
  onLaneScrollLeftChange: (laneKey: string, scrollLeft: number) => void;
  laneRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}

const ArcLane: React.FC<ArcLaneProps> = ({
  anchorNodeId,
  arcId,
  alternateArcIds,
  nodes,
  selectedNodeId,
  laneUnlocked,
  completedNodeIds,
  getLaneNodeState,
  onSelectLane,
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

  const arcNodes = getArcNodes(arc, nodes);
  const family = getArcFamily(arc);
  const laneKey = getLaneKey(anchorNodeId, arcId);

  if (!laneUnlocked) {
    return (
      <div className="flex w-full items-center gap-3">
        <div className="min-w-[220px] rounded-md border border-stone-800 bg-stone-950/60 px-4 py-3 text-stone-500">
          <div className="mb-1 flex items-center gap-2 text-xs font-bold text-stone-400">
            <Lock size={14} />
            {arc.title}
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-stone-600">{arcNodes.length}-node arc locked</div>
        </div>
        <div className="chronos-scroll-x flex min-w-0 flex-1 gap-2 overflow-x-auto py-1">
          {arcNodes.slice(0, 4).map(node => (
            <LockedArcNodePreview key={node.id} node={node} />
          ))}
          {arcNodes.length > 4 && (
            <div className="flex h-[62px] w-20 shrink-0 items-center justify-center rounded border border-stone-800 bg-stone-950/45 text-[10px] font-mono text-stone-600">
              +{arcNodes.length - 4}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <div className="hidden min-w-[168px] max-w-[190px] md:block">
        <div className="line-clamp-1 text-xs font-bold text-stone-200">{arc.title}</div>
        <div className="mt-1 flex flex-wrap gap-1">
          <span className="rounded border border-cyan-500/25 px-1.5 py-0.5 text-[9px] font-mono uppercase text-cyan-200">
            {family?.title ?? arc.kind}
          </span>
          {alternateArcIds.map(alternateArcId => {
            const alternateArc = getArcById(alternateArcId);
            if (!alternateArc) return null;
            return (
              <button
                key={alternateArcId}
                type="button"
                onClick={() => onSelectLane(alternateArcId)}
                className="rounded border border-stone-800 px-1.5 py-0.5 text-[9px] font-mono uppercase text-stone-500 hover:border-cyan-500/40 hover:text-cyan-200"
              >
                {alternateArc.kind}
              </button>
            );
          })}
        </div>
      </div>

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
  <div className="relative flex h-[62px] w-[160px] shrink-0 items-center gap-2 overflow-hidden rounded-md border border-stone-800 bg-stone-950/55 px-2 opacity-70">
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

function getAnchorNodeIdForNode(nodeId: string, rows: MatrixRow[]): string | null {
  if (rows.some(row => row.type === 'spine-node' && row.nodeId === nodeId)) return nodeId;

  for (const [anchorNodeId, laneArcIds] of Object.entries(WORLD_SPINE_LANE_ARC_IDS_BY_NODE_ID)) {
    if (!rows.some(row => row.type === 'spine-node' && row.nodeId === anchorNodeId)) continue;
    if (laneArcIds.some(arcId => getArcById(arcId)?.nodeIds.includes(nodeId))) return anchorNodeId;
  }

  return null;
}
