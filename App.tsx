
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { TimelineSidebar } from './components/TimelineSidebar';
import { NodeContentDisplay } from './components/NodeContentDisplay';
import { UserProfileModal } from './components/UserProfile';
import { ERAS, INITIAL_NODES } from './constants';
import { TimelineNode, TimelineNodeStub, Era, CollectibleCard } from './types';
import { fetchNodeContent } from './services/geminiService';
import { GamificationService } from './services/gamification';
import { useUserProfile } from './contexts/UserProfileContext';
import { getEraLockStatus } from './services/eraLocking';
import { getAllNodeLockStatus } from './services/nodeLocking';
import { AlertCircle, PlayCircle, Terminal } from 'lucide-react';

// Development/Testing Flag: Set to true to unlock all eras regardless of completion status
const UNLOCK_ALL_ERAS = false;

const App: React.FC = () => {
  const [selectedEraId, setSelectedEraId] = useState<string | null>(ERAS[0].id);
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [nodeCache, setNodeCache] = useState<Record<string, TimelineNode>>({});

  // Gamification State - use context (synced with DB)
  const { profile: userProfile, addXp, completeNode } = useUserProfile();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hasInitializedEra = useRef(false);

  // Debug: log whenever userProfile changes
  useEffect(() => {
    console.log('%c[userProfile CHANGED]', 'background: #0f0; color: #000; font-size: 14px;', userProfile);
  }, [userProfile]);

  // Compute era lock status based on completed nodes
  const eraLockStatus = useMemo<Record<string, boolean>>(() => {
    console.log('[eraLockStatus] Computing with nodesCompleted:', userProfile.nodesCompleted);
    const completedNodeIds: Set<string> = new Set(userProfile.nodesCompleted);
    const result = getEraLockStatus(ERAS, INITIAL_NODES, completedNodeIds, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
    console.log('[eraLockStatus] Result:', result);
    return result;
  }, [userProfile.nodesCompleted]);

  // Compute node lock status based on completed nodes and era lock status
  const nodeLockStatus = useMemo<Record<string, boolean>>(() => {
    const completedNodeIds: Set<string> = new Set(userProfile.nodesCompleted);
    return getAllNodeLockStatus(ERAS, INITIAL_NODES, completedNodeIds, eraLockStatus, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
  }, [userProfile.nodesCompleted, eraLockStatus]);

  // Find the last unlocked node and open its era on initial load
  useEffect(() => {
    // Only run once on initial load
    if (hasInitializedEra.current) return;
    
    // Find the last unlocked node chronologically
    const unlockedNodes = INITIAL_NODES.filter(node => !nodeLockStatus[node.id]);
    
    if (unlockedNodes.length > 0) {
      // Parse year for sorting (similar to nodeLocking service)
      const parseYear = (yearStr: string): number => {
        let cleaned = yearStr.replace(/^(c\.|ca\.|circa|~)\s*/i, '').trim();
        cleaned = cleaned.replace(/,/g, '');
        const match = cleaned.match(/(\d+(?:\.\d+)?)/);
        if (!match) return 0;
        const num = parseFloat(match[1]);
        if (cleaned.toUpperCase().includes('BCE') || cleaned.toUpperCase().includes('BC')) {
          return -num; // Negative for BCE
        }
        return num;
      };
      
      // Sort nodes chronologically (most recent first)
      const sortedUnlockedNodes = [...unlockedNodes].sort((a, b) => {
        const yearA = parseYear(a.year);
        const yearB = parseYear(b.year);
        return yearB - yearA; // Descending order to get the latest
      });
      
      const lastUnlockedNode = sortedUnlockedNodes[0]; // Most recent unlocked node
      if (lastUnlockedNode) {
        setSelectedEraId(lastUnlockedNode.eraId);
        hasInitializedEra.current = true;
      }
    } else {
      // If no unlocked nodes, default to first era
      hasInitializedEra.current = true;
    }
  }, [nodeLockStatus]); // Run when lock status is computed

  // Keep the era containing the selected node open
  // This ensures that whenever a node is selected, its era is automatically opened
  useEffect(() => {
    if (selectedNode) {
      // Force the era to be open - this will override any manual era selection
      setSelectedEraId(selectedNode.eraId);
    }
  }, [selectedNode]);

  const handleSelectEra = (id: string) => {
    // Prevent selecting locked eras
    if (eraLockStatus[id]) {
      return;
    }
    // If a node is selected, prevent closing its era
    // The era containing the selected node should always stay open
    if (selectedNode && selectedNode.eraId === id) {
      // Don't allow closing the era that contains the selected node
      return;
    }
    // If no node is selected, allow toggling eras
    // If a node is selected and clicking a different era, open that era
    // (but the selected node's era will be kept open by the useEffect)
    setSelectedEraId(id);
  };

  const handleSelectEraBriefing = (era: Era) => {
    setShowMobileDetail(true);
    setSelectedNode(null);
    setSelectedEra(era);
    setError(null);
  };

  const handleSelectNode = useCallback(async (stub: TimelineNodeStub, bypassLockCheck = false) => {
    // Prevent selecting locked nodes (unless bypassed, e.g., from "Continue to Next Lesson")
    if (!bypassLockCheck && nodeLockStatus[stub.id]) {
      console.log('[handleSelectNode] Node is locked, returning:', stub.id);
      return;
    }
    
    // Automatically open the era that contains this node
    setSelectedEraId(stub.eraId);
    
    setShowMobileDetail(true);
    setSelectedEra(null);

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
      console.log(`Requesting content for: ${stub.title}`);
      const content = await fetchNodeContent(stub);
      const fullNode: TimelineNode = { ...stub, content };
      setNodeCache(prev => ({ ...prev, [stub.id]: fullNode }));
      setSelectedNode(fullNode);
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : "Unknown error occurred";
      setError(msg);
      console.error("Content Fetch Failed:", err);
    } finally {
      setLoading(false);
    }
  }, [nodeCache, selectedNode, loading, nodeLockStatus]);

  const handleRetry = () => {
    if (selectedNode) {
      handleSelectNode(selectedNode);
    }
  };

  const handleBackToTimeline = () => {
    setShowMobileDetail(false);
  };

  const handleQuizComplete = async (xp: number, collectibleCards?: CollectibleCard[]) => {
    console.log('%c[handleQuizComplete] ========== CALLED ==========', 'background: #ff0; color: #000; font-size: 16px;');
    console.log('[handleQuizComplete] XP:', xp, 'selectedNode:', selectedNode?.id);
    
    // Use context methods - profile state updates automatically
    await addXp(xp);
    if (collectibleCards && collectibleCards.length > 0) {
      GamificationService.unlockCollectibleCards(collectibleCards);
    }
    if (selectedNode) {
      await completeNode(selectedNode.id);
    }
    
    console.log('[handleQuizComplete] Profile updated via context');
  };

  // Helper to parse year for sorting nodes chronologically
  const parseYear = (yearStr: string): number => {
    const match = yearStr.match(/([\d,]+)\s*(BCE|CE|BC|AD)?/i);
    if (!match) return 0;
    let year = parseInt(match[1].replace(/,/g, ''), 10);
    if (match[2] && (match[2].toUpperCase() === 'BCE' || match[2].toUpperCase() === 'BC')) {
      year = -year;
    }
    return year;
  };

  // Find the next unlocked node after completing the current one
  // This needs to account for the CURRENT node being completed (which just happened)
  const getNextLesson = useMemo(() => {
    if (!selectedNode) return null;
    
    // Use React state (userProfile.nodesCompleted) as the source of truth
    // Add the current node to the completed set since we just completed it
    const completedSet = new Set([...userProfile.nodesCompleted, selectedNode.id]);
    
    console.log('[getNextLesson] Current node:', selectedNode.id);
    console.log('[getNextLesson] Completed set:', [...completedSet]);
    
    // Recalculate lock status with completed nodes INCLUDING the current one
    const updatedEraLockStatus = getEraLockStatus(ERAS, INITIAL_NODES, completedSet, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
    const updatedNodeLockStatus = getAllNodeLockStatus(ERAS, INITIAL_NODES, completedSet, updatedEraLockStatus, {
      unlockAll: UNLOCK_ALL_ERAS,
    });
    
    console.log('[getNextLesson] Era lock status:', updatedEraLockStatus);
    
    // Sort all nodes chronologically (oldest first for BCE dates)
    const sortedNodes = [...INITIAL_NODES].sort((a, b) => parseYear(a.year) - parseYear(b.year));
    
    // Find current node's index
    const currentIndex = sortedNodes.findIndex(n => n.id === selectedNode.id);
    console.log('[getNextLesson] Current index in sorted:', currentIndex, 'Total nodes:', sortedNodes.length);
    if (currentIndex === -1) return null;
    
    // Find the next unlocked and uncompleted node AFTER current position
    for (let i = currentIndex + 1; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const isLocked = updatedNodeLockStatus[node.id];
      const isCompleted = completedSet.has(node.id);
      // Node must be unlocked AND not already completed
      if (!isLocked && !isCompleted) {
        console.log('[getNextLesson] Found next node:', node.id, node.title);
        return node;
      }
    }
    
    console.log('[getNextLesson] No node found after current, checking from start...');
    
    // If no uncompleted node found after current, wrap around from the beginning
    // (but skip nodes before the current one that are already completed)
    for (let i = 0; i < currentIndex; i++) {
      const node = sortedNodes[i];
      if (!updatedNodeLockStatus[node.id] && !completedSet.has(node.id)) {
        console.log('[getNextLesson] Found wrapped node:', node.id, node.title);
        return node;
      }
    }
    
    console.log('[getNextLesson] No next lesson found!');
    return null;
  }, [selectedNode, userProfile.nodesCompleted]);

  console.log('[App] getNextLesson result:', getNextLesson?.id, getNextLesson?.title);

  const handleGoToNextLesson = () => {
    console.log('[handleGoToNextLesson] Called, getNextLesson:', getNextLesson?.id);
    if (getNextLesson) {
      console.log('[handleGoToNextLesson] Navigating to:', getNextLesson.id, getNextLesson.title);
      // Bypass lock check - we already validated this node is unlocked in getNextLesson
      handleSelectNode(getNextLesson, true);
    } else {
      console.log('[handleGoToNextLesson] No next lesson available!');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-black text-stone-200 overflow-hidden font-sans">
      <UserProfileModal 
        profile={userProfile} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      <div className={`h-full flex-shrink-0 transition-all duration-300 ${showMobileDetail ? 'hidden md:block' : 'block w-full md:w-auto'}`}>
        <TimelineSidebar
          eras={ERAS}
          nodes={INITIAL_NODES}
          selectedEraId={selectedEraId}
          selectedNodeId={selectedNode?.id || null}
          showEraBriefing={!!selectedEra}
          eraLockStatus={eraLockStatus}
          nodeLockStatus={nodeLockStatus}
          onSelectEra={handleSelectEra}
          onSelectNode={handleSelectNode}
          onSelectEraBriefing={handleSelectEraBriefing}
        />
      </div>

      <main className={`flex-1 flex-col h-full relative overflow-hidden ${showMobileDetail ? 'flex' : 'hidden md:flex'}`}>
        {/* Top Bar / Profile Trigger - Only visible on desktop here, mobile handles it in sidebar? Or overlay. Let's put it absolute top right. */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
            <button 
                onClick={() => setIsProfileOpen(true)}
                className="bg-stone-900/80 backdrop-blur border border-stone-800 hover:border-amber-500/50 text-stone-300 hover:text-white px-3 py-1.5 rounded-full flex items-center gap-2 transition-all shadow-lg"
            >
                <div className="w-5 h-5 bg-amber-500 rounded-full text-black text-[10px] font-bold flex items-center justify-center">
                    {userProfile.level}
                </div>
                <span className="text-xs font-mono font-bold hidden sm:inline uppercase">Agent Status</span>
            </button>
        </div>

        {error && (
          <div className="absolute top-16 right-4 z-50 bg-red-950/90 border border-red-800 text-red-200 px-4 py-3 rounded-md shadow-lg flex items-center gap-2 max-w-md animate-in slide-in-from-top-2 backdrop-blur-sm">
            <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
            <span className="text-sm font-medium leading-tight">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-200 p-1">✕</button>
          </div>
        )}

        {selectedEra ? (
           <NodeContentDisplay
             node={null} 
             era={selectedEra}
             loading={false}
             onBack={handleBackToTimeline}
           />
        ) : selectedNode ? (
          <NodeContentDisplay 
            node={selectedNode} 
            loading={loading} 
            onRetry={handleRetry}
            onBack={handleBackToTimeline}
            // Gamification Props
            onQuizComplete={handleQuizComplete}
            isNodeCompleted={userProfile.nodesCompleted.includes(selectedNode.id)}
            onGoToNextLesson={handleGoToNextLesson}
            hasNextLesson={!!getNextLesson}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#09090b] relative overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-50 pointer-events-none"></div>
             
             <div className="w-24 h-24 bg-stone-900 rounded-xl flex items-center justify-center mb-6 text-stone-700 border border-stone-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 group hover:border-amber-500/30 transition-colors duration-500">
               <Terminal size={48} strokeWidth={1} className="group-hover:text-amber-500 transition-colors duration-500" />
             </div>
             
             <h2 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">System Ready</h2>
             <p className="text-stone-500 max-w-md mx-auto leading-relaxed mb-8 font-mono text-sm">
               Select a mission parameter from the left timeline to access the archives.
             </p>
             
             <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <p className="font-bold flex items-center gap-2 justify-center uppercase tracking-wider text-xs font-mono mb-1">
                  <PlayCircle size={14} /> Priority Mission Available
                </p>
                <p className="text-emerald-200/70">Select <strong>Great Pyramid of Giza</strong> to begin simulation.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
