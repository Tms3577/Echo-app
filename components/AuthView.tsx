
import React, { useState } from 'react';
import Logo from './Logo';

interface AuthViewProps {
  onSuccess: (username: string, password?: string, mode?: 'login' | 'signup') => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleAction = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    // Simulate a brief "initializing" delay for feel
    setTimeout(() => {
      onSuccess(formData.username, formData.password, mode);
      setIsVerifying(false);
    }, 800);
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

        <form onSubmit={handleAction} className="space-y-4">
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

          {mode === 'signup' && (
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
          )}
          
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
          
          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="w-full h-14 bg-[#00f2ff] text-black rounded-2xl font-black text-sm tracking-[0.2em] uppercase transition-all active:scale-95 shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isVerifying ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>INITIALIZING...</span>
                </>
              ) : (
                mode === 'login' ? 'INITIALIZE LINK' : 'CREATE NODE'
              )}
            </button>
            
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => alert("Access key recovery requires physical node access. Contact Syndicate support.")}
                className="text-[9px] text-zinc-700 font-bold uppercase tracking-widest hover:text-zinc-500 transition-colors py-1"
              >
                Forgot Access Key?
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
            className="w-full py-4 text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] hover:text-[#00f2ff] transition-all border border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/5 active:scale-95"
          >
            {mode === 'login' ? "Initialize New Node (Sign Up)" : "Return to Syndicate (Log In)"}
          </button>
        </form>

        <div className="pt-4 text-center">
          <p className="text-[9px] text-zinc-800 tracking-[0.5em] uppercase font-black">ENCRYPTED NODE • SYNDICATE PROTOCOL V4.2</p>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
