import React, { useState } from 'react';
import { Conversation, Project } from '../types';
import AddChatToProjectModal from './AddChatToProjectModal';

interface ChatHeaderProps {
  conversation: Conversation;
  onDeleteChat: () => void;
  onGenerateTitle?: () => void;
  isGeneratingTitle?: boolean;
  showThinkingProcess?: boolean;
  onToggleThinkingProcess?: (enabled: boolean) => void;
  projects?: Project[];
  onAddToProject?: (projectId: string, conversationIds: string[]) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onSetReminder?: () => void;
}

// Token estimation function
const estimateTokens = (text: string): number => {
  // Rough estimation: ~3.5 characters per token for English text
  return Math.ceil(text.length / 3.5);
};

const calculateMemoryUsage = (conversation: Conversation) => {
  const totalText = conversation.messages
    .map(msg => msg.content)
    .join(' ');
  
  const usedTokens = estimateTokens(totalText);
  const maxTokens = 128000; // DeepSeek R1 context window
  const usagePercentage = Math.min((usedTokens / maxTokens) * 100, 100);
  
  return {
    usedTokens,
    maxTokens,
    usagePercentage
  };
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onDeleteChat,
  onGenerateTitle,
  isGeneratingTitle = false,
  showThinkingProcess = false,
  onToggleThinkingProcess,
  projects = [],
  onAddToProject,
  onUpdateTitle,
  onSetReminder
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddToProjectModal, setShowAddToProjectModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const memoryUsage = calculateMemoryUsage(conversation);

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDeleteChat();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
    setShowDropdown(false);
  };

  const handleGenerateTitle = () => {
    if (onGenerateTitle && !isGeneratingTitle) {
      onGenerateTitle();
    }
    setShowDropdown(false);
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setEditTitle(conversation.title);
  };

  const handleTitleSave = () => {
    if (onUpdateTitle && editTitle.trim() && editTitle.trim() !== conversation.title) {
      onUpdateTitle(editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setIsEditingTitle(false);
      setEditTitle(conversation.title);
    }
  };

  const handleSetReminder = () => {
    if (onSetReminder) {
      onSetReminder();
    }
    setShowDropdown(false);
  };

  // Color coding for memory usage
  const getMemoryColor = (percentage: number) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getMemoryTextColor = (percentage: number) => {
    if (percentage < 60) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
      {/* Left side - Title */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
            💬
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleTitleKeyDown}
              onBlur={handleTitleSave}
              className="text-lg font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
              autoFocus
            />
          ) : (
            <h1 
              className="text-lg font-semibold text-gray-900 truncate cursor-pointer hover:text-blue-600 transition-colors duration-200"
              onClick={handleTitleEdit}
              title="Click to edit title"
            >
              {conversation.title}
            </h1>
          )}
          <p className="text-sm text-gray-500">
            {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''} • 
            {' '}Created {new Date(conversation.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Right side - Memory indicator and Controls */}
      <div className="flex items-center space-x-4 flex-shrink-0">
        {/* Memory Usage Indicator */}
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-2 cursor-help"
            title={`Memory Usage: ${memoryUsage.usedTokens.toLocaleString()} / ${memoryUsage.maxTokens.toLocaleString()} tokens (${Math.round(memoryUsage.usagePercentage)}%)`}
          >
            <span className="text-xs text-gray-500">Memory</span>
            <div className="flex items-center space-x-1">
              <span className={`text-xs font-medium ${getMemoryTextColor(memoryUsage.usagePercentage)}`}>
                {Math.round(memoryUsage.usagePercentage)}%
              </span>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getMemoryColor(memoryUsage.usagePercentage)}`}
                  style={{ width: `${memoryUsage.usagePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>



        {/* Ellipse Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            title="More options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* Generate Title */}
              {conversation.messages.length > 0 && onGenerateTitle && (
                <button
                  onClick={handleGenerateTitle}
                  disabled={isGeneratingTitle}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isGeneratingTitle ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                  ) : (
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                  <span>Generate Title</span>
                </button>
              )}

              {/* Add to Project */}
              {!conversation.projectId && onAddToProject && (
                <button
                  onClick={() => {
                    setShowAddToProjectModal(true);
                    setShowDropdown(false);
                  }}
                  disabled={projects.length === 0}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>{projects.length === 0 ? "No projects available" : "Add to Project"}</span>
                </button>
              )}

                             {/* Set Reminder */}
               {onSetReminder && (
                 <button
                   onClick={handleSetReminder}
                   className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                 >
                   <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   <span>Set Reminder</span>
                 </button>
               )}

               {/* Thinking Process Toggle */}
               {onToggleThinkingProcess && (
                 <button
                   onClick={() => {
                     onToggleThinkingProcess(!showThinkingProcess);
                     setShowDropdown(false);
                   }}
                   className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                 >
                   <div className="flex items-center space-x-2">
                     <span className="text-gray-600">🧠</span>
                     <span>Thinking Process</span>
                   </div>
                   <div className={`relative inline-flex items-center h-4 w-7 rounded-full transition-colors duration-200 ${
                     showThinkingProcess ? 'bg-blue-500' : 'bg-gray-300'
                   }`}>
                     <span
                       className={`inline-block w-2.5 h-2.5 bg-white rounded-full transition-transform duration-200 ${
                         showThinkingProcess ? 'translate-x-3.5' : 'translate-x-0.5'
                       }`}
                     />
                   </div>
                 </button>
               )}

               {/* Divider */}
               <div className="my-1 border-t border-gray-200"></div>

              {/* Delete Chat */}
              <button
                onClick={handleDeleteClick}
                className={`w-full px-4 py-2 text-left text-sm flex items-center space-x-2 ${
                  showDeleteConfirm 
                    ? 'text-red-600 bg-red-50' 
                    : 'text-red-600 hover:bg-red-50'
                }`}
              >
                {showDeleteConfirm ? (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Confirm Delete</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete Chat</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}

      {/* Add to Project Modal */}
      {showAddToProjectModal && (
        <AddChatToProjectModal
          projects={projects}
          conversationId={conversation.id}
          conversationTitle={conversation.title}
          onClose={() => setShowAddToProjectModal(false)}
          onAddToProject={(projectId, conversationIds) => {
            if (onAddToProject) {
              onAddToProject(projectId, conversationIds);
            }
          }}
        />
      )}
    </div>
  );
};

export default ChatHeader; 