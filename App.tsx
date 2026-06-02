import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowLeft, Terminal } from 'lucide-react';
import { NodeContentDisplay } from './components/NodeContentDisplay';
import { WorldSpineMatrix } from './components/WorldSpineMatrix';
import { UserProfileModal } from './components/UserProfile';
import { AuthScreen } from './components/AuthScreen';
import { ERAS, INITIAL_NODES } from './constants';
import { HISTORY_ARCS } from './data/arcs';
import { CollectibleCard, TimelineNode, TimelineNodeStub } from './types';
import { fetchNodeContent } from './services/geminiService';
import { GamificationService } from './services/gamification';
import { useUserProfile } from './contexts/UserProfileContext';
import { useAuth } from './contexts/AuthContext';
import { getEraLockStatus } from './services/eraLocking';
import { getAllNodeLockStatus } from './services/nodeLocking';
import { createMatrixProgressResolver } from './services/worldSpineMatrix';

const parseBooleanEnv = (value: string | undefined): boolean => value === 'true' || value === '1';

// Optional local/dev unlock control. Leave unset for real per-user progress.
const UNLOCK_ALL_ERAS = parseBooleanEnv(import.meta.env.VITE_UNLOCK_ALL_ERAS);

const App: React.FC = () => {
  const { user, loading: authLoading, isGuest } = useAuth();

  if (authLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-stone-200">
        <div className="text-center">
          <Terminal size={48} className="mx-auto mb-4 animate-pulse text-stone-600" />
          <p className="font-mono text-stone-500">Initializing...</p>
        </div>
      </div>
    );
  }

  if (!user && !isGuest) {
    return <AuthScreen />;
  }

  return <AuthenticatedApp />;
};

