import React, { useState } from 'react';
import { Project, Conversation, OnboardingMode } from '../types';
import ProjectMemorySection from './ProjectMemorySection';
import ProjectChatsList from './ProjectChatsList';

interface ProjectViewProps {
  project: Project;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  onBackToProjects: () => void;
  onUpdateProject: (project: Project) => void;
  onSelectMode: (mode: OnboardingMode) => void;
  isFirstTimeUser?: boolean;
}

const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onBackToProjects,
  onUpdateProject,
  onSelectMode,
  isFirstTimeUser = false
}) => {
  const [activeTab, setActiveTab] = useState<'chats' | 'memory'>('chats');

  // Filter conversations that belong to this project
  const projectConversations = conversations.filter(conv => 
    project.chatIds.includes(conv.id)
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Project Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Back Button */}
            <button
              onClick={onBackToProjects}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Projects
            </button>

            {/* Project Info */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
              {project.description && (
                <p className="text-sm text-gray-600">{project.description}</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{project.chatIds.length}</div>
              <div className="text-xs text-gray-500">Chats</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">{project.memories.length}</div>
              <div className="text-xs text-gray-500">Memories</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-8 mt-6">
          <button
            onClick={() => setActiveTab('chats')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'chats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Chats ({project.chatIds.length})
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'memory'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Project Memory ({project.memories.length})
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chats' ? (
          <ProjectChatsList
            project={project}
            conversations={projectConversations}
            activeConversationId={activeConversationId}
            onSelectConversation={onSelectConversation}
            onDeleteConversation={onDeleteConversation}
            onNewConversation={onNewConversation}
            onSelectMode={onSelectMode}
            isFirstTimeUser={isFirstTimeUser}
          />
        ) : (
          <ProjectMemorySection
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}
      </div>
    </div>
  );
};

export default ProjectView; 