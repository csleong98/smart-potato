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
  projectId?: string; // Reference to parent project if any
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  chatIds: string[]; // IDs of conversations in this project
  memories: ProjectMemory[];
  createdAt: Date;
  updatedAt: Date;
  lastInteractionAt: Date;
}

export interface ProjectMemory {
  id: string;
  title: string; // Brief title for the memory
  content: string; // Full text/markdown content
  source: 'auto-summary' | 'user-created';
  chatId?: string; // If derived from a specific chat
  createdAt: Date;
  updatedAt: Date;
}

export type OnboardingMode = 'create' | 'research' | 'build' | null; 