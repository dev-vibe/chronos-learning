
import React, { useState } from 'react';
import { UserProfile as UserProfileType } from '../services/gamification';
import { getImageUrlWithFallback } from '../utils/imageUtils';
import { X, Shield, Sparkles, User, Loader, CheckCircle, Settings, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface UserProfileProps {
  profile: UserProfileType;
  isOpen: boolean;
  onClose: () => void;
}

// Helper to get user display name
const getUserDisplayName = (user: SupabaseUser | null, isGuest: boolean): string => {
  if (isGuest) {
    return 'GUEST';
  }

  if (!user) {
    return 'CHRONOS-OPERATIVE';
  }

  const metadata = user.user_metadata || {};
  
  if (metadata.full_name && metadata.full_name.trim()) {
    return metadata.full_name.toUpperCase();
  }
  if (metadata.name && metadata.name.trim()) {
    return metadata.name.toUpperCase();
  }

  if (user.email) {
    const emailName = user.email.split('@')[0];
    return emailName.replace(/[._-]/g, ' ').toUpperCase();
  }

  return 'CHRONOS-OPERATIVE';
};

export const UserProfileModal: React.FC<UserProfileProps> = ({ profile, isOpen, onClose }) => {
  const { user, isGuest, updateUserName, refreshUser } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [savingName, setSavingName] = useState(false);

  // Initialize name value when user changes or settings opens
  React.useEffect(() => {
    if (user && showSettings) {
      const metadata = user.user_metadata || {};
      setNameValue(metadata.full_name || metadata.name || '');
    }
  }, [user, showSettings]);

  // Collectible cards come from profile prop
  const collectibleCards = profile.collectibleCards || [];

  if (!isOpen) return null;
  
  const handleSaveName = async () => {
    if (!user || isGuest) return;

    const trimmedName = nameValue.trim();
    if (!trimmedName) {
      setNameError('Name cannot be empty');
      return;
    }

    setSavingName(true);
    setNameError(null);

    const { error } = await updateUserName(trimmedName);
    
    if (error) {
      setNameError(error.message);
      setSavingName(false);
    } else {
      await refreshUser();
      setEditingName(false);
      setSavingName(false);
    }
  };

  const currentDisplayName = getUserDisplayName(user, isGuest);

  // Status badge
  const getStatusBadge = () => {
    if (isGuest) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-800/50 border border-stone-700 rounded-md">
          <User size={12} className="text-stone-400" />
          <span className="text-[10px] font-mono text-stone-400 uppercase">Guest Mode</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-950/50 border border-emerald-500/50 rounded-md">
        <CheckCircle size={12} className="text-emerald-400" />
        <span className="text-[10px] font-mono text-emerald-300 uppercase">Connected</span>
      </div>
    );
  };

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
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] font-mono text-stone-500 uppercase">ID: {currentDisplayName}</p>
                      {getStatusBadge()}
                    </div>
                </div>
            </div>
            <button onClick={onClose} className="text-stone-500 hover:text-white transition-colors">
                <X size={24} />
            </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">
            
            {/* Settings Section */}
            {!isGuest && user && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Settings size={16} className="text-cyan-500" /> 
                    Agent Settings
                  </h3>
                  <button
                    onClick={() => {
                      setShowSettings(!showSettings);
                      setEditingName(false);
                      setNameError(null);
                    }}
                    className="text-xs text-stone-400 hover:text-cyan-400 transition-colors font-mono uppercase"
                  >
                    {showSettings ? 'Hide' : 'Show'}
                  </button>
                </div>

                {showSettings && (
                  <div className="bg-stone-900/50 border border-stone-800 rounded-xl p-4 space-y-4">
                    {/* Name Editor */}
                    <div>
                      <label className="block text-xs font-mono text-stone-400 uppercase mb-2">
                        Agent Name
                      </label>
                      {editingName ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={nameValue}
                              onChange={(e) => {
                                setNameValue(e.target.value);
                                setNameError(null);
                              }}
                              className="flex-1 bg-stone-800/50 border border-stone-700 rounded-lg px-3 py-2 text-white placeholder-stone-600 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"
                              placeholder="Enter your name"
                              disabled={savingName}
                              autoFocus
                            />
                            <button
                              onClick={handleSaveName}
                              disabled={savingName || !nameValue.trim()}
                              className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                              {savingName ? (
                                <>
                                  <Loader size={14} className="animate-spin" />
                                  <span className="text-xs">Saving...</span>
                                </>
                              ) : (
                                <>
                                  <Save size={14} />
                                  <span className="text-xs">Save</span>
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingName(false);
                                setNameError(null);
                                const metadata = user.user_metadata || {};
                                setNameValue(metadata.full_name || metadata.name || '');
                              }}
                              disabled={savingName}
                              className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {nameError && (
                            <p className="text-xs text-red-400 font-mono">{nameError}</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <p className="flex-1 text-sm font-mono text-stone-300 uppercase bg-stone-800/30 border border-stone-700 rounded-lg px-3 py-2">
                            {currentDisplayName}
                          </p>
                          <button
                            onClick={() => setEditingName(true)}
                            className="px-3 py-2 bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit2 size={14} />
                            <span className="text-xs">Edit</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Email (read-only) */}
                    <div>
                      <label className="block text-xs font-mono text-stone-400 uppercase mb-2">
                        Email
                      </label>
                      <p className="text-sm font-mono text-stone-500 bg-stone-800/30 border border-stone-700 rounded-lg px-3 py-2">
                        {user.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl">
                    <div className="text-xs font-mono text-stone-500 uppercase mb-1">Clearance Level</div>
                    <div className="text-4xl font-display font-bold text-white mb-2">{profile.level}</div>
                    <div className="text-[10px] font-mono text-stone-600 mt-1">
                        Complete all nodes in an era to level up
                    </div>
                </div>
                
                <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl flex flex-col justify-center">
                    <div className="text-xs font-mono text-stone-500 uppercase mb-1">Cards Collected</div>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-display font-bold text-purple-400">{collectibleCards.length}</span>
                    </div>
                </div>
            </div>

            {/* XP Display */}
            <div className="bg-stone-900/50 border border-stone-800 p-4 rounded-xl">
                <div className="text-xs font-mono text-stone-500 uppercase mb-1">Total XP Earned</div>
                <div className="text-2xl font-display font-bold text-amber-400">{profile.xp} XP</div>
            </div>

            {/* Collectible Cards Collection */}
            {collectibleCards.length > 0 ? (
                <div>
                    <h3 className="text-sm font-display font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Sparkles size={16} className="text-cyan-500" /> 
                        Collectible Cards
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {collectibleCards.map(card => {
                            const imageUrl = getImageUrlWithFallback(card.imageUrl);
                            return (
                            <div key={card.id} className="bg-black border border-stone-800 rounded-lg p-3 group hover:border-purple-500/30 transition-colors">
                                <div className="aspect-square bg-stone-900 rounded mb-3 overflow-hidden relative">
                                    <img 
                                        src={imageUrl} 
                                        alt={card.name} 
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                                    />
                                    <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded text-[8px] font-mono uppercase text-purple-400 border border-purple-500/30">
                                        {card.type}
                                    </div>
                                </div>
                                <h4 className="text-stone-200 font-bold text-xs truncate font-display">{card.name}</h4>
                                {card.role && (
                                    <p className="text-[9px] text-stone-500 font-mono mt-0.5 truncate">{card.role}</p>
                                )}
                                {card.category && !card.role && (
                                    <p className="text-[9px] text-stone-500 font-mono mt-0.5 truncate">{card.category}</p>
                                )}
                                {card.location && (
                                    <p className="text-[9px] text-stone-500 font-mono mt-0.5 truncate">{card.location}</p>
                                )}
                            </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="border border-dashed border-stone-800 rounded-xl p-8 text-center text-stone-600">
                    <Sparkles size={24} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-mono">No cards collected yet. Complete quizzes to unlock collectible cards.</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
