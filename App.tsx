
import React, { useState, useEffect, useRef } from 'react';
import { NavTab, User, FeedItem, Wave, Notification, Comment } from './types';
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
  const [waves, setWaves] = useState<Wave[]>(MOCK_WAVES);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeWave, setActiveWave] = useState<Wave | null>(null);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [messagingTarget, setMessagingTarget] = useState<User | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewingProfile, setViewingProfile] = useState<User | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  
  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('echo_token');
    const savedUser = localStorage.getItem('echo_user');
    
    if (savedToken) {
      setIsLoggedIn(true);
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (e) {
          console.error("Failed to load user data");
        }
      }
    }
  }, []);

  // Infinite Scroll Simulation
  useEffect(() => {
    if (activeTab !== 'home' || feed.length === 0 || viewingProfile) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isLoadingMore) {
        loadMoreContent();
      }
    }, { threshold: 0.1 });

    if (scrollEndRef.current) observer.observe(scrollEndRef.current);
    return () => observer.disconnect();
  }, [activeTab, isLoadingMore, feed.length, viewingProfile]);

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

  const handleEditCaption = (id: string, newCaption: string) => {
    setFeed(prev => prev.map(item => 
      item.id === id ? { ...item, caption: newCaption } : item
    ));
  };

  const handleAddComment = (id: string, commentText: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      text: commentText,
      timestamp: 'Just now'
    };

    setFeed(prev => prev.map(item => 
      item.id === id ? { ...item, comments: [...(item.comments || []), newComment] } : item
    ));

    const targetItem = feed.find(f => f.id === id);
    if (targetItem) {
      createNotification(targetItem.userId, 'mention', id, `commented on your echo: "${commentText.substring(0, 20)}..."`);
    }
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

  const handleWaveClick = (wave: Wave) => {
    setActiveWave(wave);
    setWaves(prev => prev.map(w => w.id === wave.id ? { ...w, hasSeen: true } : w));
  };

  const handleAddWave = (media: string) => {
    const newWave: Wave = {
      id: `wave-${Date.now()}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      media: media,
      timestamp: Date.now(),
      viewers: [],
      hasSeen: false
    };
    setWaves(prev => [newWave, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleLogout = () => {
    localStorage.removeItem('echo_token');
    localStorage.removeItem('echo_user');
    setIsLoggedIn(false);
    setIsSettingsOpen(false);
    setActiveTab('home');
    setFeed([]); 
    setNotifications([]);
    setWaves([]);
    setUser(MOCK_USER);
  };

  const handleUpdateProfile = (data: { username: string; displayName: string; bio: string; avatar: string }) => {
    const normalizedUsername = data.username.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Update Persistent DB Storage (Critical for cross-session persistence)
    const storedUsers = localStorage.getItem('echo_db_users');
    let usersDb: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check for username collision (ensure we don't match our own ID)
    const isTaken = usersDb.some(u => u.username === normalizedUsername && u.id !== user.id);
    if (isTaken) {
      return false; // Return failure
    }

    // Create new user object with existing ID
    const updatedUser = { 
      ...user, 
      ...data,
      username: normalizedUsername
    };
    
    // Update State
    setUser(updatedUser);
    
    // Update Session Storage
    localStorage.setItem('echo_user', JSON.stringify(updatedUser));
    
    // Sync changes to Feed and Waves so old posts reflect new identity
    setFeed(prev => prev.map(item => 
      item.userId === user.id 
        ? { ...item, username: normalizedUsername, displayName: data.displayName, avatar: data.avatar } 
        : item
    ));

    setWaves(prev => prev.map(wave => 
      wave.userId === user.id 
        ? { ...wave, username: normalizedUsername, avatar: data.avatar }
        : wave
    ));
    
    // Save to DB
    const existingIndex = usersDb.findIndex(u => u.id === user.id);
    if (existingIndex >= 0) {
      usersDb[existingIndex] = updatedUser;
    } else {
      usersDb.push(updatedUser);
    }
    localStorage.setItem('echo_db_users', JSON.stringify(usersDb));
    
    return true; // Return success
  };

  const handleProfileLookup = (targetUser: User) => {
    if (targetUser.id === user.id) {
      setActiveTab('profile');
      setViewingProfile(null);
      return;
    }

    setIsScanning(true);
    if (window.navigator.vibrate) window.navigator.vibrate([20, 10, 20]);
    
    // Simulate immersive scan
    setTimeout(() => {
      setViewingProfile(targetUser);
      setIsScanning(false);
    }, 1200);
  };

  const handleFollowNode = (targetUserId: string, isFollowing: boolean) => {
    setFollowingIds(prev => {
      const next = new Set(prev);
      if (isFollowing) {
        next.add(targetUserId);
        createNotification(targetUserId, 'follow');
      } else {
        next.delete(targetUserId);
      }
      return next;
    });
  };

  const handleProfileLookupById = (userId: string) => {
    const targetUser = getUniqueUsers().find(u => u.id === userId);
    if (targetUser) {
      handleProfileLookup(targetUser);
    }
  };

  const handleAuthSuccess = (username: string, password?: string, mode?: 'login' | 'signup', displayName?: string) => {
    const mockToken = `echo_jwt_${Math.random().toString(36).substr(2)}`;
    
    if (username) {
      const storedUsers = localStorage.getItem('echo_db_users');
      let usersDb: (User & { password?: string })[] = storedUsers ? JSON.parse(storedUsers) : [];
      
      const normalizedUsername = username.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
      let existingUser = usersDb.find(u => u.username === normalizedUsername);

      if (mode === 'login') {
        if (!existingUser) {
          alert("Node not found. Please initialize a new node.");
          return;
        }
        if (existingUser.password && existingUser.password !== password) {
          alert("Access key mismatch. Biometric resonance failed.");
          return;
        }
      } else if (mode === 'signup') {
        if (existingUser) {
          alert("Username already indexed. Choose another identity.");
          return;
        }
      }

      let activeUser: User;

      if (existingUser && mode === 'login') {
        activeUser = existingUser;
      } else {
         activeUser = {
          ...MOCK_USER,
          id: `user_${Date.now()}`,
          username: normalizedUsername,
          displayName: displayName || username,
        };
        const userToSave = { ...activeUser, password };
        usersDb.push(userToSave);
        localStorage.setItem('echo_db_users', JSON.stringify(usersDb));
      }

      setUser(activeUser);
      if (mode === 'login') {
        localStorage.setItem('echo_user', JSON.stringify(activeUser));
        localStorage.setItem('echo_token', mockToken);
      }
      setIsLoggedIn(true);
    }
  };

  // Derive unique users for search from the feed + current user
  const getUniqueUsers = () => {
    const usersMap = new Map<string, User>();
    usersMap.set(user.id, user); // Add self
    feed.forEach(item => {
      if (!usersMap.has(item.userId)) {
        usersMap.set(item.userId, {
          id: item.userId,
          username: item.username,
          displayName: item.displayName,
          avatar: item.avatar,
          bio: 'Indexed User', // Minimal mock data
          isPrivate: false,
          followers: 120, // Mock stats
          following: 45
        });
      }
    });
    return Array.from(usersMap.values());
  };

  if (!isLoggedIn) {
    return <AuthView onSuccess={handleAuthSuccess} />;
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const renderContent = () => {
    // If we are viewing a specific profile via search or click, override content
    if (viewingProfile) {
      return (
        <ProfileView 
          user={viewingProfile} 
          allPosts={feed}
          onFollow={handleFollowNode}
          isFollowing={followingIds.has(viewingProfile.id)}
          onMessage={(u) => {
            setMessagingTarget(u);
            setIsMessagingOpen(true);
          }}
          onBack={() => setViewingProfile(null)}
          isOwnProfile={viewingProfile.id === user.id}
          onOpenSettings={viewingProfile.id === user.id ? () => setIsSettingsOpen(true) : undefined}
          onTogglePrivacy={viewingProfile.id === user.id ? (isPrivate) => setUser(prev => ({ ...prev, isPrivate })) : undefined}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="max-w-2xl mx-auto pt-4 pb-24 px-4 animate-in fade-in duration-500">
            <WaveBar 
              waves={waves} 
              onWaveClick={handleWaveClick} 
              onAddWave={handleAddWave}
            />
            {feed.length > 0 ? (
              <PulseFeed 
                items={feed} 
                currentUser={user}
                onPulse={handlePulse} 
                onResonate={handleResonate} 
                onUserClick={handleProfileLookupById}
                onEditCaption={handleEditCaption}
                onAddComment={handleAddComment}
              />
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
            <EchoSearch 
              users={getUniqueUsers()} 
              onUserSelect={handleProfileLookup} 
            />
            <div className="grid grid-cols-2 gap-3 mt-6">
              {feed.length > 0 ? feed.slice(0, 10).map((item, idx) => (
                <div 
                  key={`explore-${idx}`} 
                  className="aspect-square bg-white/5 rounded-2xl overflow-hidden glass-card group cursor-pointer relative"
                  onClick={() => {
                    // Find user associated with post and view profile
                    const author = getUniqueUsers().find(u => u.id === item.userId);
                    if (author) handleProfileLookup(author);
                  }}
                >
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
        return (
          <ActivityView 
            notifications={notifications} 
            onRead={markNotificationAsRead} 
            onMarkAllRead={markAllNotificationsAsRead} 
            onUserClick={handleProfileLookupById}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            user={user} 
            allPosts={feed} 
            onTogglePrivacy={(isPrivate) => setUser(prev => ({ ...prev, isPrivate }))}
            onFollow={handleFollowNode}
            isFollowing={false} // Can't follow self
            onMessage={(u) => {
              setMessagingTarget(u);
              setIsMessagingOpen(true);
            }}
            onOpenSettings={() => setIsSettingsOpen(true)}
            isOwnProfile={true}
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
          onClick={() => {
            setActiveTab('home');
            setViewingProfile(null);
          }}
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

      <Navbar 
        activeTab={activeTab} 
        onTabChange={(tab) => {
          setActiveTab(tab);
          setViewingProfile(null); // Clear profile view when navigation changes
        }} 
        unreadCount={unreadCount} 
      />

      {isMessagingOpen && (
        <DirectEcho 
          onClose={() => {
            setIsMessagingOpen(false);
            setMessagingTarget(null);
          }} 
          availableUsers={getUniqueUsers()}
          initialUser={messagingTarget}
        />
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

      {isScanning && (
        <div className="fixed inset-0 z-[200] bg-[#050505] flex flex-col items-center justify-center p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
          </div>
          
          <div className="relative mb-12">
            <div className="w-32 h-32 rounded-full border border-[#00f2ff]/30 animate-ping absolute inset-0" />
            <div className="w-32 h-32 rounded-full border-2 border-[#00f2ff] flex items-center justify-center relative">
              <svg className="w-16 h-16 text-[#00f2ff] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0112 3c4.148 0 7.747 2.512 9.324 6.115M12 11V3m0 8c0 3.517 1.009 6.799 2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 0012 21" />
              </svg>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-xl font-black text-white tracking-[0.2em] uppercase">Interrogating Node</h3>
            <div className="flex flex-col gap-1 items-center">
              <p className="text-[10px] text-[#00f2ff] font-mono animate-pulse">DECRYPTING_IDENTITY_PROTOCOL...</p>
              <p className="text-[8px] text-zinc-600 font-mono">ESTABLISHING_SECURE_TUNNEL [OK]</p>
              <p className="text-[8px] text-zinc-600 font-mono">BYPASSING_FIREWALL [OK]</p>
            </div>
            
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden mx-auto mt-6">
              <div className="h-full bg-[#00f2ff] shadow-[0_0_10px_#00f2ff] animate-[loading_1.2s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
