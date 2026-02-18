
import React, { useState } from 'react';
import Logo from './Logo';

interface AuthViewProps {
  onSuccess: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [step, setStep] = useState<'form' | 'mfa'>('form');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('mfa');
  };

  const handleMFA = () => {
    setIsVerifying(true);
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-[#050505] flex items-center justify-center p-6 selection:bg-[#00f2ff]/30">
      <div className="w-full max-w-sm space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center space-y-3">
          <div className="mb-8 scale-110">
            <Logo size="lg" showText={false} />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-white">
            {mode === 'login' ? 'SYNC CORE' : 'JOIN SYNDICATE'}
          </h2>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.3em]">
            {mode === 'login' ? 'Obsidian Identity Protocol' : 'Initialize Personal Node'}
          </p>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleAction} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative group">
                <input
                  type="text"
                  placeholder="USERNAME"
                  required
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-[#00f2ff]/50 transition-all placeholder:text-zinc-800"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>
            )}
            <div className="relative group">
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                required
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-[#00f2ff]/50 transition-all placeholder:text-zinc-800"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <input
                type="password"
                placeholder="ACCESS KEY"
                required
                className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold tracking-widest focus:outline-none focus:border-[#00f2ff]/50 transition-all placeholder:text-zinc-800"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            
            <button
              type="submit"
              className="w-full h-14 bg-[#00f2ff] text-black rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)]"
            >
              {mode === 'login' ? 'INITIALIZE LINK' : 'CREATE NODE'}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="w-full py-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest hover:text-[#00f2ff] transition-colors"
            >
              {mode === 'login' ? "Don't have a node? Register" : "Already indexed? Sync back"}
            </button>
          </form>
        ) : (
          <div className="space-y-8 text-center animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="p-6 glass-card rounded-[2.5rem] border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f2ff] to-transparent animate-pulse" />
              <p className="text-[10px] text-zinc-400 uppercase tracking-[0.3em] mb-6 font-black">Biometric Resonance Required</p>
              
              <button
                onClick={handleMFA}
                disabled={isVerifying}
                className="relative w-28 h-28 rounded-full bg-white/5 border border-[#00f2ff]/20 flex items-center justify-center mx-auto group active:scale-90 transition-all hover:border-[#00f2ff]/50 shadow-inner"
              >
                {isVerifying ? (
                  <div className="absolute inset-0 rounded-full border-4 border-t-[#00f2ff] border-transparent animate-spin" />
                ) : (
                  <div className="absolute inset-2 rounded-full border border-[#00f2ff]/10 animate-pulse" />
                )}
                <svg className={`w-12 h-12 ${isVerifying ? 'text-zinc-800' : 'text-[#00f2ff]'} drop-shadow-[0_0_15px_#00f2ff] transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3c4.148 0 7.747 2.512 9.324 6.115M12 11V3m0 8c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21" />
                </svg>
              </button>
              
              <p className="mt-6 text-[11px] text-[#00f2ff] font-bold uppercase tracking-widest opacity-80">
                {isVerifying ? 'CALIBRATING...' : 'TOUCH TO RESONATE'}
              </p>
              <div className="mt-8 flex justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-800 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => setStep('form')}
              className="text-[10px] text-zinc-700 hover:text-white transition-colors uppercase tracking-widest font-black"
            >
              Cancel Link
            </button>
          </div>
        )}

        <div className="pt-4 text-center">
          <p className="text-[9px] text-zinc-800 tracking-[0.5em] uppercase font-black">ENCRYPTED NODE • SYNDICATE PROTOCOL V4.2</p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