const AuthenticatedApp: React.FC = () => {
  const { signOut } = useAuth();
  const { profile: userProfile, loading: profileLoading, addXp, completeNode } = useUserProfile();

  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullLessonOpen, setIsFullLessonOpen] = useState(false);
  const [nodeCache, setNodeCache] = useState<Record<string, TimelineNode>>({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [matrixScrollTop, setMatrixScrollTop] = useState(0);
  const [laneScrollLefts, setLaneScrollLefts] = useState<Record<string, number>>({});
  const hasInitializedSelection = useRef(false);

  const eraLockStatus = useMemo<Record<string, boolean>>(() => {
    const completedNodeIds = new Set(userProfile.nodesCompleted);
    return getEraLockStatus(ERAS, INITIAL_NODES, completedNodeIds, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
  }, [userProfile.nodesCompleted]);

  const nodeLockStatus = useMemo<Record<string, boolean>>(() => {
    const completedNodeIds = new Set(userProfile.nodesCompleted);
    return getAllNodeLockStatus(ERAS, INITIAL_NODES, completedNodeIds, eraLockStatus, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
  }, [eraLockStatus, userProfile.nodesCompleted]);

  const handleSelectNode = useCallback(async (stub: TimelineNodeStub, bypassLockCheck = false) => {
    if (!bypassLockCheck && nodeLockStatus[stub.id]) {
      return;
    }

    if (nodeCache[stub.id] && nodeCache[stub.id].content) {
      setSelectedNode(nodeCache[stub.id]);
      setError(null);
      return;
    }

    if (loading && selectedNode?.id === stub.id) return;

    const partialNode: TimelineNode = { ...stub };
    setSelectedNode(partialNode);
    setLoading(true);
    setError(null);

    try {
      const content = await fetchNodeContent(stub);
      const fullNode: TimelineNode = { ...stub, content };
      setNodeCache(prev => ({ ...prev, [stub.id]: fullNode }));
      setSelectedNode(fullNode);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(message);
      console.error('Content Fetch Failed:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, nodeCache, nodeLockStatus, selectedNode?.id]);

  useEffect(() => {
    if (hasInitializedSelection.current || profileLoading) return;

    const completedSet = new Set(userProfile.nodesCompleted);
    const progress = createMatrixProgressResolver(completedSet, INITIAL_NODES, false);
    const nextSpineNode =
      INITIAL_NODES.find(node => progress.getSpineNodeState(node.id) === 'current') ||
      INITIAL_NODES.find(node => progress.getSpineNodeState(node.id) === 'available') ||
      INITIAL_NODES.find(node => progress.worldSpineNodeIds.includes(node.id));

    if (nextSpineNode) {
      handleSelectNode(nextSpineNode, true);
    }

    hasInitializedSelection.current = true;
  }, [handleSelectNode, profileLoading, userProfile.nodesCompleted]);

  const handleRetry = () => {
    if (selectedNode) {
      handleSelectNode(selectedNode, true);
    }
  };

  const handleOpenFullLesson = () => {
    if (selectedNode) {
      setIsFullLessonOpen(true);
    }
  };

  const handleBackToMatrix = () => {
    setIsFullLessonOpen(false);
  };

  const handleQuizComplete = async (xp: number, collectibleCards?: CollectibleCard[]) => {
    await addXp(xp);

    if (collectibleCards && collectibleCards.length > 0) {
      GamificationService.unlockCollectibleCards(collectibleCards);
    }

    if (selectedNode) {
      await completeNode(selectedNode.id);
    }
  };

  const getNextLesson = useMemo(() => {
    if (!selectedNode) return null;

    const completedSet = new Set([...userProfile.nodesCompleted, selectedNode.id]);
    const updatedEraLockStatus = getEraLockStatus(ERAS, INITIAL_NODES, completedSet, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
    const updatedNodeLockStatus = getAllNodeLockStatus(ERAS, INITIAL_NODES, completedSet, updatedEraLockStatus, {
      unlockAll: UNLOCK_ALL_ERAS,
    });

    const currentIndex = INITIAL_NODES.findIndex(node => node.id === selectedNode.id);
    if (currentIndex === -1) return null;

    for (let index = currentIndex + 1; index < INITIAL_NODES.length; index += 1) {
      const node = INITIAL_NODES[index];
      if (!updatedNodeLockStatus[node.id] && !completedSet.has(node.id)) {
        return node;
      }
    }

    for (let index = 0; index < currentIndex; index += 1) {
      const node = INITIAL_NODES[index];
      if (!updatedNodeLockStatus[node.id] && !completedSet.has(node.id)) {
        return node;
      }
    }

    return null;
  }, [selectedNode, userProfile.nodesCompleted]);

  const handleGoToNextLesson = () => {
    if (getNextLesson) {
      handleSelectNode(getNextLesson, true);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-black text-stone-200 font-sans">
      <UserProfileModal
        profile={userProfile}
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {error && (
        <div className="absolute right-4 top-4 z-50 flex max-w-md items-center gap-2 rounded-md border border-red-800 bg-red-950/90 px-4 py-3 text-red-200 shadow-lg backdrop-blur-sm">
          <AlertCircle size={18} className="shrink-0 text-red-500" />
          <span className="text-sm font-medium leading-tight">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-1 text-red-400 hover:text-red-200">
            x
          </button>
        </div>
      )}

      {isFullLessonOpen ? (
        <main className="relative h-full w-full overflow-hidden">
          <button
            type="button"
            onClick={handleBackToMatrix}
            className="absolute left-4 top-4 z-50 hidden items-center gap-2 rounded-full border border-stone-800 bg-black/70 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-stone-300 backdrop-blur transition-colors hover:border-cyan-500/50 hover:text-white md:flex"
          >
            <ArrowLeft size={16} />
            Back to Matrix
          </button>
          {selectedNode && (
            <NodeContentDisplay
              key={selectedNode.id}
              node={selectedNode}
              loading={loading}
              onRetry={handleRetry}
              onBack={handleBackToMatrix}
              onQuizComplete={handleQuizComplete}
              isNodeCompleted={userProfile.nodesCompleted.includes(selectedNode.id)}
              onGoToNextLesson={handleGoToNextLesson}
              hasNextLesson={!!getNextLesson}
            />
          )}
        </main>
      ) : (
        <WorldSpineMatrix
          nodes={INITIAL_NODES}
          arcs={HISTORY_ARCS}
          userProfile={userProfile}
          selectedNode={selectedNode}
          selectedNodeLoading={loading}
          initialScrollTop={matrixScrollTop}
          initialLaneScrollLefts={laneScrollLefts}
          unlockAll={false}
          onMatrixScrollTopChange={setMatrixScrollTop}
          onLaneScrollLeftChange={(laneKey, scrollLeft) => {
            setLaneScrollLefts(current => ({ ...current, [laneKey]: scrollLeft }));
          }}
          onSelectNode={handleSelectNode}
          onOpenLesson={handleOpenFullLesson}
          onOpenProfile={() => setIsProfileOpen(true)}
          onSignOut={signOut}
        />
      )}
    </div>
  );
};

export default App;
