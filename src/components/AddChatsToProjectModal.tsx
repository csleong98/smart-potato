import React, { useState, useMemo } from 'react';
import { Conversation } from '../types';

interface AddChatsToProjectModalProps {
  conversations: Conversation[];
  projectId: string;
  onClose: () => void;
  onAddChats: (projectId: string, conversationIds: string[]) => void;
}

const AddChatsToProjectModal: React.FC<AddChatsToProjectModalProps> = ({
  conversations,
  projectId,
  onClose,
  onAddChats
}) => {
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);

  // Filter conversations that are not already in any project
  const availableConversations = useMemo(() => {
    return conversations.filter(conv => !conv.projectId);
  }, [conversations]);

  const handleChatToggle = (chatId: string) => {
    setSelectedChatIds(prev => {
      if (prev.includes(chatId)) {
        return prev.filter(id => id !== chatId);
      } else {
        return [...prev, chatId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedChatIds.length === availableConversations.length) {
      setSelectedChatIds([]);
    } else {
      setSelectedChatIds(availableConversations.map(conv => conv.id));
    }
  };

  const handleAdd = () => {
    if (selectedChatIds.length > 0) {
      onAddChats(projectId, selectedChatIds);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Existing Chats to Project
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Select conversations to add to this project. Only showing chats that aren't already in a project.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {availableConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No available chats</h4>
              <p className="text-gray-600 text-center max-w-sm">
                All your conversations are already assigned to projects, or you haven't created any chats yet.
              </p>
            </div>
          ) : (
            <>
              {/* Select All */}
              <div className="px-6 py-3 border-b border-gray-200 bg-gray-50">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedChatIds.length === availableConversations.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Select All ({availableConversations.length} chats)
                  </span>
                </label>
              </div>

              {/* Chat List */}
              <div className="divide-y divide-gray-200">
                {availableConversations.map((conversation) => (
                  <label key={conversation.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedChatIds.includes(conversation.id)}
                      onChange={() => handleChatToggle(conversation.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatDate(conversation.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>{conversation.messages.length} messages</span>
                        <span className="mx-2">•</span>
                        <span>Created {formatDate(conversation.createdAt)}</span>
                      </div>
                      {conversation.messages.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {conversation.messages[conversation.messages.length - 1].content.slice(0, 100)}
                          {conversation.messages[conversation.messages.length - 1].content.length > 100 ? '...' : ''}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {availableConversations.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {selectedChatIds.length} of {availableConversations.length} chats selected
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={selectedChatIds.length === 0}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Selected Chats
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddChatsToProjectModal; 