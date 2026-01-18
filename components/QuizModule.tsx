
import React, { useState } from 'react';
import { Quiz, Artifact, CollectibleCard, NodeContent } from '../types';
import { Terminal, CheckCircle2, XCircle, ChevronRight, Award, ShieldAlert, Lock, Unlock, Sparkles } from 'lucide-react';

interface QuizModuleProps {
  quiz: Quiz;
  nodeId: string;
  isCompleted: boolean;
  nodeContent?: NodeContent; // Needed to resolve collectible card references
  onComplete: (xp: number, artifact?: Artifact, collectibleCards?: CollectibleCard[]) => void;
}

// Helper function to convert CollectibleCardRef to CollectibleCard
const resolveCollectibleCards = (quiz: Quiz, nodeContent?: NodeContent): CollectibleCard[] => {
  if (!quiz.collectibleCards || !nodeContent) return [];
  
  return quiz.collectibleCards.map((ref, idx) => {
    let card: CollectibleCard | null = null;
    
    if (ref.type === 'person' && nodeContent.people[ref.index]) {
      const person = nodeContent.people[ref.index];
      card = {
        id: ref.id || `${quiz.title}_person_${ref.index}`,
        type: 'person',
        name: person.name,
        description: person.description,
        imageUrl: person.imageUrl,
        category: person.category,
        role: person.role,
        rarity: 'Common' // Default rarity, can be customized per card
      };
    } else if (ref.type === 'invention' && nodeContent.inventions[ref.index]) {
      const invention = nodeContent.inventions[ref.index];
      card = {
        id: ref.id || `${quiz.title}_invention_${ref.index}`,
        type: 'invention',
        name: invention.name,
        description: invention.description,
        imageUrl: invention.imageUrl,
        category: invention.category,
        rarity: 'Common'
      };
    } else if (ref.type === 'place' && nodeContent.places[ref.index]) {
      const place = nodeContent.places[ref.index];
      card = {
        id: ref.id || `${quiz.title}_place_${ref.index}`,
        type: 'place',
        name: place.name,
        description: place.description,
        imageUrl: place.imageUrl,
        location: place.location,
        rarity: 'Common'
      };
    }
    
    return card;
  }).filter((card): card is CollectibleCard => card !== null);
};

