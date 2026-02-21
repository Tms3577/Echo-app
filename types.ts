export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  followers: number;
  following: number;
}

export interface Wave {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  media: string;
  timestamp: number;
  viewers: string[];
  hasSeen?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  timestamp: string;
}

export interface FeedItem {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  media: string;
  caption: string;
  pulses: number;
  resonations: number;
  hasPulsed: boolean;
  hasResonated: boolean;
  timestamp: string;
  originalCreator?: string;
  comments?: Comment[];
}

export interface Conversation {
  id: string; // matches conversation_id in SQL
  participants: User[];
  name?: string;
  isGroup?: boolean;
  last_message?: string;
  last_message_time?: number;
  is_read: boolean;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  message_text: string;
  is_read: boolean;
  created_at: number;
}

export interface Notification {
  id: string;
  recipientId: string;
  senderId: string;
  senderUsername: string;
  senderAvatar: string;
  type: 'pulse' | 'resonate' | 'follow' | 'mention';
  postId?: string;
  isRead: boolean;
  createdAt: number;
  text: string;
}

export type NavTab = 'home' | 'explore' | 'upload' | 'activity' | 'profile';