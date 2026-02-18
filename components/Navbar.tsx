
import React from 'react';
import { NavTab } from '../types';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange, unreadCount = 0 }) => {
  const tabs: { id: NavTab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', label: 'Feed', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> },
    { id: 'explore', label: 'Echo', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> },
    { id: 'upload', label: 'Sync', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /> },
    { id: 'activity', label: 'Pulse', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /> },
    { id: 'profile', label: 'Node', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /> }
  ];

  const handleTabClick = (id: NavTab) => {
    if (window.navigator.vibrate) window.navigator.vibrate(10);
    onTabChange(id);
  };

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] px-1">
      <div className="bg-[#0a0a0a]/40 backdrop-blur-[32px] rounded-[2.5rem] p-2 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 ring-1 ring-white/5 relative overflow-hidden">
        {/* Active Tab Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
        
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`relative flex-1 flex flex-col items-center justify-center py-3 rounded-[2rem] transition-all duration-500 active:scale-75 group ${activeTab === tab.id ? 'text-[#00f2ff]' : 'text-zinc-600 hover:text-zinc-300'}`}
          >
            <div className={`transition-all duration-500 ${activeTab === tab.id ? 'mb-1' : 'mb-0'} relative`}>
              <svg 
                className={`w-6 h-6 transition-all duration-500 transform ${activeTab === tab.id ? 'scale-110 drop-shadow-[0_0_12px_rgba(0,242,255,0.6)]' : 'group-hover:scale-105 group-active:scale-90'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {tab.icon}
              </svg>
              {tab.id === 'activity' && unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#00f2ff] rounded-full shadow-[0_0_8px_#00f2ff]" />
              )}
            </div>
            
            <span className={`text-[7px] font-black uppercase tracking-[0.3em] transition-all duration-500 overflow-hidden whitespace-nowrap ${activeTab === tab.id ? 'max-h-4 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
              {tab.label}
            </span>

            {activeTab === tab.id && (
              <div className="absolute -bottom-1 w-1 h-1 bg-[#00f2ff] rounded-full shadow-[0_0_10px_#00f2ff] animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
