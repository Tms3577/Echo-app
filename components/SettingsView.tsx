
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsViewProps {
  user: User;
  onUpdate: (bio: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate, onLogout, onClose }) => {
  const [bio, setBio] = useState(user.bio);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(bio);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[#050505] animate-in slide-in-from-right duration-500 flex flex-col p-6 pt-12">
      <div className="max-w-md mx-auto w-full space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black tracking-tighter text-white">System Config</h2>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white active:scale-90 transition-transform"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Identity Description</p>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full bg-white/5 glass-card rounded-2xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all min-h-[120px] placeholder:text-zinc-800 resize-none font-medium leading-relaxed text-white"
              placeholder="Echo your purpose..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full h-14 bg-[#00f2ff] text-black rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.3)] flex items-center justify-center"
          >
            {isSaving ? 'UPDATING NODE...' : 'SAVE CHANGES'}
          </button>
        </div>

        <div className="pt-12 space-y-6">
           <div className="h-px bg-white/5 w-full" />
           <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] text-center">Security & Session</p>
           
           <button
             onClick={onLogout}
             className="w-full h-14 border border-red-900/30 bg-red-900/5 text-red-500 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95 hover:bg-red-900/10"
           >
             TERMINATE SESSION
           </button>
        </div>

        <div className="text-center pt-8">
          <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.6em]">BUILD 4.2.0 • CORE SECURE</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
