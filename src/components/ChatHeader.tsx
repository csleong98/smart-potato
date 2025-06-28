import React, { useState } from 'react';
import { Conversation } from '../types';

interface ChatHeaderProps {
  conversation: Conversation;
  onDeleteChat: () => void;
  onGenerateTitle?: () => void;
  isGeneratingTitle?: boolean;
  showThinkingProcess?: boolean;
  onToggleThinkingProcess?: (enabled: boolean) => void;
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
  onToggleThinkingProcess
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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
  };

  const handleGenerateTitle = () => {
    if (onGenerateTitle && !isGeneratingTitle) {
      onGenerateTitle();
    }
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
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink text-purple-600 flex items-center justify-center">
            💬
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {conversation.title}
          </h1>
          <p className="text-sm text-gray-500">
            {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''} • 
            {' '}Created {new Date(conversation.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Right side - Memory indicator and Action buttons */}
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

        {/* Thinking Process Toggle */}
        {onToggleThinkingProcess && (
          <div className="flex items-center space-x-2 px-2 py-1 rounded-lg bg-gray-50">
            <span className={`text-xs font-medium ${showThinkingProcess ? 'text-blue-600' : 'text-gray-500'}`}>
              🧠 Thinking
            </span>
            <button
              onClick={() => onToggleThinkingProcess(!showThinkingProcess)}
              className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${
                showThinkingProcess ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              title={showThinkingProcess ? 'Disable thinking process capture' : 'Enable thinking process capture'}
            >
              <span
                className={`inline-block w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                  showThinkingProcess ? 'translate-x-5' : 'translate-x-1'
                }`}
              />
            </button>
            {showThinkingProcess && (
              <span className="text-xs text-blue-600 font-medium">ON</span>
            )}
          </div>
        )}

        {/* Generate Title Button - only show if there are messages */}
        {conversation.messages.length > 0 && onGenerateTitle && (
          <button
            onClick={handleGenerateTitle}
            disabled={isGeneratingTitle}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Generate AI title"
          >
            {isGeneratingTitle ? (
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </button>
        )}

        {/* Delete Button with confirmation */}
        <button
          onClick={handleDeleteClick}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            showDeleteConfirm 
              ? 'text-red-600 bg-red-50 hover:bg-red-100' 
              : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
          }`}
          title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete chat'}
        >
          {showDeleteConfirm ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 