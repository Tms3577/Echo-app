
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Conversation, User } from '../types';
import { MOCK_USER } from '../constants';

interface DirectEchoProps {
  onClose: () => void;
}

// Data cleared as per user request to remove bots and fake history
const MOCK_INBOX_DATA: Conversation[] = [];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {};

const DirectEcho: React.FC<DirectEchoProps> = ({ onClose }) => {
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_INBOX_DATA);
  const [messagesMap, setMessagesMap] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesMap, activeConvId, isTyping]);

  const handleSend = () => {
    if (!currentText.trim() || !activeConvId) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: activeConvId,
      sender_id: MOCK_USER.id,
      message_text: currentText,
      created_at: Date.now(),
      is_read: false
    };

    setMessagesMap(prev => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMessage]
    }));

    setConversations(prev => prev.map(c => 
      c.id === activeConvId 
        ? { ...c, last_message: currentText, last_message_time: Date.now(), is_read: true }
        : c
    ));

    setCurrentText('');

    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const selectConversation = (id: string) => {
    setActiveConvId(id);
    setConversations(prev => prev.map(c => c.id === id ? { ...c, is_read: true } : c));
    if (window.navigator.vibrate) window.navigator.vibrate(5);
  };

  const getPartner = (conv: Conversation) => {
    return conv.participants.find(p => p.id !== MOCK_USER.id) || conv.participants[0];
  };

  const renderInbox = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-500 bg-[#050505]">
      <div className="p-8 flex justify-between items-center border-b border-white/5 bg-[#050505]/60 backdrop-blur-xl z-10">
        <div>
          <h2 className="text-3xl font-black tracking-tighter text-white">Echoes</h2>
          <p className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.4em] opacity-60">Secure Transmissions</p>
        </div>
        <button 
          onClick={onClose}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all active:scale-90 text-zinc-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            const partner = getPartner(conv);
            return (
              <button 
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className={`w-full p-5 rounded-[2.5rem] flex items-center gap-4 text-left border transition-all active:scale-[0.98] group relative overflow-hidden ${
                  !conv.is_read ? 'bg-white/5 border-[#00f2ff]/30 shadow-[0_0_20px_rgba(0,242,255,0.05)]' : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                }`}
              >
                {!conv.is_read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#00f2ff] shadow-[0_0_15px_#00f2ff]" />
                )}
                <div className="relative">
                  <img src={partner.avatar} alt="" className={`w-14 h-14 rounded-2xl object-cover border border-white/10 transition-all ${!conv.is_read ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`} />
                  {!conv.is_read && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#00f2ff] rounded-full border-[3px] border-[#050505] shadow-[0_0_10px_#00f2ff] animate-pulse" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black text-white group-hover:text-[#00f2ff] transition-colors">@{partner.username}</span>
                    <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                      {conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className={`text-xs truncate font-medium ${!conv.is_read ? 'text-zinc-200' : 'text-zinc-500'}`}>
                    {conv.last_message || 'Initializing stream...'}
                  </p>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center pt-20 opacity-30 px-10 text-center">
            <svg className="w-12 h-12 mb-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] leading-relaxed">No signals intercepted in the current sector</p>
          </div>
        )}
      </div>
    </div>
  );

  const activeMessages = activeConvId ? messagesMap[activeConvId] || [] : [];
  const activePartner = activeConvId ? getPartner(conversations.find(c => c.id === activeConvId)!) : null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#050505] animate-in slide-in-from-bottom duration-500 flex items-center justify-center lg:p-10">
      <div className="flex flex-col h-full lg:h-[90vh] w-full max-w-2xl bg-[#050505] border-x border-white/5 relative shadow-2xl overflow-hidden rounded-none lg:rounded-[48px] lg:border">
        
        {!activeConvId ? (
          <div className="h-full relative">
            {renderInbox()}
          </div>
        ) : (
          <div className="flex flex-col h-full animate-in slide-in-from-right duration-500 bg-[radial-gradient(circle_at_50%_100%,rgba(0,242,255,0.03),transparent_50%)]">
            {/* Thread Header */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-[#050505]/60 backdrop-blur-2xl z-20">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveConvId(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-zinc-400 hover:text-white transition-all active:scale-90 border border-white/5">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={activePartner?.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover border border-white/10 shadow-lg" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00f2ff] rounded-full border-[3px] border-[#050505] shadow-[0_0_10px_#00f2ff]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black tracking-tight text-white">{activePartner?.displayName}</h3>
                    <p className="text-[10px] text-[#00f2ff] font-black uppercase tracking-[0.2em] opacity-80">Link Verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message Feed */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_id === MOCK_USER.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-[13px] leading-relaxed shadow-xl ${
                    msg.sender_id === MOCK_USER.id 
                    ? 'bg-[#00f2ff] text-black font-bold rounded-tr-none shadow-[0_15px_30px_rgba(0,242,255,0.15)]' 
                    : 'bg-white/5 border border-white/10 text-zinc-100 rounded-tl-none backdrop-blur-md'
                  }`}>
                    {msg.message_text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-6 border-t border-white/5 bg-[#050505]/90 backdrop-blur-3xl">
              <div className="flex items-center gap-4 bg-white/5 rounded-[2.5rem] p-2 border border-white/10 group focus-within:border-[#00f2ff]/30 transition-all shadow-inner">
                <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white transition-all active:scale-90">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <div className="flex-1">
                  <input 
                    type="text"
                    value={currentText}
                    onChange={(e) => setCurrentText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Echo your transmission..."
                    className="w-full bg-transparent text-white text-sm focus:outline-none placeholder:text-zinc-700 font-medium px-2"
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!currentText.trim()}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-[0.85] shadow-2xl ${
                    currentText.trim() 
                    ? 'bg-[#00f2ff] text-black shadow-[0_0_20px_rgba(0,242,255,0.4)]' 
                    : 'bg-zinc-900 text-zinc-800'
                  }`}
                >
                  <svg className="w-5 h-5 transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DirectEcho;
