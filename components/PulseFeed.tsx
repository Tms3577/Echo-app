
import React from 'react';
import { FeedItem, User } from '../types';
import PostCard from './PostCard';

interface PulseFeedProps {
  items: FeedItem[];
  currentUser: User;
  onPulse: (id: string) => void;
  onResonate: (id: string) => void;
  onUserClick?: (userId: string) => void;
  onEditCaption: (id: string, newCaption: string) => void;
  onAddComment: (id: string, commentText: string) => void;
}

const PulseFeed: React.FC<PulseFeedProps> = ({ items, currentUser, onPulse, onResonate, onUserClick, onEditCaption, onAddComment }) => {
  return (
    <div className="flex flex-col gap-10">
      {items.map((item) => (
        <PostCard 
          key={item.id} 
          item={item} 
          currentUser={currentUser}
          onPulse={onPulse} 
          onResonate={onResonate} 
          onUserClick={onUserClick}
          onEditCaption={onEditCaption}
          onAddComment={onAddComment}
        />
      ))}
    </div>
  );
};

export default PulseFeed;
