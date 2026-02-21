
import React, { useState } from 'react';
import { User, FeedItem } from '../types';

interface ProfileViewProps {
  user: User;
  posts: FeedItem[];
  onTogglePrivacy?: (isPrivate: boolean) => void;
  onFollow?: (userId: string, isFollowing: boolean) => void;
  onOpenSettings?: () => void;
  onBack?: () => void;
  isOwnProfile?: boolean;
  isFollowing?: boolean;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  posts, 
  onTogglePrivacy, 
  onFollow, 
  onOpenSettings, 
  onBack, 
  isOwnProfile = true,
  isFollowing = false
}) => {
  const handleFollow = () => {
    const nextState = !isFollowing;
    if (onFollow) {
      onFollow(user.id, nextState);
    }
    if (window.navigator.vibrate) window.navigator.vibrate([10, 50]);
  };

  return (
    <div className="max-w-2xl mx-auto pt-6 pb-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Button for visited profiles */}
      {!isOwnProfile && onBack && (
        <div className="mb-8 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00f2ff] group-hover:text-black transition-all">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
               </svg>
            </div>
            Terminate Interrogation
          </button>
          <div className="flex gap-2">
            <span className="text-[8px] font-mono text-zinc-700">SECURE_LINK: ACTIVE</span>
            <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-8 mb-12 relative">
        {!isOwnProfile && (
          <div className="absolute -top-4 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
            <p className="text-[40px] font-black text-white uppercase tracking-[0.5em] whitespace-nowrap">INTERROGATION_MODE</p>
          </div>
        )}

        {/* Profile Header */}
        <div className="relative group w-full flex flex-col items-center">
          {isOwnProfile && (
            <div className="absolute top-0 right-2">
              <button 
                onClick={onOpenSettings}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all active:scale-90 text-zinc-500 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="relative">
            <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-50 ${isFollowing ? 'bg-[#00f2ff]/40' : 'bg-[#00f2ff]/10'}`} />
            <div className={`relative p-1.5 rounded-full shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all duration-700 ${isFollowing ? 'bg-gradient-to-tr from-[#00f2ff] to-[#4f46e5]' : 'bg-zinc-800'}`}>
              <img 
                src={user.avatar} 
                alt={user.username} 
                className="w-28 h-28 rounded-full object-cover border-4 border-[#050505] grayscale-[0.2] group-hover:grayscale-0 transition-all" 
              />
              {isFollowing && (
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-[#00f2ff] rounded-full border-4 border-[#050505] flex items-center justify-center animate-pulse">
                  <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tighter text-white">{user.displayName}</h2>
          <p className="text-[#00f2ff] text-sm font-bold tracking-[0.2em] uppercase opacity-80">@{user.username}</p>
          {!isOwnProfile && (
            <div className="flex justify-center gap-4 py-2">
              <span className="text-[8px] font-mono text-zinc-600">NODE_ID: {user.id.split('_')[1] || 'UNKNOWN'}</span>
              <span className="text-[8px] font-mono text-zinc-600">RESONANCE: {Math.floor(Math.random() * 100)}%</span>
            </div>
          )}
          <p className="text-zinc-400 text-sm max-w-xs mx-auto font-light leading-relaxed whitespace-pre-line">
            {user.bio || "Echoing through the void."}
          </p>
        </div>

        {/* User Stats */}
        <div className="flex gap-4 w-full px-2">
          <div className="flex-1 glass-card rounded-[1.5rem] p-4 text-center border-white/5 group hover:border-[#00f2ff]/20 transition-all">
            <p className="text-xl font-black text-white">{posts.length}</p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-black group-hover:text-zinc-400 transition-colors">Echoes</p>
          </div>
          <div className="flex-1 glass-card rounded-[1.5rem] p-4 text-center border-white/5 group hover:border-[#00f2ff]/20 transition-all">
            <p className="text-xl font-black text-white">{((user.followers + (isFollowing ? 1 : 0)) / 1000).toFixed(1)}K</p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-black group-hover:text-zinc-400 transition-colors">Followers</p>
          </div>
          <div className="flex-1 glass-card rounded-[1.5rem] p-4 text-center border-white/5 group hover:border-[#00f2ff]/20 transition-all">
            <p className="text-xl font-black text-white">{user.following}</p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.2em] font-black group-hover:text-zinc-400 transition-colors">Following</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="w-full space-y-3">
          <div className="flex gap-3">
             {!isOwnProfile ? (
               <button 
                 onClick={handleFollow}
                 className={`flex-1 h-14 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95 ${isFollowing ? 'bg-white/5 text-[#00f2ff] border border-[#00f2ff]/30' : 'bg-[#00f2ff] text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]'}`}
               >
                 {isFollowing ? 'UNFOLLOW NODE' : 'FOLLOW NODE'}
                 {isFollowing ? (
                   <div className="flex gap-0.5">
                     {[...Array(3)].map((_, i) => (
                       <div key={i} className="w-1 h-1 rounded-full bg-[#00f2ff] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                     ))}
                   </div>
                 ) : (
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                   </svg>
                 )}
               </button>
             ) : (
               <button 
                 onClick={onOpenSettings}
                 className="flex-1 h-14 bg-white/5 rounded-[2rem] font-black text-xs tracking-[0.3em] uppercase transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95 hover:bg-white/10"
               >
                 CONFIGURE NODE
               </button>
             )}
             
             <button className="w-14 h-14 flex items-center justify-center rounded-[2rem] bg-white/5 border border-white/10 text-zinc-400 hover:text-white transition-all active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
             </button>
          </div>
          
          {isOwnProfile && (
            <div className="flex items-center justify-between p-5 glass-card rounded-[2rem] border-white/5">
              <div className="flex items-center gap-4">
                 <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-all ${user.isPrivate ? 'bg-[#00f2ff]/10 border-[#00f2ff]/30 text-[#00f2ff]' : 'bg-white/5 border-white/5 text-zinc-600'}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white tracking-tight">Node Privacy</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Restricted Propagation</p>
                 </div>
              </div>
              <button 
                onClick={() => onTogglePrivacy && onTogglePrivacy(!user.isPrivate)}
                className={`w-14 h-7 rounded-full relative transition-all duration-500 ${user.isPrivate ? 'bg-[#00f2ff] shadow-[0_0_15px_rgba(0,242,255,0.4)]' : 'bg-zinc-800'}`}
              >
                <div className={`absolute top-1.5 w-4 h-4 rounded-full bg-black transition-all duration-500 ease-in-out ${user.isPrivate ? 'left-8' : 'left-2'}`} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 rounded-[2.5rem] overflow-hidden border border-white/5 bg-white/5 p-1">
        {posts.length > 0 ? posts.map((post) => (
          <div 
            key={post.id} 
            className="aspect-square relative group overflow-hidden bg-zinc-900 cursor-pointer rounded-[1.5rem]"
          >
            <img 
              src={post.media} 
              alt="" 
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1" 
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <div className="flex gap-4">
                  <div className="flex flex-col items-center gap-1">
                    <svg className="w-5 h-5 text-[#00f2ff]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="text-[10px] font-black text-white">{post.pulses}</span>
                  </div>
               </div>
            </div>
          </div>
        )) : (
          <div className="col-span-3 py-20 text-center opacity-30">
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">No transmissions archived</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
