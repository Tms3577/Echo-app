
import { User, FeedItem, Wave } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: 'new_node',
  displayName: 'New Node',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&h=200&fit=crop',
  bio: '',
  isPrivate: false,
  followers: 0,
  following: 0
};

export const MOCK_WAVES: Wave[] = [];

export const MOCK_FEED: FeedItem[] = [];
