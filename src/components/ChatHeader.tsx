import React, { useState } from 'react';
import { Conversation } from '../types';

interface ChatHeaderProps {
  conversation: Conversation;
  onDeleteChat: () => void;
  onGenerateTitle?: () => void;
  isGeneratingTitle?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  conversation,
  onDeleteChat,
  onGenerateTitle,
  isGeneratingTitle = false
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

      {/* Right side - Action buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0">
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