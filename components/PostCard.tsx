import React, { useState } from 'react';
import { FeedItem, User, Comment } from '../types';
import PulseButton from './PulseButton';

interface PostCardProps {
  item: FeedItem;
  currentUser: User;
  onPulse: (id: string) => void;
  onResonate: (id: string) => void;
  onUserClick?: (userId: string) => void;
  onEditCaption: (id: string, newCaption: string) => void;
  onAddComment: (id: string, commentText: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ item, currentUser, onPulse, onResonate, onUserClick, onEditCaption, onAddComment }) => {
  const [rippling, setRippling] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editedCaption, setEditedCaption] = useState(item.caption);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handlePulseClick = () => {
    setRippling(true);
    onPulse(item.id);
    setTimeout(() => setRippling(false), 1000);
    if (window.navigator.vibrate) window.navigator.vibrate(20);
  };

  const handleResonateClick = () => {
    onResonate(item.id);
    if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 10]);
  };

  const handleSaveCaption = () => {
    onEditCaption(item.id, editedCaption);
    setIsEditingCaption(false);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(item.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Echo from ${item.username}`,
          text: item.caption,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard");
    }
  };

  const handleReport = () => {
    setShowMenu(false);
    const reason = window.prompt("Identify the anomaly (Reason for report):");
    if (reason) {
      console.log(`Reported post ${item.id} for reason: ${reason}`);
      alert("Anomaly logged. System review initiated.");
    }
  };

  const isOwner = currentUser.id === item.userId;

  return (
    <div className={`glass-card rounded-[2.5rem] group border-white/5 hover:border-[#00f2ff]/20 transition-all duration-700 shadow-2xl bg-[#050505]/40 animate-in fade-in slide-in-from-bottom-6 duration-700 ${showMenu ? 'z-40 relative' : 'z-0 relative'}`}>
      {/* Header: User Info */}
      <div className="p-6 flex items-center justify-between bg-[#050505]/20 backdrop-blur-md rounded-t-[2.5rem]">
        <div 
          className="flex items-center gap-4 cursor-pointer group/user"
          onClick={() => onUserClick?.(item.userId)}
        >
          <div className="relative p-[2px] rounded-full bg-gradient-to-tr from-[#00f2ff] to-transparent ring-1 ring-[#00f2ff]/10 group-hover/user:shadow-[0_0_15px_rgba(0,242,255,0.3)] transition-all">
            <img 
              src={item.avatar} 
              alt={item.username} 
              className="w-11 h-11 rounded-full border-2 border-[#050505] object-cover group-hover/user:scale-105 transition-transform" 
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-white group-hover/user:text-[#00f2ff] transition-colors">{item.username}</span>
              {item.originalCreator && (
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f2ff]/10 border border-[#00f2ff]/20">
                  <svg className="w-2.5 h-2.5 text-[#00f2ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                  <span className="text-[9px] text-[#00f2ff] font-black uppercase tracking-tighter">Resonated</span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase opacity-70">{item.timestamp}</p>
          </div>
        </div>
        <div className="relative z-40">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 hover:text-white transition-all text-zinc-600 active:scale-90"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>
          
          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 top-12 w-40 bg-[#050505] border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {isOwner && (
                  <button 
                    onClick={() => {
                      setIsEditingCaption(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-zinc-300 hover:bg-white/5 transition-colors border-b border-white/5"
                  >
                    Edit Caption
                  </button>
                )}
                <button 
                  onClick={handleReport}
                  className="w-full px-4 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-red-500 hover:bg-white/5 transition-colors"
                >
                  Report Signal
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content: The Echo Media */}
      <div 
        className="relative aspect-square overflow-hidden bg-zinc-900 group/media cursor-pointer"
        onDoubleClick={handlePulseClick}
      >
        <img 
          src={item.media} 
          alt="" 
          className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-1000 ease-out" 
          loading="lazy"
        />
        
        {/* Large Heart Ripple on Pulse */}
        {rippling && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-in fade-in zoom-in duration-300">
            <div className="absolute w-40 h-40 bg-[#00f2ff]/20 rounded-full animate-ping blur-3xl" />
            <svg className="w-24 h-24 text-[#00f2ff] drop-shadow-[0_0_35px_#00f2ff] animate-pulse" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        )}
        
        {item.originalCreator && (
          <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-[10px] text-zinc-300 font-black uppercase tracking-[0.2em] shadow-2xl">
            Via @{item.originalCreator}
          </div>
        )}
      </div>

      {/* Action Bar: Pulse & Resonate */}
      <div className="px-8 py-6 flex flex-col gap-5 bg-[#050505]/40 backdrop-blur-md border-t border-white/5 rounded-b-[2.5rem]">
        <div className="flex items-center gap-10">
          <PulseButton 
            active={item.hasPulsed} 
            onClick={handlePulseClick} 
            count={item.pulses} 
          />
          
          <div className="flex flex-col items-center gap-1.5">
            <button 
              onClick={handleResonateClick}
              className={`w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white/5 border border-white/5 transition-all active:scale-75 group ${item.hasResonated ? 'text-[#00f2ff] border-[#00f2ff]/40 shadow-[0_0_20px_rgba(0,242,255,0.25)] bg-[#00f2ff]/5' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
            >
              <svg className={`w-6 h-6 transition-all duration-700 ${item.hasResonated ? 'rotate-[360deg] scale-110' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
            <span className={`text-[10px] font-black tracking-widest ${item.hasResonated ? 'text-[#00f2ff]' : 'text-zinc-600'}`}>
              {item.resonations.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button 
              onClick={handleShare}
              className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white/5 border border-white/5 text-zinc-500 hover:text-white hover:bg-white/10 active:scale-75 transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
            <span className="text-[10px] text-zinc-600 font-black tracking-widest uppercase">Share</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <button 
              onClick={() => setShowComments(!showComments)}
              className={`w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-white/5 border border-white/5 transition-all active:scale-75 ${showComments ? 'text-[#00f2ff] border-[#00f2ff]/40 bg-[#00f2ff]/5' : 'text-zinc-500 hover:text-white hover:bg-white/10'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>
            <span className={`text-[10px] font-black tracking-widest uppercase ${showComments ? 'text-[#00f2ff]' : 'text-zinc-600'}`}>
              {item.comments?.length || 0}
            </span>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-3">
          {isEditingCaption ? (
            <div className="flex flex-col gap-2">
              <textarea
                className="w-full bg-white/5 border border-[#00f2ff]/30 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00f2ff] transition-all resize-none"
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                rows={3}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button 
                  onClick={() => setIsEditingCaption(false)}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCaption}
                  className="px-4 py-2 bg-[#00f2ff] text-black rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(0,242,255,0.3)]"
                >
                  Save Echo
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-zinc-200">
              <span className="font-black mr-2 text-white">{item.username}</span>
              <span className="font-light opacity-90">{item.caption}</span>
            </p>
          )}
          <button className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity active:scale-95 text-left flex items-center gap-2 group/chain">
            View Resonance Chain
            <svg className="w-3 h-3 group-hover/chain:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-6 border-t border-white/5 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {item.comments && item.comments.length > 0 ? (
                item.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group/comment">
                    <img 
                      src={comment.avatar} 
                      alt={comment.username} 
                      className="w-8 h-8 rounded-full object-cover border border-white/10" 
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-white">{comment.username}</span>
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">{comment.timestamp}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em] text-center py-4">No resonance signals detected</p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.username} 
                className="w-10 h-10 rounded-full object-cover border border-[#00f2ff]/20" 
              />
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  placeholder="Inject signal..."
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-xs text-white focus:outline-none focus:border-[#00f2ff]/50 transition-all placeholder:text-zinc-700"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newComment.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#00f2ff] disabled:text-zinc-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
