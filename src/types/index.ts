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

// Workflow and Integration Types
export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  icon: string;
  config: IntegrationConfig;
  connectedAt?: Date;
  lastSync?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type IntegrationType = 
  | 'email' 
  | 'calendar' 
  | 'storage' 
  | 'notification' 
  | 'document' 
  | 'database' 
  | 'api' 
  | 'social';

export interface IntegrationConfig {
  apiKey?: string;
  webhookUrl?: string;
  settings: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'draft';
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
  triggers: string[]; // Node IDs that are triggers
  integrations: string[]; // Integration IDs used in this workflow
  createdAt: Date;
  updatedAt: Date;
  lastRun?: Date;
  runCount: number;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  category: NodeCategory;
  name: string;
  description?: string;
  position: { x: number; y: number };
  data: NodeData;
  config: NodeConfig;
}

export type NodeType = 
  // Trigger Nodes
  | 'email_received'
  | 'calendar_event'
  | 'time_based'
  | 'webhook'
  // Processor Nodes
  | 'extract_data'
  | 'filter_content'
  | 'calculate_values'
  | 'format_text'
  // Action Nodes
  | 'send_notification'
  | 'create_document'
  | 'store_data'
  | 'send_email'
  // Logic Nodes
  | 'if_condition'
  | 'loop'
  | 'delay'
  | 'switch';

export type NodeCategory = 'trigger' | 'processor' | 'action' | 'logic';

export interface NodeData {
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  integrationId?: string;
}

export interface NodeConfig {
  settings: Record<string, any>;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  field: string;
  type: 'required' | 'email' | 'url' | 'number' | 'date';
  message: string;
}

export interface WorkflowConnection {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceHandle: string;
  targetHandle: string;
}

export interface SampleWorkflow {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredIntegrations: IntegrationType[];
  icon: string;
  template: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>;
}

// Node Position for drag and drop
export interface NodePosition {
  x: number;
  y: number;
} 