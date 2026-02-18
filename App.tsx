
import React, { useState, useEffect, useRef } from 'react';
import { NavTab, User, FeedItem, Wave, Notification } from './types';
import WaveBar from './components/WaveBar';
import Navbar from './components/Navbar';
import PulseFeed from './components/PulseFeed';
import EchoSearch from './components/EchoSearch';
import ProfileView from './components/ProfileView';
import DirectEcho from './components/DirectEcho';
import AuthView from './components/AuthView';
import ActivityView from './components/ActivityView';
import UploadView from './components/UploadView';
import WaveViewer from './components/WaveViewer';
import SettingsView from './components/SettingsView';
import Logo from './components/Logo';
import { MOCK_USER, MOCK_FEED, MOCK_WAVES } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [user, setUser] = useState<User>(MOCK_USER);
  const [feed, setFeed] = useState<FeedItem[]>(MOCK_FEED);
  const [waves] = useState<Wave[]>(MOCK_WAVES);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWave, setActiveWave] = useState<Wave | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('echo_token');
    if (saved) setIsLoggedIn(true);
  }, []);

  // Infinite Scroll Simulation
  useEffect(() => {
    if (activeTab !== 'home' || feed.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore) {
        loadMoreContent();
      }
    }, { threshold: 0.1 });

    if (scrollEndRef.current) observer.observe(scrollEndRef.current);
    return () => observer.disconnect();
  }, [activeTab, isLoadingMore, feed.length]);

  const createNotification = (recipientId: string, type: Notification['type'], postId?: string, customText?: string) => {
    if (recipientId === user.id) return;

    const newNotif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      recipientId,
      senderId: user.id,
      senderUsername: user.username,
      senderAvatar: user.avatar,
      type,
      postId,
      isRead: false,
      createdAt: Date.now(),
      text: customText || (type === 'pulse' ? 'pulsed your echo' : type === 'resonate' ? 'resonated your transmission' : 'established a node link')
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const loadMoreContent = () => {
    if (feed.length === 0) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      const moreItems: FeedItem[] = MOCK_FEED.map(item => ({
        ...item,
        id: `more-${item.id}-${Date.now()}`,
        pulses: Math.floor(Math.random() * 5000),
      }));
      setFeed(prev => [...prev, ...moreItems]);
      setIsLoadingMore(false);
    }, 1500);
  };

  const handlePulse = (id: string) => {
    const targetItem = feed.find(f => f.id === id);
    if (!targetItem) return;

    const isNewPulse = !targetItem.hasPulsed;

    setFeed(prev => prev.map(item => 
      item.id === id 
        ? { ...item, pulses: item.hasPulsed ? item.pulses - 1 : item.pulses + 1, hasPulsed: !item.hasPulsed }
        : item
    ));

    if (isNewPulse) {
      createNotification(targetItem.userId, 'pulse', targetItem.id);
    }

    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  const handleResonate = (id: string) => {
    const itemToResonate = feed.find(item => item.id === id);
    if (itemToResonate && !itemToResonate.hasResonated) {
      const newResonation: FeedItem = {
        ...itemToResonate,
        id: `res-${Date.now()}`,
        username: user.username,
        avatar: user.avatar,
        originalCreator: itemToResonate.username,
        timestamp: 'Just now',
        hasResonated: true,
        resonations: itemToResonate.resonations + 1
      };
      
      setFeed(prev => [
        newResonation,
        ...prev.map(item => item.id === id ? { ...item, resonations: item.resonations + 1, hasResonated: true } : item)
      ]);

      createNotification(itemToResonate.userId, 'resonate', itemToResonate.id);

      if (window.navigator.vibrate) window.navigator.vibrate([10, 30, 10]);
    }
  };

  const handleNewPost = (caption: string, media: string) => {
    const newPost: FeedItem = {
      id: `post-${Date.now()}`,
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
      media: media,
      caption: caption,
      pulses: 0,
      resonations: 0,
      hasPulsed: false,
      hasResonated: false,
      timestamp: 'Just now'
    };
    setFeed(prev => [newPost, ...prev]);
    setActiveTab('home');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleLogout = () => {
    localStorage.removeItem('echo_token');
    setIsLoggedIn(false);
    setIsSettingsOpen(false);
    setActiveTab('home');
    setFeed([]); // Clear session feed
    setNotifications([]);
  };

  const handleUpdateProfile = (bio: string) => {
    setUser(prev => ({ ...prev, bio }));
  };

  const handleAuthSuccess = () => {
    const mockToken = `echo_jwt_${Math.random().toString(36).substr(2)}`;
    localStorage.setItem('echo_token', mockToken);
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <AuthView onSuccess={handleAuthSuccess} />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="max-w-2xl mx-auto pt-4 pb-24 px-4 animate-in fade-in duration-500">
            <WaveBar waves={waves} onWaveClick={setActiveWave} />
            {feed.length > 0 ? (
              <PulseFeed items={feed} onPulse={handlePulse} onResonate={handleResonate} />
            ) : (
              <div className="flex flex-col items-center justify-center py-40 opacity-20 text-center space-y-4">
                <Logo size="md" showText={false} />
                <p className="text-xs font-black uppercase tracking-[0.5em]">The void is empty</p>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-2 border border-white/20 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Initiate First Transmission
                </button>
              </div>
            )}
            <div ref={scrollEndRef} className="h-20 flex justify-center items-center">
              {isLoadingMore && (
                 <div className="w-6 h-6 border-2 border-t-transparent border-[#00f2ff] rounded-full animate-spin" />
              )}
            </div>
          </div>
        );
      case 'explore':
        return (
          <div className="max-w-2xl mx-auto pt-4 pb-24 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <EchoSearch />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {feed.length > 0 ? feed.slice(0, 10).map((item, idx) => (
                <div key={`explore-${idx}`} className="aspect-square bg-white/5 rounded-2xl overflow-hidden glass-card group cursor-pointer relative">
                  <img src={item.media} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
              )) : (
                <div className="col-span-2 py-40 text-center opacity-20">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em]">No indexed transmissions found</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'upload':
        return <UploadView onUploadComplete={handleNewPost} />;
      case 'activity':
        return <ActivityView notifications={notifications} onRead={markNotificationAsRead} />;
      case 'profile':
        return (
          <ProfileView 
            user={user} 
            posts={feed.filter(f => f.username === user.username)} 
            onTogglePrivacy={(isPrivate) => setUser(prev => ({ ...prev, isPrivate }))}
            onFollow={(targetUserId) => createNotification(targetUserId, 'follow')}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-safe selection:bg-[#00f2ff]/30">
      <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setActiveTab('home')}
        >
           <Logo size="sm" showText={true} />
        </div>
        <button 
          onClick={() => setIsMessagingOpen(true)}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all relative group active:scale-90"
        >
          <svg className="w-6 h-6 text-zinc-400 group-hover:text-[#00f2ff] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {notifications.some(n => n.type === 'mention' && !n.isRead) && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00f2ff] rounded-full border-2 border-[#050505] shadow-[0_0_5px_#00f2ff]" />
          )}
        </button>
      </header>

      <main>
        {renderContent()}
      </main>

      <Navbar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />

      {isMessagingOpen && (
        <DirectEcho onClose={() => setIsMessagingOpen(false)} />
      )}

      {isSettingsOpen && (
        <SettingsView 
          user={user} 
          onUpdate={handleUpdateProfile} 
          onLogout={handleLogout} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}

      {activeWave && (
        <WaveViewer wave={activeWave} onClose={() => setActiveWave(null)} />
      )}
    </div>
  );
};

export default App;
