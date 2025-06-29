import React from 'react';
import { Project, Conversation, OnboardingMode } from '../types';
import OnboardingButtons from './OnboardingButtons';

interface ProjectChatsListProps {
  project: Project;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onNewConversation: () => void;
  onSelectMode: (mode: OnboardingMode) => void;
  isFirstTimeUser?: boolean;
}

const ProjectChatsList: React.FC<ProjectChatsListProps> = ({
  project,
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  onSelectMode,
  isFirstTimeUser = false
}) => {
  return (
    <div className="flex h-full">
      {/* Chats Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={onNewConversation}
            className="w-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-gray-700 px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat in {project.name}
          </button>
        </div>

        {/* Chats List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Project Conversations ({conversations.length})
            </h3>
            
            {conversations.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">💬</div>
                <p className="text-gray-500 text-sm mb-4">No chats in this project yet</p>
                <button
                  onClick={onNewConversation}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Start your first conversation
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`relative group rounded-lg transition-all duration-200 ${
                      activeConversationId === conversation.id
                        ? 'bg-pastel-purple text-purple-800 border border-purple-200'
                        : 'hover:bg-pastel-gray text-gray-600'
                    }`}
                  >
                    <button
                      onClick={() => onSelectConversation(conversation.id)}
                      className="w-full text-left p-3 pr-10"
                    >
                      <div className="truncate text-sm font-medium">
                        {conversation.title}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(conversation.updatedAt).toLocaleDateString()}
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(conversation.id);
                      }}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 hover:bg-red-100 rounded text-red-500 hover:text-red-700"
                      title="Delete conversation"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white p-8">
        {activeConversationId ? (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-lg">Chat is ready!</p>
            <p className="text-sm">The selected conversation will be displayed here</p>
          </div>
        ) : (
          <div className="text-center max-w-4xl">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Start a new conversation in {project.name}
              </h2>
              <p className="text-gray-600">
                {isFirstTimeUser 
                  ? "Choose how you'd like to begin your conversation in this project"
                  : "Ready to start chatting in this project? Click the button above or choose a tutorial option below."
                }
              </p>
            </div>

            {isFirstTimeUser && (
              <div className="mb-8">
                <OnboardingButtons onSelectMode={onSelectMode} />
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>All conversations created here will be part of the {project.name} project</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectChatsList; 