export const QuizModule: React.FC<QuizModuleProps> = ({ quiz, nodeId, isCompleted, nodeContent, onComplete }) => {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [finished, setFinished] = useState(isCompleted);
  const [score, setScore] = useState(0);

  const currentQ = quiz.questions[currentQIndex];
  const isLastQuestion = currentQIndex === quiz.questions.length - 1;

  const handleStart = () => {
    setStarted(true);
    setFinished(false);
    setCurrentQIndex(0);
    setScore(0);
  };

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    
    const correct = index === currentQ.correctIndex;
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    setShowResult(false);
    setSelectedOption(null);
    
    if (isLastQuestion) {
      setFinished(true);
      const passed = score + (isCorrect ? 0 : 0) === quiz.questions.length; // Strict: Must get all right? Or mostly?
      // Let's make it lenient for now, or just calculate at the end.
      // Actually, let's track score.
      
      const finalScore = score; 
      const isPerfect = finalScore === quiz.questions.length;
      
      if (isPerfect) {
          const collectibleCards = resolveCollectibleCards(quiz, nodeContent);
          onComplete(100, quiz.rewardArtifact, collectibleCards);
      } else {
          // Retry needed? Or partial XP?
          // For simplicity: Fail state if not perfect
      }
    } else {
      setCurrentQIndex(i => i + 1);
    }
  };

  if (isCompleted && !started) {
     return (
        <div className="bg-emerald-950/10 border border-emerald-500/30 rounded-xl p-6 relative overflow-hidden">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 border border-emerald-500/50">
                     <Unlock size={24} />
                 </div>
                 <div>
                     <h3 className="text-emerald-400 font-display font-bold text-lg">Decryption Complete</h3>
                     <p className="text-stone-400 text-sm font-mono">Security clearance granted. Artifact secured.</p>
                 </div>
                 <button onClick={handleStart} className="ml-auto px-4 py-2 bg-emerald-900/30 border border-emerald-700/50 rounded text-emerald-300 text-xs font-mono hover:bg-emerald-800/30 transition-colors">
                     Replay Sim
                 </button>
             </div>
        </div>
     );
  }

  if (finished) {
      const isPerfect = score === quiz.questions.length;
      
      return (
          <div className="bg-stone-900 border border-stone-700 rounded-xl p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_50%,transparent_75%,transparent_100%)] bg-[size:250%_250%,100%_100%] animate-[shimmer_3s_infinite]"></div>
              
              <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 border-2 ${isPerfect ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : 'bg-red-500/20 border-red-500 text-red-500'}`}>
                      {isPerfect ? <Award size={32} /> : <ShieldAlert size={32} />}
                  </div>
                  
                  <h3 className="text-2xl font-display font-bold text-white mb-2">
                      {isPerfect ? 'MISSION ACCOMPLISHED' : 'DECRYPTION FAILED'}
                  </h3>
                  
                  <p className="text-stone-400 font-mono mb-6">
                      {isPerfect 
                        ? `Integrity Check: 100%. Data verified. Rewards transferred to profile.`
                        : `Integrity Check: ${Math.round((score/quiz.questions.length)*100)}%. Threshold not met. Access denied.`}
                  </p>
                  
                  {isPerfect && (
                      <div className="space-y-4 mb-6">
                          {quiz.rewardArtifact && (
                              <div className="max-w-xs mx-auto bg-black border border-amber-500/30 rounded-lg p-4">
                                   <div className="text-[10px] text-amber-500 font-mono uppercase tracking-widest mb-1">Artifact Recovered</div>
                                   <div className="text-white font-display font-bold">{quiz.rewardArtifact.name}</div>
                              </div>
                          )}
                          
                          {quiz.collectibleCards && quiz.collectibleCards.length > 0 && nodeContent && (() => {
                              const cards = resolveCollectibleCards(quiz, nodeContent);
                              if (cards.length === 0) return null;
                              
                              return (
                                  <div className="max-w-2xl mx-auto">
                                      <div className="text-[10px] text-purple-400 font-mono uppercase tracking-widest mb-3 text-center flex items-center justify-center gap-2">
                                          <Sparkles size={12} />
                                          Collectible Cards Unlocked
                                      </div>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                          {cards.map((card) => (
                                              <div key={card.id} className="bg-black border border-purple-500/30 rounded-lg p-3 group hover:border-purple-400/50 transition-colors">
                                                  <div className="aspect-square bg-stone-900 rounded mb-2 overflow-hidden relative">
                                                      <img 
                                                          src={card.imageUrl || "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400&auto=format&fit=crop&q=60"} 
                                                          alt={card.name}
                                                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                                                      />
                                                  </div>
                                                  <h4 className="text-stone-200 font-bold text-xs truncate font-display">{card.name}</h4>
                                                  {card.role && (
                                                      <p className="text-[9px] text-stone-500 font-mono mt-0.5 truncate">{card.role}</p>
                                                  )}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              );
                          })()}
                      </div>
                  )}

                  <button 
                    onClick={handleStart}
                    className={`px-6 py-2 rounded font-mono font-bold uppercase tracking-wider text-sm border transition-all
                        ${isPerfect 
                            ? 'bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-700' 
                            : 'bg-red-900/30 border-red-500/50 text-red-400 hover:bg-red-900/50'}`}
                  >
                      {isPerfect ? 'Run Simulation Again' : 'Retry Protocol'}
                  </button>
              </div>
          </div>
      )
  }

  if (!started) {
    return (
      <div className="bg-stone-950 border border-stone-800 rounded-xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 opacity-50"></div>
          
          <div className="p-8 text-center">
               <div className="w-16 h-16 bg-stone-900 rounded-full mx-auto flex items-center justify-center mb-4 border border-stone-700 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-amber-500/50 transition-colors">
                   <Terminal size={32} className="text-stone-500 group-hover:text-amber-500 transition-colors" />
               </div>
               
               <h3 className="text-xl font-display font-bold text-white mb-2">DECRYPTION PROTOCOL DETECTED</h3>
               <p className="text-stone-500 text-sm max-w-md mx-auto mb-6">
                   Complete the security challenge to verify your knowledge and unlock hidden data artifacts.
               </p>
               
               <div className="flex justify-center gap-8 text-xs font-mono text-stone-600 mb-8">
                   <div className="flex flex-col items-center">
                       <span className="text-stone-400 font-bold text-lg">3</span>
                       <span>CHALLENGES</span>
                   </div>
                   <div className="w-px bg-stone-800 h-full"></div>
                   <div className="flex flex-col items-center">
                       <span className="text-amber-500 font-bold text-lg">100</span>
                       <span>XP REWARD</span>
                   </div>
                   {quiz.rewardArtifact && (
                       <>
                        <div className="w-px bg-stone-800 h-full"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-purple-400 font-bold text-lg">1</span>
                            <span>ARTIFACT</span>
                        </div>
                       </>
                   )}
                   {quiz.collectibleCards && quiz.collectibleCards.length > 0 && (
                       <>
                        <div className="w-px bg-stone-800 h-full"></div>
                        <div className="flex flex-col items-center">
                            <span className="text-cyan-400 font-bold text-lg">{quiz.collectibleCards.length}</span>
                            <span>CARDS</span>
                        </div>
                       </>
                   )}
               </div>
               
               <button 
                onClick={handleStart}
                className="bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono py-2 px-8 rounded uppercase tracking-wider transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:shadow-[0_0_25px_rgba(245,158,11,0.5)]"
               >
                   Initialize
               </button>
          </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 border border-stone-700 rounded-xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-[#0f0f0f] px-4 py-2 border-b border-stone-800 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
                </div>
                <span className="text-[10px] font-mono text-stone-500 font-bold ml-2">SECURE_SHELL_V2.0</span>
            </div>
            <div className="text-[10px] font-mono text-amber-500">
                SEQ {currentQIndex + 1}/{quiz.questions.length}
            </div>
        </div>

        <div className="p-6 md:p-8">
            <h4 className="text-lg md:text-xl font-display font-bold text-white mb-6">
                <span className="text-amber-500 mr-2">root@chronos:~$</span>
                {currentQ.text}
            </h4>

            <div className="space-y-3">
                {currentQ.options.map((opt, idx) => {
                    let btnClass = "border-stone-700 hover:bg-stone-800 text-stone-300";
                    if (selectedOption !== null) {
                        if (idx === currentQ.correctIndex) btnClass = "border-emerald-500 bg-emerald-950/30 text-emerald-400";
                        else if (idx === selectedOption) btnClass = "border-red-500 bg-red-950/30 text-red-400";
                        else btnClass = "border-stone-800 text-stone-600 opacity-50";
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded border font-mono text-sm transition-all duration-200 flex items-center justify-between group ${btnClass}`}
                        >
                            <span className="flex items-center gap-3">
                                <span className="text-[10px] opacity-50">[{String.fromCharCode(65+idx)}]</span>
                                {opt}
                            </span>
                            {selectedOption !== null && idx === currentQ.correctIndex && <CheckCircle2 size={16} />}
                            {selectedOption === idx && idx !== currentQ.correctIndex && <XCircle size={16} />}
                        </button>
                    )
                })}
            </div>

            {/* Feedback & Next Button */}
            <div className={`mt-6 transition-all duration-300 overflow-hidden ${showResult ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className={`p-4 rounded border ${isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-red-950/20 border-red-500/30'}`}>
                    <p className={`text-sm font-mono mb-3 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isCorrect ? '>> RESPONSE VERIFIED.' : '>> ERROR: DATA MISMATCH.'}
                    </p>
                    <p className="text-stone-300 text-sm mb-4">
                        {currentQ.explanation}
                    </p>
                    <button 
                        onClick={handleNext}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white hover:text-amber-500 transition-colors"
                    >
                        {isLastQuestion ? 'Finalize Report' : 'Next Sequence'} <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
