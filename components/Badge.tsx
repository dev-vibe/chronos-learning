import React from 'react';
import { Category } from '../types';

interface BadgeProps {
  label: string;
  type?: 'default' | 'category';
}

const getColor = (label: string) => {
  switch (label as Category) {
    case 'Military': return 'bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_10px_rgba(248,113,113,0.1)]';
    case 'Science': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]';
    case 'Art': return 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(192,132,252,0.1)]';
    case 'Politics': return 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-[0_0_10px_rgba(148,163,184,0.1)]';
    case 'Religion': return 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(251,191,36,0.1)]';
    case 'Philosophy': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(52,211,153,0.1)]';
    case 'Exploration': return 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(251,146,60,0.1)]';
    case 'Literature': return 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_10px_rgba(244,114,182,0.1)]';
    default: return 'bg-stone-800 text-stone-400 border-stone-700';
  }
};

export const Badge: React.FC<BadgeProps> = ({ label }) => {
  const colorClass = getColor(label);
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase tracking-wider border ${colorClass}`}>
      {label}
    </span>
  );
};