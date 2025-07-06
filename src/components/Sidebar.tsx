import React from 'react';
import { Conversation } from '../types';

interface SidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (conversationId: string) => void;
  onNavigateToProjects?: () => void;
  onNavigateToChats?: () => void;
  onNavigateToWorkflows?: () => void;
  onNavigateToIntegrations?: () => void;
  currentView?: 'chat' | 'projects' | 'project' | 'workflows' | 'integrations';
}

const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onNavigateToProjects,
  onNavigateToChats,
  onNavigateToWorkflows,
  onNavigateToIntegrations,
  currentView = 'chat'
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-lg flex items-center justify-center">
            <span className="text-purple-600 font-bold text-sm">🥔</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-800">Smart Potato</h1>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-pastel-blue to-pastel-purple text-gray-700 px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 border border-gray-200 hover:border-purple-200"
        >
          + New Chat
        </button>
      </div>

      {/* Navigation */}
      <div className="px-4 pb-4">
        <div className="space-y-1">
          <button
            onClick={() => (currentView !== 'chat' && currentView !== 'project') && onNavigateToChats?.()}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentView === 'chat' || currentView === 'project'
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chats
          </button>
          
          {onNavigateToProjects && (
            <button
              onClick={onNavigateToProjects}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'projects'
                  ? 'bg-blue-50 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Projects
            </button>
          )}

          {onNavigateToWorkflows && (
            <button
              onClick={onNavigateToWorkflows}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'workflows'
                  ? 'bg-purple-50 text-purple-600 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Workflows
            </button>
          )}

          {onNavigateToIntegrations && (
            <button
              onClick={onNavigateToIntegrations}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentView === 'integrations'
                  ? 'bg-green-50 text-green-600 border border-green-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Integrations
            </button>
          )}
        </div>
      </div>

      {/* Conversations List - Only show when in chat views */}
      {(currentView === 'chat' || currentView === 'project') && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
              Recent Conversations
            </h3>
            {conversations.length === 0 ? (
              <div className="text-gray-400 text-sm italic">
                No conversations yet
              </div>
            ) : (
              conversations.map((conversation) => (
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
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">
          Powered by DeepSeek R1
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 