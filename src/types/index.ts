export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  thinkingProcess?: string; // Optional thinking process for AI messages
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export type OnboardingMode = 'create' | 'research' | 'build' | null; 