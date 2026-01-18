
import React, { useRef, useEffect } from 'react';
import { Era, TimelineNodeStub } from '../types';
import { ChevronRight, Terminal, Info, Lock } from 'lucide-react';
import { getEraNodesSorted } from '../services/nodeLocking';

interface TimelineSidebarProps {
  eras: Era[];
  nodes: TimelineNodeStub[];
  selectedEraId: string | null;
  selectedNodeId: string | null;
  showEraBriefing: boolean;
  eraLockStatus: Record<string, boolean>;
  nodeLockStatus: Record<string, boolean>;
  onSelectEra: (id: string) => void;
  onSelectNode: (node: TimelineNodeStub) => void;
  onSelectEraBriefing: (era: Era) => void;
}

export const TimelineSidebar: React.FC<TimelineSidebarProps> = ({
  eras,
  nodes,
  selectedEraId,
  selectedNodeId,
  showEraBriefing,
  eraLockStatus,
  nodeLockStatus,
  onSelectEra,
  onSelectNode,
  onSelectEraBriefing,
}) => {
  const eraRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (selectedEraId && eraRefs.current[selectedEraId]) {
      // Small delay to ensure the DOM has updated with the expanded list
      setTimeout(() => {
        eraRefs.current[selectedEraId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedEraId]);

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-black border-r border-stone-800 overflow-hidden flex-shrink-0 shadow-2xl z-20 text-stone-300 font-sans select-none">
      {/* Branding Header */}
      <div className="p-5 bg-stone-950 border-b border-stone-800 flex items-center gap-3 shadow-lg z-10 relative overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        
        <div className="w-10 h-10 rounded-md bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] relative z-10">
          <Terminal size={20} strokeWidth={2.5} />
        </div>
        <div className="relative z-10">
          <h1 className="font-display text-xl font-bold text-white tracking-tighter leading-none">CHRONOS</h1>
          <p className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-bold">
            <span className="text-amber-500">●</span> System Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-4 bg-[#050505]">
        {eras.map((era, index) => {
          // Sort nodes chronologically within each era
          const eraNodes = getEraNodesSorted(era.id, nodes);
          const isEraActive = selectedEraId === era.id;
          const isLocked = eraLockStatus[era.id] ?? false;

          return (
            <div 
                key={era.id} 
                className={`relative z-10 transition-opacity duration-300 ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}`}
                ref={(el) => { eraRefs.current[era.id] = el; }}
            >
              {/* Era Header */}
              <button
                onClick={() => {
                  if (!isLocked) {
                    onSelectEra(era.id);
                  }
                }}
                disabled={isLocked && !isEraActive} // Allow clicking if active (to close/toggle) or if not locked
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 outline-none group relative flex items-center gap-4 border
                  ${isEraActive 
                    ? 'bg-stone-900 border-stone-700 shadow-lg' 
                    : isLocked 
                        ? 'bg-stone-950/20 border-transparent cursor-not-allowed'
                        : 'bg-stone-950/50 border-stone-800 hover:bg-stone-900 hover:border-stone-700 cursor-pointer'}`}
              >
                {/* Era Level Indicator */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold border transition-colors flex-shrink-0
                  ${isLocked 
                    ? 'bg-stone-950 text-stone-700 border-stone-800' 
                    : isEraActive 
                        ? 'bg-amber-500 text-black border-amber-500' 
                        : 'bg-stone-900 text-stone-600 border-stone-800'}`}>
                  {isLocked ? <Lock size={12} /> : index + 1}
                </div>

                <div className="flex-1 min-w-0">
                   <div className="flex items-center justify-between mb-0.5">
                      <h2 className={`font-display text-sm uppercase tracking-wide transition-colors truncate font-bold
                        ${isEraActive ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`}>
                        {era.title}
                      </h2>
                      {!isLocked && (
                        <ChevronRight 
                            size={14} 
                            className={`transform transition-transform duration-300 text-stone-600
                            ${isEraActive ? 'rotate-90 text-amber-500' : ''}`} 
                        />
                      )}
                   </div>
                   <span className={`text-[10px] font-mono block uppercase tracking-wider
                    ${isEraActive ? 'text-amber-500/80' : 'text-stone-600'}`}>
                    {era.yearRange}
                  </span>
                </div>
              </button>

              {/* Nodes List */}
              {isEraActive && (
                <div className="relative ml-4 mt-2 pl-4 border-l-2 border-stone-800/50 space-y-1 animate-in slide-in-from-top-2 duration-200">
                  
                  {/* Era Briefing Button - Available when era is active (unlocked or opened) */}
                  <button
                    onClick={() => !isLocked && onSelectEraBriefing(era)}
                    disabled={isLocked}
                    className={`group relative flex items-center w-full text-left transition-all duration-150 rounded-lg outline-none py-2 px-3 border mb-2
                      ${isLocked 
                        ? 'cursor-not-allowed opacity-50'
                        : showEraBriefing && !selectedNodeId
                          ? 'bg-blue-950/20 border-blue-500/30'
                          : 'border-transparent hover:bg-stone-900'}`}
                  >
                     {/* Connector Dot */}
                     <div className={`absolute -left-[1.35rem] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-black transition-all z-20
                             ${showEraBriefing && !selectedNodeId ? 'border-blue-500 shadow-[0_0_8px_#3b82f6] scale-110' : 'border-stone-700'}`}>
                             {showEraBriefing && !selectedNodeId && <div className="absolute inset-0.5 bg-blue-500 rounded-full" />}
                    </div>
                     {/* Connector Line */}
                     <div className={`absolute -left-[1rem] top-1/2 w-4 h-px ${showEraBriefing && !selectedNodeId ? 'bg-blue-500/50' : 'bg-stone-800'}`} />

                     <div className="flex-1 min-w-0 flex items-center gap-2">
                        <Info size={14} className={showEraBriefing && !selectedNodeId ? 'text-blue-400' : 'text-stone-500'} />
                        <span className={`block font-bold text-xs font-mono uppercase tracking-wide
                            ${showEraBriefing && !selectedNodeId ? 'text-blue-200' : 'text-stone-400 group-hover:text-stone-300'}`}>
                          Era Briefing
                        </span>
                     </div>
                  </button>

                  {/* Node Items */}
                  {eraNodes.map((node) => {
                    const isNodeActive = selectedNodeId === node.id && !showEraBriefing;
                    const isDemo = node.id === 'pyramids'; 
                    // Check node lock status (nodes are locked if era is locked OR if previous node not completed)
                    const isNodeLocked = nodeLockStatus[node.id] ?? false; 

                    return (
                      <button
                        key={node.id}
                        onClick={() => !isNodeLocked && onSelectNode(node)}
                        disabled={isNodeLocked}
                        className={`group relative flex flex-col w-full text-left transition-all duration-150 rounded-lg outline-none py-2 px-3 border 
                          ${isNodeLocked ? 'cursor-not-allowed border-transparent opacity-50' : 'cursor-pointer'}
                          ${isNodeActive 
                            ? 'bg-amber-950/20 border-amber-500/30' 
                            : isDemo
                              ? 'bg-emerald-950/10 border-emerald-500/20 hover:bg-emerald-900/20'
                              : !isNodeLocked ? 'border-transparent hover:bg-stone-900' : ''}`}
                      >
                        {/* Active/Status Dot */}
                        <div className={`absolute -left-[1.35rem] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-black transition-all z-20
                             ${isNodeActive ? 'border-amber-500 shadow-[0_0_8px_#f59e0b] scale-110' : isDemo ? 'border-emerald-500 animate-pulse' : 'border-stone-700'}`}>
                             {isNodeActive && <div className="absolute inset-0.5 bg-amber-500 rounded-full" />}
                             {isNodeLocked && <div className="absolute inset-0.5 bg-stone-800 rounded-full" />}
                        </div>
                        
                        {/* Connector line to dot */}
                        <div className={`absolute -left-[1rem] top-1/2 w-4 h-px ${isNodeActive ? 'bg-amber-500/50' : 'bg-stone-800'}`} />

                        <div className="flex items-center justify-between w-full mb-0.5">
                             <span className={`text-[10px] font-mono font-bold tracking-tight
                                 ${isNodeActive ? 'text-amber-500' : isDemo ? 'text-emerald-500' : 'text-stone-500'}`}>
                               {node.year}
                             </span>
                             {isNodeLocked && <Lock size={10} className="text-stone-600" />}
                        </div>
                        <span className={`block font-medium text-xs truncate leading-snug
                             ${isNodeActive ? 'text-white' : isDemo ? 'text-emerald-100' : 'text-stone-400 group-hover:text-stone-300'}`}>
                           {node.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="p-3 border-t border-stone-800 bg-[#080808]">
        <div className="flex items-center justify-between text-[9px] text-stone-600 font-mono uppercase tracking-wider">
           <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Connected</span>
           <span>Ver 1.0.6</span>
        </div>
      </div>
    </div>
  );
};
