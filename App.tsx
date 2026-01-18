
import React, { useState, useCallback, useEffect } from 'react';
import { TimelineSidebar } from './components/TimelineSidebar';
import { NodeContentDisplay } from './components/NodeContentDisplay';
import { UserProfileModal } from './components/UserProfile';
import { ERAS, INITIAL_NODES } from './constants';
import { TimelineNode, TimelineNodeStub, Era, CollectibleCard } from './types';
import { fetchNodeContent } from './services/geminiService';
import { GamificationService, UserProfile } from './services/gamification';
import { AlertCircle, PlayCircle, Terminal, User, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [selectedEraId, setSelectedEraId] = useState<string | null>(ERAS[0].id);
  const [selectedNode, setSelectedNode] = useState<TimelineNode | null>(null);
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [nodeCache, setNodeCache] = useState<Record<string, TimelineNode>>({});

  // Gamification State
  const [userProfile, setUserProfile] = useState<UserProfile>(GamificationService.getProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Refresh profile on mount
  useEffect(() => {
    setUserProfile(GamificationService.getProfile());
  }, []);

  const handleSelectEra = (id: string) => {
    setSelectedEraId(id);
  };

  const handleSelectEraBriefing = (era: Era) => {
    setShowMobileDetail(true);
    setSelectedNode(null);
    setSelectedEra(era);
    setError(null);
  };

  const handleSelectNode = useCallback(async (stub: TimelineNodeStub) => {
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
  }, [nodeCache, selectedNode, loading]);

  const handleRetry = () => {
    if (selectedNode) {
      handleSelectNode(selectedNode);
    }
  };

  const handleBackToTimeline = () => {
    setShowMobileDetail(false);
  };

  const handleQuizComplete = (xp: number, artifact: any, collectibleCards?: CollectibleCard[]) => {
    GamificationService.addXp(xp);
    if (artifact) GamificationService.unlockArtifact(artifact);
    if (collectibleCards && collectibleCards.length > 0) {
      GamificationService.unlockCollectibleCards(collectibleCards);
    }
    if (selectedNode) GamificationService.completeNode(selectedNode.id);
    
    // Refresh local state to update UI
    setUserProfile(GamificationService.getProfile());
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
