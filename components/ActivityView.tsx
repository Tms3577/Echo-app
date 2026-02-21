
import React from 'react';
import { Notification } from '../types';

interface ActivityViewProps {
  notifications: Notification[];
  onRead: (id: string) => void;
  onMarkAllRead: () => void;
  onUserClick?: (userId: string) => void;
}

const ActivityView: React.FC<ActivityViewProps> = ({ notifications, onRead, onMarkAllRead, onUserClick }) => {
  const getRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}M`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}H`;
    return `${Math.floor(hours / 24)}D`;
  };

  const getTypeMetadata = (type: Notification['type']) => {
    switch (type) {
      case 'pulse': return { color: 'bg-[#00f2ff]', icon: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /> };
      case 'resonate': return { color: 'bg-white', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /> };
      case 'follow': return { color: 'bg-indigo-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /> };
      default: return { color: 'bg-zinc-800', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /> };
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between mb-10 px-2">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white">System Logs</h2>
          <p className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.4em] opacity-60">Signal Intercepts</p>
        </div>
        <div className="flex gap-2 items-center">
           <button 
             onClick={onMarkAllRead}
             className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-[9px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors border border-white/5"
           >
             Mark All Read
           </button>
           <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
           <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Intercepting...</span>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.sort((a, b) => b.createdAt - a.createdAt).map((act) => {
          const meta = getTypeMetadata(act.type);
          return (
            <div 
              key={act.id} 
              className="relative group"
              onClick={() => onRead(act.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-r from-[#00f2ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none`} />
              <div className={`p-5 glass-card rounded-[2rem] flex flex-col gap-4 group hover:border-[#00f2ff]/30 transition-all cursor-pointer overflow-hidden ${act.isRead ? 'border-white/5 opacity-60' : 'border-[#00f2ff]/20'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className="relative cursor-pointer group/avatar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUserClick?.(act.senderId);
                      }}
                    >
                      <img src={act.senderAvatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10 grayscale-[0.3] group-hover/avatar:grayscale-0 group-hover/avatar:scale-105 transition-all" />
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#050505] shadow-xl ${meta.color}`}>
                        <svg className={`w-3 h-3 ${act.type === 'pulse' || act.type === 'resonate' ? 'text-black' : 'text-white'} fill-current`} viewBox="0 0 24 24">
                          {meta.icon}
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-black text-white group-hover:text-[#00f2ff] transition-colors">@{act.senderUsername}</span>{' '}
                        <span className="text-zinc-400 font-medium opacity-80">{act.text}</span>
                      </p>
                      <p className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                         {getRelativeTime(act.createdAt)} AGO 
                         <span className="w-1 h-1 rounded-full bg-zinc-800" />
                         ID: {act.id.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    {!act.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#00f2ff] shadow-[0_0_8px_#00f2ff] mb-2" />
                    )}
                    <span className="text-[8px] font-black text-zinc-700 tracking-[0.2em] uppercase">Security Verified</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {notifications.length === 0 && (
          <div className="py-20 text-center opacity-30">
            <p className="text-xs font-black uppercase tracking-[0.5em]">The void remains silent</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityView;
