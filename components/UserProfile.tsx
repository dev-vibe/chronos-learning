
import React from 'react';
import { UserProfile as UserProfileType } from '../services/gamification';
import { Artifact } from '../types';
import { X, Shield, Award, Lock, User, Database } from 'lucide-react';
import { STATIC_CONTENT } from '../staticContent';

interface UserProfileProps {
  profile: UserProfileType;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to find full artifact data from IDs
const getArtifactDetails = (ids: string[]): Artifact[] => {
    const artifacts: Artifact[] = [];
    Object.values(STATIC_CONTENT).forEach(node => {
        if (node.quiz?.rewardArtifact && ids.includes(node.quiz.rewardArtifact.id)) {
            artifacts.push(node.quiz.rewardArtifact);
        }
    });
    return artifacts;
};

export const UserProfileModal: React.FC<UserProfileProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  const unlockedArtifacts = getArtifactDetails(profile.artifacts);
  
  // Calculate Progress to next level
  const currentLevelXp = 100 * Math.pow(profile.level - 1, 2);
  const nextLevelXp = 100 * Math.pow(profile.level, 2);
  const levelProgress = ((profile.xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c0c0e] w-full max-w-2xl rounded-2xl border border-stone-800 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-950 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg flex items-center justify-center">
                    <Shield size={20} />
                </div>
                <div>
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Agent Dossier</h2>
                    <p className="text-[10px] font-mono text-stone-500 uppercase">ID: CHRONOS-OPERATIVE</p>
                </div>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl">
                    <div className="text-xs font-mono text-stone-500 uppercase mb-1">Clearance Level</div>
                    <div className="text-4xl font-display font-bold text-white mb-2">{profile.level}</div>
                    <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${levelProgress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-1 text-[9px] font-mono text-stone-600">
                        <span>{profile.xp} XP</span>
                        <span>NEXT: {nextLevelXp} XP</span>
                    </div>
                </div>
                
                <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex flex-col justify-center">
                    <div className="text-xs font-mono text-stone-500 uppercase mb-1">Artifacts Secured</div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-display font-bold text-emerald-400">{profile.artifacts.length}</span>
                        <span className="text-stone-600 font-mono text-sm mb-1.5">/ ???</span>
                    </div>
                </div>
            </div>

            {/* Artifact Vault */}
            <div>
                <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Database size={16} className="text-purple-500" /> 
                    Artifact Vault
                </h3>
                
                {unlockedArtifacts.length === 0 ? (
                    <div className="border border-dashed border-stone-800 rounded-xl p-8 text-center text-stone-600">
                        <Lock size={24} className="mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-mono">Vault Empty. Complete node protocols to recover artifacts.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {unlockedArtifacts.map(artifact => (
                            <div key={artifact.id} className="bg-black border border-stone-800 rounded-lg p-3 group hover:border-amber-500/30 transition-colors">
                                <div className="aspect-square bg-stone-900 rounded mb-3 overflow-hidden relative">
                                    <img src={artifact.imageUrl || "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400&auto=format&fit=crop&q=60"} alt={artifact.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-1 right-1">
                                        {artifact.rarity === 'Legendary' && <Award size={12} className="text-amber-500" />}
                                    </div>
                                </div>
                                <h4 className="text-stone-200 font-bold text-xs truncate font-display">{artifact.name}</h4>
                                <p className="text-[9px] text-stone-500 font-mono uppercase mt-0.5">{artifact.rarity}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};
