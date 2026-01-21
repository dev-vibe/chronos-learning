/**
 * Migration Dialog Component
 * Prompts user to migrate local data to cloud on first login
 */

import React, { useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { LocalStorageService } from '../services/localStorage';
import { Database, Upload, Trash2, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export const MigrationDialog: React.FC = () => {
  const { showMigrationDialog, setShowMigrationDialog, migrateLocalData, refreshProfile } = useUserProfile();
  const [migrating, setMigrating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showMigrationDialog) return null;

  const localProfile = LocalStorageService.getProfileForMigration();
  if (!localProfile) {
    setShowMigrationDialog(false);
    return null;
  }

  const handleImport = async () => {
    setMigrating(true);
    setError(null);

    try {
      const success = await migrateLocalData();
      if (success) {
        setShowMigrationDialog(false);
      } else {
        setError('Failed to migrate data. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred during migration.');
    } finally {
      setMigrating(false);
    }
  };

  const handleStartFresh = async () => {
    setMigrating(true);

    try {
      // Clear local data and mark migration as complete
      LocalStorageService.clearProfile();
      LocalStorageService.setMigrationCompleted();

      // Refresh from cloud
      await refreshProfile();

      setShowMigrationDialog(false);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setMigrating(false);
    }
  };

  const handleKeepLocal = () => {
    // Mark migration as complete without uploading
    LocalStorageService.setMigrationCompleted();
    setShowMigrationDialog(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0c0c0e] w-full max-w-xl rounded-2xl border border-amber-500/50 shadow-2xl overflow-hidden relative">

        {/* Header */}
        <div className="p-6 border-b border-amber-500/30 bg-amber-950/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 text-amber-500 rounded-lg flex items-center justify-center">
              <Database size={24} />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">
                Local Progress Detected
              </h2>
              <p className="text-xs font-mono text-amber-400/70 uppercase">Data Migration Required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-stone-300 text-sm">
            We found existing progress on this device. How would you like to proceed?
          </p>

          {/* Current Progress Stats */}
          <div className="bg-stone-900/50 border border-stone-700 rounded-lg p-4">
            <h3 className="text-xs font-mono text-stone-400 uppercase mb-3">Your Local Progress</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-display font-bold text-amber-400">{localProfile.level}</div>
                <div className="text-xs text-stone-500 uppercase">Level</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-emerald-400">{localProfile.artifacts.length}</div>
                <div className="text-xs text-stone-500 uppercase">Artifacts</div>
              </div>
              <div>
                <div className="text-2xl font-display font-bold text-blue-400">{localProfile.nodesCompleted.length}</div>
                <div className="text-xs text-stone-500 uppercase">Completed</div>
              </div>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-950/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Options */}
          <div className="space-y-3">
            {/* Import to Cloud */}
            <button
              onClick={handleImport}
              disabled={migrating}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-display font-bold py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {migrating ? (
                <>
                  <Loader size={20} className="animate-spin" />
                  <span className="uppercase tracking-wider">Migrating...</span>
                </>
              ) : (
                <>
                  <Upload size={20} className="group-hover:translate-y-[-2px] transition-transform" />
                  <div className="text-left">
                    <div className="uppercase tracking-wider">Import to Cloud</div>
                    <div className="text-xs font-normal opacity-80">Sync your progress to this account</div>
                  </div>
                </>
              )}
            </button>

            {/* Start Fresh */}
            <button
              onClick={handleStartFresh}
              disabled={migrating}
              className="w-full bg-stone-800 hover:bg-stone-700 text-white font-medium py-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              <Trash2 size={20} />
              <div className="text-left">
                <div className="font-display uppercase tracking-wider">Start Fresh</div>
                <div className="text-xs opacity-70">Clear local data and use cloud progress</div>
              </div>
            </button>

            {/* Keep Local Only */}
            <button
              onClick={handleKeepLocal}
              disabled={migrating}
              className="w-full bg-stone-900/50 hover:bg-stone-800/50 border border-stone-700 text-stone-300 hover:text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              <span>Keep Local Only (No Sync)</span>
            </button>
          </div>

          {/* Note */}
          <p className="text-xs text-stone-600 text-center">
            If you have cloud progress, importing will merge both datasets (keeping the maximum XP and combining artifacts).
          </p>
        </div>
      </div>
    </div>
  );
};
