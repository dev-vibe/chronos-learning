
import React, { useState } from 'react';
import { TimelineNode, Resource, HistoricalPerson, Invention, Place, DetailItem, Era, Artifact } from '../types';
import { Badge } from './Badge';
import { QuizModule } from './QuizModule';
import { BookOpen, Youtube, Mic, Globe, Lightbulb, Users, MapPin, ExternalLink, Crown, ScrollText, Sword, ChevronRight as ChevronRightIcon, Lock, RefreshCw, ArrowLeft, Target, Zap, Brain, Star, X, FileText, Crosshair, Layout, Clock, Scan } from 'lucide-react';

interface NodeContentDisplayProps {
  node?: TimelineNode | null;
  era?: Era;
  loading: boolean;
  onRetry?: () => void;
  onBack?: () => void;
  // Gamification props
  onQuizComplete?: (xp: number, artifact?: Artifact) => void;
  isNodeCompleted?: boolean;
}

export const NodeContentDisplay: React.FC<NodeContentDisplayProps> = ({ node, era, loading, onRetry, onBack, onQuizComplete, isNodeCompleted }) => {
  const [selectedItem, setSelectedItem] = useState<DetailItem | null>(null);

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-8 bg-[#09090b] relative overflow-hidden">
        {onBack && (
            <button onClick={onBack} className="absolute top-4 left-4 md:hidden z-50 p-2 bg-black/50 rounded-full border border-stone-800 text-stone-400 backdrop-blur-sm">
                <ArrowLeft size={20} />
            </button>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] opacity-[0.03] pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => <div key={i} className="border-r border-stone-700 h-full"></div>)}
        </div>
        
        <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 relative flex items-center justify-center">
                 <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
                 <div className="absolute inset-2 border-r-2 border-stone-700 rounded-full animate-spin [animation-duration:2s]"></div>
                 <div className="absolute inset-4 border-b-2 border-stone-800 rounded-full animate-spin [animation-duration:3s]"></div>
                 <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest mt-8">Decrypting Archives</h2>
            <div className="flex items-center gap-1 text-amber-500 font-mono text-xs uppercase tracking-widest mt-2">
                <span className="animate-[pulse_1s_infinite]">Reading Data Stream</span>
                <span className="animate-[pulse_1s_infinite_100ms]">.</span>
                <span className="animate-[pulse_1s_infinite_200ms]">.</span>
                <span className="animate-[pulse_1s_infinite_300ms]">.</span>
            </div>
        </div>
      </div>
    );
  }

  // --- ERA BRIEFING MODE ---
  if (era) {
      return (
        <div className="h-full overflow-y-auto bg-[#0c0c0e] pb-20 scroll-smooth font-sans text-stone-300 relative">
             <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
                 style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
            </div>
            
            <div className="w-full bg-blue-950/10 border-b border-blue-900/30 px-6 md:px-10 pt-10 pb-6 sticky top-0 z-20 backdrop-blur-xl">
                 {onBack && (
                    <button onClick={onBack} className="md:hidden mb-4 flex items-center gap-2 text-stone-400 hover:text-white font-mono font-bold text-xs uppercase tracking-wide">
                        <ArrowLeft size={16} /> Mission Log
                    </button>
                )}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 mb-2 text-blue-400 font-mono text-xs uppercase tracking-widest font-bold">
                        <Layout size={14} /> Era Briefing
                    </div>
                    <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">{era.title}</h1>
                    <p className="text-xl text-blue-200/70 font-display">{era.yearRange}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 md:px-10 py-10 space-y-12 relative z-10">
                {era.introQuote && (
                    <blockquote className="border-l-4 border-blue-500 pl-6 py-2 italic text-2xl text-stone-200 font-display font-light">
                        "{era.introQuote}"
                    </blockquote>
                )}
                <div className="text-lg leading-relaxed text-stone-300 whitespace-pre-wrap">
                    {era.description}
                </div>
                {era.details && (
                    <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden">
                        <div className="p-6 md:p-8 space-y-6">
                            <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                                <Lightbulb className="text-amber-400" /> 
                                {era.details.concept}
                            </h2>
                            <p className="text-stone-300 leading-relaxed whitespace-pre-wrap">
                                {era.details.explanation}
                            </p>
                            
                            <div className="pt-6 border-t border-stone-800">
                                <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-stone-500 mb-4">Key Themes Detected</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {era.details.keyThemes.map((theme, i) => (
                                        <div key={i} className="flex items-center gap-2 text-stone-300 bg-black/40 p-3 rounded border border-stone-800/50">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                            {theme}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {era.prehistoryContext && (
                    <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden p-6 md:p-8 space-y-4">
                         <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                            <Clock className="text-emerald-400" /> 
                            Prehistory Context
                        </h2>
                        <p className="text-stone-300 leading-relaxed whitespace-pre-wrap">{era.prehistoryContext}</p>
                    </div>
                )}
                 {era.modernDiscoveries && (
                    <div className="bg-stone-900/50 border border-stone-800 rounded-xl overflow-hidden p-6 md:p-8 space-y-4">
                         <h2 className="text-2xl font-bold text-white font-display flex items-center gap-3">
                            <Scan className="text-purple-400" /> 
                            Modern Discoveries
                        </h2>
                        <p className="text-stone-300 leading-relaxed whitespace-pre-wrap">{era.modernDiscoveries}</p>
                    </div>
                )}
            </div>
        </div>
      )
  }

  // --- NODE CONTENT MODE ---
  if (!node || !node.content) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#09090b] text-stone-400 p-8 text-center relative overflow-hidden">
         {onBack && (
            <button onClick={onBack} className="absolute top-4 left-4 md:hidden z-50 flex items-center gap-2 text-stone-500 font-bold bg-black/50 px-3 py-1 rounded-full border border-stone-800">
                <ArrowLeft size={16} /> Return
            </button>
        )}
         <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#09090b_80%)]"></div>
         
         <div className="max-w-md w-full bg-stone-900/80 backdrop-blur-sm p-1 rounded-xl border border-stone-800 relative z-10 shadow-2xl">
            <div className="bg-stone-900/50 p-8 rounded-lg flex flex-col items-center border border-stone-800/50">
                <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] relative">
                  <div className="absolute inset-0 rounded-full border border-red-500/20 animate-pulse"></div>
                  <Lock size={28} className="text-red-500/80" />
                </div>
                <h2 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">Data Locked</h2>
                <p className="text-stone-500 mb-6 text-sm leading-relaxed font-mono">
                    The archives for <span className="text-stone-300">{node?.title || 'Unknown Node'}</span> require manual decryption or have not yet been synthesized.
                </p>
                
                {onRetry && (
                     <button onClick={onRetry} className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono uppercase tracking-wider rounded border border-stone-700 transition-colors flex items-center gap-2">
                         <RefreshCw size={14} /> Retry Decryption
                     </button>
                )}
            </div>
         </div>
      </div>
    );
  }

  const { summary, people, inventions, places, resources, funFact, quiz } = node.content;
  const coreResources = resources.filter(r => r.isCore);
  const extraResources = resources.filter(r => !r.isCore);

  return (
    <div className="h-full overflow-y-auto bg-[#0c0c0e] pb-20 scroll-smooth font-sans text-stone-300 relative">
      <DetailOverlay item={selectedItem} onClose={() => setSelectedItem(null)} />

      <div className="fixed inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '50px 50px' }}>
      </div>

      <div className="w-full bg-[#0c0c0e]/90 backdrop-blur-xl border-b border-stone-800 px-6 md:px-10 pt-10 pb-6 sticky top-0 z-20 shadow-2xl">
        {onBack && (
            <button onClick={onBack} className="md:hidden mb-4 flex items-center gap-2 text-stone-400 hover:text-white font-mono font-bold text-xs uppercase tracking-wide">
                <ArrowLeft size={16} /> Mission Log
            </button>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3 mb-3 font-mono text-xs uppercase tracking-widest">
             <span className="text-amber-400 font-bold px-2 py-0.5 bg-amber-950/30 rounded border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">{node.year}</span>
             <span className="text-stone-600">/</span>
             <span className="text-cyan-400 font-bold flex items-center gap-1"><MapPin size={12} /> {node.region}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-none tracking-tight drop-shadow-lg">
            {node.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {node.tags.map(tag => <Badge key={tag} label={tag} />)}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 space-y-16 relative z-10">
        
        <section className="space-y-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-stone-800 text-stone-300 rounded flex items-center justify-center border border-stone-700 shadow-lg">
                    <FileText size={16} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">Field Report</h2>
            </div>
             
             <div className="prose prose-invert prose-lg prose-headings:font-display prose-headings:font-bold text-stone-300 leading-relaxed whitespace-pre-wrap max-w-4xl">
                {summary}
             </div>
             
             <div className="max-w-3xl mt-8">
                 <div className="bg-gradient-to-br from-stone-900 to-black border border-amber-500/30 p-1 rounded-xl relative group overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.05)]">
                    <div className="bg-stone-950/80 p-6 rounded-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-amber-500/20 rounded-tl-lg"></div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-amber-500/20 rounded-br-lg"></div>
                        
                        <div className="absolute -right-6 -top-6 opacity-[0.03] text-amber-500 transform group-hover:rotate-12 transition-transform duration-500">
                            <Lightbulb size={160} />
                        </div>
                        <h3 className="text-amber-500 font-mono font-black uppercase tracking-widest text-xs mb-3 flex items-center gap-2">
                            <Target size={14} className="animate-spin-slow" />
                            Field Note
                        </h3>
                        <p className="text-stone-200 font-display text-lg leading-relaxed relative z-10 border-l-2 border-amber-500/50 pl-4">
                            "{funFact}"
                        </p>
                    </div>
                 </div>
             </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-stone-800 to-transparent"></div>

        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-stone-800 text-stone-300 rounded flex items-center justify-center border border-stone-700 shadow-lg">
                    <MapPin size={16} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">Key Locations</h2>
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {places.map((place, idx) => (
                    <PlaceCard 
                        key={idx} 
                        place={place} 
                        onClick={() => setSelectedItem({ type: 'place', data: place })} 
                    />
                ))}
            </div>
        </section>

        <section>
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-stone-800 text-stone-300 rounded flex items-center justify-center border border-stone-700 shadow-lg">
                    <Users size={16} />
                </div>
                <h2 className="text-2xl font-display font-bold text-white tracking-wide">Key Players</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {people.map((person, idx) => (
                    <TradingCard 
                        key={idx} 
                        person={person} 
                        onClick={() => setSelectedItem({ type: 'person', data: person })}
                    />
                ))}
            </div>
        </section>

         {inventions.length > 0 && (
             <section>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 bg-stone-800 text-stone-300 rounded flex items-center justify-center border border-stone-700 shadow-lg">
                        <Zap size={16} />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">Key Inventions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {inventions.map((inv, idx) => (
                        <TechCard 
                            key={idx} 
                            invention={inv} 
                            index={idx} 
                            onClick={() => setSelectedItem({ type: 'invention', data: inv })}
                        />
                    ))}
                </div>
             </section>
         )}

        <section>
            <div className="flex items-center gap-4 mb-8 bg-amber-950/10 border border-amber-900/20 p-4 rounded-xl">
                <div className="w-10 h-10 bg-amber-500/10 text-amber-500 rounded flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                    <Target size={20} />
                </div>
                <div>
                    <h2 className="text-2xl font-display font-bold text-white tracking-wide">Core Resources</h2>
                    <p className="text-xs text-amber-500/70 uppercase tracking-wider font-mono font-bold">Required Data Analysis</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {coreResources.map((res, idx) => (
                    <ResourceCard key={idx} resource={res} variant="core" />
                ))}
            </div>
        </section>

         {extraResources.length > 0 && (
            <section className="bg-stone-900/30 rounded-2xl p-8 border border-dashed border-stone-800 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-display font-bold mb-2 flex items-center gap-3 text-stone-300">
                        <Globe size={20} className="text-purple-500" /> 
                        <span>Deep Dive</span>
                    </h2>
                    <p className="text-stone-500 text-sm mb-6 font-medium leading-relaxed max-w-2xl">
                        Optional modules for advanced learners. Completing these provides deeper insight into the era.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {extraResources.map((res, idx) => (
                            <a 
                            key={idx}
                            href={getResourceLink(res)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-4 p-3 rounded-lg bg-black border border-stone-800 hover:border-purple-500/50 hover:bg-stone-900 transition-all group"
                            >
                                <div className="p-2 bg-stone-900 rounded group-hover:bg-purple-900/20 transition-colors text-stone-500 group-hover:text-purple-400">
                                    {getResourceIcon(res.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-stone-300 text-sm truncate group-hover:text-white font-display">{res.title}</h4>
                                    <p className="text-[10px] text-stone-600 mt-0.5 uppercase tracking-wide font-mono group-hover:text-stone-500 truncate">{res.type} // {new URL(res.url).hostname}</p>
                                </div>
                                <ExternalLink size={14} className="text-stone-700 group-hover:text-purple-400 transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>
            </section>
         )}

         {/* GAMIFICATION MODULE */}
         {quiz && onQuizComplete && (
             <section className="mt-16 pt-8 border-t border-stone-800">
                 <QuizModule 
                    quiz={quiz} 
                    nodeId={node.id} 
                    isCompleted={isNodeCompleted || false} 
                    onComplete={onQuizComplete} 
                />
             </section>
         )}

      </div>
    </div>
  );
};

const TradingCard: React.FC<{ person: HistoricalPerson; onClick: () => void }> = ({ person, onClick }) => {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const getCardTheme = (cat: string) => {
      if (cat === 'Leader') return { border: 'border-amber-500/40', bg: 'from-amber-950/30 to-black', text: 'text-amber-500', shadow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]' };
      if (cat === 'Scientist') return { border: 'border-cyan-500/40', bg: 'from-cyan-950/30 to-black', text: 'text-cyan-400', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.15)]' };
      if (cat === 'Villain') return { border: 'border-red-600/40', bg: 'from-red-950/30 to-black', text: 'text-red-500', shadow: 'shadow-[0_0_15px_rgba(220,38,38,0.15)]' };
      if (cat === 'Military') return { border: 'border-orange-600/40', bg: 'from-orange-950/30 to-black', text: 'text-orange-500', shadow: 'shadow-[0_0_15px_rgba(234,88,12,0.15)]' };
      return { border: 'border-stone-700', bg: 'from-stone-900 to-black', text: 'text-stone-400', shadow: 'shadow-lg' };
  };

  const theme = getCardTheme(person.category);
  const fallbackImage = "https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=600&auto=format&fit=crop"; 

  return (
    <button onClick={onClick} className={`relative group w-full h-full flex flex-col bg-black border ${theme.border} rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 ${theme.shadow} text-left outline-none`}>
       <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 pointer-events-none z-20 transition-opacity duration-500" style={{ backgroundSize: '200% 200%' }}></div>

       <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex justify-between items-center relative z-10">
          <h3 className="font-display font-bold text-stone-200 truncate">{person.name}</h3>
          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 rounded border border-current ${theme.text} opacity-80`}>
            {person.category}
          </span>
       </div>

       <div className="relative aspect-[4/3] w-full bg-stone-900 overflow-hidden border-b border-stone-800">
         {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900 z-10">
                <div className="w-6 h-6 border-2 border-stone-700 border-t-amber-500 rounded-full animate-spin"></div>
            </div>
         )}
         <img 
           src={imgError ? fallbackImage : (person.imageUrl || fallbackImage)} 
           alt={person.name}
           onLoad={() => setImgLoaded(true)}
           onError={() => setImgError(true)}
           className={`w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 ${imgLoaded ? 'block' : 'hidden'}`} 
         />
         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8 pointer-events-none z-30">
            <div className="text-xs font-mono font-bold text-white/90 uppercase tracking-wide flex items-center gap-2">
               {person.category === 'Leader' && <Crown size={12} className="text-amber-400" />}
               {person.category === 'Scientist' && <Brain size={12} className="text-cyan-400" />}
               {person.category === 'Military' && <Sword size={12} className="text-orange-400" />}
               {person.role}
            </div>
         </div>
       </div>

       <div className={`flex-1 p-4 bg-gradient-to-b ${theme.bg} flex flex-col relative`}>
          <div className="mb-4 flex-1">
            <p className="text-xs text-stone-400 leading-relaxed italic border-l-2 border-stone-800 pl-3 line-clamp-3">
              "{person.description}"
            </p>
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/10 p-1 rounded-full backdrop-blur-sm">
                  <ExternalLink size={12} className="text-white" />
              </div>
          </div>
       </div>
       
       <div className="bg-black px-3 py-1 border-t border-stone-900 flex justify-between items-center">
         <span className="text-[8px] font-mono text-stone-700 uppercase">Series 1 // {person.category.substring(0,3).toUpperCase()}</span>
         <span className="text-[8px] font-mono text-stone-600">#{Math.floor(Math.random() * 900) + 100}</span>
       </div>
    </button>
  );
}

const TechCard: React.FC<{ invention: Invention; index: number; onClick: () => void }> = ({ invention, index, onClick }) => {
    return (
        <button onClick={onClick} className="text-left w-full bg-stone-950/50 border border-stone-800 p-5 rounded-xl hover:bg-stone-900 hover:border-cyan-500/30 transition-all duration-300 group relative overflow-hidden outline-none">
            <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-3 relative z-10">
                <h4 className="font-bold text-cyan-100 text-lg font-display group-hover:text-cyan-400 transition-colors">{invention.name}</h4>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed relative z-10 group-hover:text-stone-400 line-clamp-3">{invention.description}</p>
            <div className="mt-4 pt-3 border-t border-stone-800/50 flex items-center justify-between relative z-10">
                <span className="text-[10px] font-mono text-cyan-900 uppercase font-bold group-hover:text-cyan-700">Blueprint #{index + 1}</span>
                <Badge label={invention.category} />
            </div>
             <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={14} className="text-cyan-500" />
            </div>
        </button>
    );
}

const PlaceCard: React.FC<{ place: Place; onClick: () => void }> = ({ place, onClick }) => {
    const [imgError, setImgError] = useState(false);
    const fallbackImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop";

    return (
        <button onClick={onClick} className="text-left w-full bg-black border border-stone-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300 group relative outline-none hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <div className="relative h-32 w-full bg-stone-900 overflow-hidden">
                <img 
                    src={imgError ? fallbackImage : (place.imageUrl || fallbackImage)} 
                    alt={place.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur border border-stone-700 rounded px-2 py-0.5 text-[9px] font-mono text-emerald-500 flex items-center gap-1">
                    <Crosshair size={10} />
                    <span>LOC-{(place.name.length * 34).toString().substring(0,4)}</span>
                </div>
            </div>
            
            <div className="p-4 relative">
                <h4 className="font-bold text-white text-lg font-display mb-1 group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                    {place.name}
                </h4>
                <div className="flex items-center gap-1 text-[10px] text-stone-500 uppercase font-mono mb-2">
                    <MapPin size={10} />
                    {place.location || 'Unknown Coordinates'}
                </div>
                <p className="text-sm text-stone-400 leading-relaxed line-clamp-2 border-l border-stone-800 pl-2 group-hover:border-emerald-500/50 transition-colors">
                    {place.description}
                </p>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                     <div className="bg-stone-900 p-1.5 rounded-full border border-stone-700">
                        <ChevronRightIcon size={14} className="text-emerald-500" />
                     </div>
                </div>
            </div>
        </button>
    )
}

const DetailOverlay: React.FC<{ item: DetailItem | null; onClose: () => void }> = ({ item, onClose }) => {
    if (!item) return null;

    const { type, data } = item;
    const fallbackImage = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop";
    
    let title = '';
    let subtitle = '';
    let description = '';
    let image = '';
    let badges: string[] = [];
    
    // Rich data fields
    let problem = '';
    let solution = '';
    let impact = '';
    let significance = '';
    let lore = '';

    // Person fields
    let achievements: string[] = [];
    let legacy = '';
    let born = '';
    let died = '';

    if (type === 'person') {
        title = data.name;
        subtitle = data.role;
        description = data.description;
        image = data.imageUrl || fallbackImage;
        badges = [data.category];
        achievements = data.achievements || [];
        legacy = data.legacy || '';
        born = data.born || '';
        died = data.died || '';
    } else if (type === 'invention') {
        title = data.name;
        subtitle = `Invented: ${data.date || 'Ancient Era'}`;
        description = data.description;
        image = data.imageUrl || fallbackImage;
        badges = [data.category];
        problem = data.problem || '';
        solution = data.solution || '';
        impact = data.impact || '';
    } else if (type === 'place') {
        title = data.name;
        subtitle = data.location || 'Historical Site';
        description = data.description;
        image = data.imageUrl || fallbackImage;
        significance = data.significance || '';
        lore = data.lore || '';
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-[#09090b] w-full max-w-4xl h-full max-h-[90vh] rounded-2xl border border-stone-800 shadow-2xl flex flex-col overflow-hidden relative animate-in zoom-in-95 duration-300">
                <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white hover:bg-stone-800 hover:text-amber-500 transition-colors border border-stone-700">
                    <X size={20} />
                </button>

                <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 h-full">
                    <div className="relative h-64 md:h-full bg-stone-900 border-b md:border-b-0 md:border-r border-stone-800 group">
                        <img src={image} alt={title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] to-transparent opacity-90 md:opacity-40"></div>
                        <div className="absolute bottom-6 left-6 right-6">
                             <div className="flex gap-2 mb-2">
                                {badges.map(b => <Badge key={b} label={b} />)}
                             </div>
                             <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">{title}</h2>
                             <p className="text-stone-400 font-mono uppercase tracking-widest text-xs mt-2">{subtitle}</p>
                        </div>
                    </div>

                    <div className="p-6 md:p-10 space-y-8 bg-[#09090b]">
                        <div>
                            <h3 className="text-stone-500 font-mono font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                <FileText size={14} /> Data Analysis
                            </h3>
                            <p className="text-lg text-stone-300 leading-relaxed font-light border-l-2 border-stone-800 pl-4">
                                {description}
                            </p>
                        </div>

                        {type === 'person' && (born || died || achievements.length > 0) && (
                             <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {born && (
                                        <div className="bg-stone-900/40 p-3 rounded border border-stone-800">
                                            <div className="text-[10px] text-stone-500 uppercase font-mono mb-1">Born</div>
                                            <div className="text-stone-200 font-bold">{born}</div>
                                        </div>
                                    )}
                                    {died && (
                                        <div className="bg-stone-900/40 p-3 rounded border border-stone-800">
                                            <div className="text-[10px] text-stone-500 uppercase font-mono mb-1">Died</div>
                                            <div className="text-stone-200 font-bold">{died}</div>
                                        </div>
                                    )}
                                </div>
                                {achievements.length > 0 && (
                                    <div className="bg-amber-950/10 p-4 rounded-lg border border-amber-900/20">
                                         <h4 className="text-amber-500 font-bold font-display text-sm uppercase mb-3 flex items-center gap-2">
                                            <Star size={14} /> Key Achievements
                                        </h4>
                                        <ul className="space-y-2">
                                            {achievements.map((a, i) => (
                                                <li key={i} className="text-sm text-stone-300 flex items-start gap-2">
                                                    <span className="text-amber-500/50 mt-1">•</span> {a}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {legacy && (
                                    <div>
                                         <h4 className="text-stone-500 font-bold font-mono text-xs uppercase mb-2 flex items-center gap-2">
                                            <ScrollText size={14} /> Historical Legacy
                                        </h4>
                                        <p className="text-stone-400 text-sm italic border-l-2 border-stone-800 pl-3">"{legacy}"</p>
                                    </div>
                                )}
                             </div>
                        )}

                        {(problem || solution) && (
                            <div className="space-y-6">
                                <div className="bg-red-950/10 p-4 rounded-lg border border-red-900/20">
                                    <h4 className="text-red-400 font-bold font-display text-sm uppercase mb-2 flex items-center gap-2">
                                        <Crosshair size={16} /> The Problem
                                    </h4>
                                    <p className="text-stone-400 text-sm">{problem}</p>
                                </div>
                                <div className="bg-emerald-950/10 p-4 rounded-lg border border-emerald-900/20 relative">
                                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-[#09090b] text-stone-700 rounded-full p-1 border border-stone-800">
                                        <ChevronRightIcon size={14} />
                                    </div>
                                    <h4 className="text-emerald-400 font-bold font-display text-sm uppercase mb-2 flex items-center gap-2">
                                        <Lightbulb size={16} /> The Solution
                                    </h4>
                                    <p className="text-stone-400 text-sm">{solution}</p>
                                </div>
                            </div>
                        )}

                        {(impact || significance) && (
                            <div>
                                <h3 className="text-amber-500 font-mono font-bold text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Zap size={14} /> Historical Impact
                                </h3>
                                <p className="text-stone-400 text-sm leading-relaxed">
                                    {impact || significance}
                                </p>
                            </div>
                        )}

                        {lore && (
                            <div className="bg-stone-900/30 p-4 rounded-lg border border-stone-800">
                                <h4 className="text-purple-400 font-bold font-display text-sm uppercase mb-2 flex items-center gap-2">
                                    <BookOpen size={14} /> Local Lore
                                </h4>
                                <p className="text-stone-400 text-sm italic">{lore}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const getResourceLink = (res: Resource) => {
    // Primary: use direct URL
    if (res.url) return res.url;

    // Legacy fallback: use searchQuery if it exists (for backward compatibility)
    if (res.searchQuery) {
        if (res.type === 'Video') return `https://www.youtube.com/results?search_query=${encodeURIComponent(res.searchQuery)}`;
        if (res.type === 'Podcast') return `https://www.google.com/search?q=${encodeURIComponent(res.searchQuery + " podcast")}`;
        return `https://www.google.com/search?q=${encodeURIComponent(res.searchQuery)}`;
    }

    // Fallback to empty string (shouldn't happen with valid data)
    return '#';
};

const getResourceIcon = (type: string) => {
    if (type === 'Video') return <Youtube size={18} />;
    if (type === 'Podcast') return <Mic size={18} />;
    return <BookOpen size={18} />;
};

const ResourceCard: React.FC<{ resource: Resource, variant?: 'core' | 'default' }> = ({ resource, variant }) => {
    const isVideo = resource.type === 'Video';
    return (
        <a 
            href={getResourceLink(resource)}
            target="_blank"
            rel="noreferrer" 
            className={`flex flex-col bg-[#111] border rounded-xl p-5 transition-all duration-200 group h-full relative overflow-hidden
                ${variant === 'core' 
                    ? 'border-stone-800 hover:border-amber-500/50 hover:bg-[#161616] hover:shadow-[0_0_20px_rgba(0,0,0,0.5)]' 
                    : 'border-stone-800 hover:border-stone-600'}`}
        >
            <div className={`absolute top-0 left-0 w-1 h-full transition-colors ${isVideo ? 'bg-red-900/50' : 'bg-stone-800'} group-hover:bg-amber-500`}></div>
            <div className="flex items-start justify-between mb-3 pl-3">
                <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-1 rounded
                     ${isVideo ? 'bg-red-950/30 text-red-400 border border-red-900/50' : 'bg-stone-900 text-stone-500 border border-stone-800'}`}>
                    {getResourceIcon(resource.type)}
                    {resource.type}
                </span>
                <ExternalLink size={14} className="text-stone-700 group-hover:text-amber-500 transition-colors" />
            </div>
            <h3 className="font-bold text-lg text-stone-200 mb-2 leading-tight group-hover:text-white transition-colors pl-3 font-display">
                {resource.title}
            </h3>
            <p className="text-sm text-stone-500 flex-1 leading-relaxed pl-3 border-l border-stone-900 group-hover:border-stone-800 transition-colors">
                {resource.description}
            </p>
            <div className="mt-5 pl-3 text-[10px] font-mono font-bold text-stone-600 uppercase tracking-widest group-hover:text-amber-500 transition-colors flex items-center gap-2">
                Execute <ChevronRightIcon size={10} strokeWidth={3} />
            </div>
        </a>
    );
};
