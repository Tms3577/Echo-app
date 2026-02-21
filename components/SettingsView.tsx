
import React, { useState, useRef } from 'react';
import { User } from '../types';
import { GoogleGenAI } from "@google/genai";

interface SettingsViewProps {
  user: User;
  onUpdate: (data: { username: string; displayName: string; bio: string; avatar: string }) => boolean;
  onLogout: () => void;
  onClose: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, onUpdate, onLogout, onClose }) => {
  const [bio, setBio] = useState(user.bio);
  const [username, setUsername] = useState(user.username);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [avatar, setAvatar] = useState(user.avatar);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setStatus('saving');
    setErrorMessage('');

    // Local validation and normalization
    const normalizedUsername = username.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    if (normalizedUsername.length < 3) {
      setStatus('error');
      setErrorMessage('Handle too short (min 3 chars)');
      return;
    }

    // Simulate network delay for effect and smoother UX
    setTimeout(() => {
      const success = onUpdate({ username: normalizedUsername, displayName, bio, avatar });
      
      if (success) {
        setStatus('success');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setStatus('error');
        setErrorMessage('Node handle already claimed');
      }
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Live normalization: lowercase, replace spaces with _, remove special chars
    const val = e.target.value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setUsername(val);
    if (status === 'error') setStatus('idle'); // Clear error on type
  };

  const generateAiAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `A high-fidelity, minimalist avatar for a user named "${displayName || username}". 
      Style: Cyberpunk, obsidian, neon cyan accents, glassmorphism. 
      Abstract, geometric, or silhouette. No text.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Image = `data:image/png;base64,${part.inlineData.data}`;
            setAvatar(base64Image);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Failed to generate avatar", error);
      setErrorMessage("AI Generation Failed");
      setStatus('error');
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  const generateAiBio = async () => {
    setIsGeneratingBio(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `Write a short, cryptic, high-tech bio (max 100 chars) for a user named "${displayName || username}". 
      Themes: Digital void, echo, signal, node, cyberpunk. 
      Avoid hashtags.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text?.trim().replace(/^"|"$/g, '');
      if (text) {
        setBio(text);
      }
    } catch (error) {
      console.error("Failed to generate bio", error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] bg-[#050505] animate-in slide-in-from-right duration-500 flex flex-col overflow-y-auto">
      <div className="max-w-md mx-auto w-full p-6 pt-12 space-y-10 pb-20">
        <div className="flex items-center justify-between sticky top-0 bg-[#050505]/90 backdrop-blur-xl py-4 z-10 border-b border-white/5 -mx-6 px-6">
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

        <div className="space-y-8">
          {/* Avatar Edit */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#00f2ff] to-[#4f46e5] shadow-[0_0_30px_rgba(0,242,255,0.2)] relative overflow-hidden">
                {isGeneratingAvatar ? (
                  <div className="absolute inset-0 bg-black flex items-center justify-center z-20">
                    <div className="w-8 h-8 border-2 border-t-transparent border-[#00f2ff] rounded-full animate-spin" />
                  </div>
                ) : (
                  <img 
                    src={avatar} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover border-4 border-[#050505]"
                  />
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest hover:text-white transition-colors"
              >
                Upload
              </button>
              <span className="text-zinc-700">|</span>
              <button 
                onClick={(e) => { e.stopPropagation(); generateAiAvatar(); }}
                disabled={isGeneratingAvatar}
                className="text-[10px] text-[#00f2ff] font-bold uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50"
              >
                {isGeneratingAvatar ? 'Synthesizing...' : 'Generate AI'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Node Handle (Login ID)</p>
                {status === 'error' && (
                  <p className="text-[10px] text-red-500 font-black uppercase tracking-widest animate-pulse">{errorMessage}</p>
                )}
              </div>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                className={`w-full h-14 bg-white/5 glass-card rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none transition-all placeholder:text-zinc-800 text-white ${status === 'error' ? 'border border-red-500/50 focus:border-red-500' : 'focus:ring-1 focus:ring-[#00f2ff]/30'}`}
                placeholder="USERNAME"
              />
              <p className="text-[8px] text-[#00f2ff] font-bold uppercase tracking-wide pl-2 opacity-80">
                 You will use <strong>{username || '...'}</strong> to log in next time.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Display Designation</p>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-14 bg-white/5 glass-card rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all placeholder:text-zinc-800 text-white"
                placeholder="DISPLAY NAME"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em]">Identity Description</p>
                <button 
                  onClick={generateAiBio}
                  disabled={isGeneratingBio}
                  className="text-[9px] text-[#00f2ff] font-bold uppercase tracking-widest hover:text-white transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {isGeneratingBio ? (
                    <span className="w-2 h-2 border border-t-transparent border-current rounded-full animate-spin" />
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  )}
                  AI Enhance
                </button>
              </div>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 glass-card rounded-2xl p-6 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f2ff]/30 transition-all min-h-[120px] placeholder:text-zinc-800 resize-none font-medium leading-relaxed text-white"
                placeholder="Echo your purpose..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={status === 'saving' || status === 'success'}
              className={`w-full h-14 rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all active:scale-95 shadow-lg flex items-center justify-center gap-3
                ${status === 'success' 
                  ? 'bg-green-500 text-black shadow-green-500/20' 
                  : status === 'error'
                    ? 'bg-red-500/10 border border-red-500 text-red-500 shadow-red-500/10'
                    : 'bg-[#00f2ff] text-black shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)]'
                }`}
            >
              {status === 'saving' ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"/>
                  <span>RECONFIGURING...</span>
                </>
              ) : status === 'success' ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>NODE UPDATED</span>
                </>
              ) : status === 'error' ? (
                 <span>RETRY UPDATE</span>
              ) : (
                'SAVE CHANGES'
              )}
            </button>
          </div>
        </div>

        <div className="pt-8 space-y-6">
           <div className="h-px bg-white/5 w-full" />
           <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.5em] text-center">Security & Session</p>
           
           <button
             onClick={onLogout}
             className="w-full h-14 border border-red-900/30 bg-red-900/5 text-red-500 rounded-2xl font-black text-[10px] tracking-[0.3em] uppercase transition-all active:scale-95 hover:bg-red-900/10"
           >
             TERMINATE SESSION
           </button>
        </div>

        <div className="text-center pt-4">
          <p className="text-[8px] text-zinc-800 font-black uppercase tracking-[0.6em]">BUILD 4.2.0 • CORE SECURE</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
