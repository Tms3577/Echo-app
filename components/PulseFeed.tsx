
import React from 'react';
import { FeedItem } from '../types';
import PostCard from './PostCard';

interface PulseFeedProps {
  items: FeedItem[];
  onPulse: (id: string) => void;
  onResonate: (id: string) => void;
  onUserClick?: (userId: string) => void;
}

const PulseFeed: React.FC<PulseFeedProps> = ({ items, onPulse, onResonate, onUserClick }) => {
  return (
    <div className="flex flex-col gap-10">
      {items.map((item) => (
        <PostCard 
          key={item.id} 
          item={item} 
          onPulse={onPulse} 
          onResonate={onResonate} 
          onUserClick={onUserClick}
        />
      ))}
    </div>
  );
};

export default PulseFeed;
