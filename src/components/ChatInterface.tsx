import React, { useState, useRef, useEffect } from 'react';
import { Conversation } from '../types';
import MessageBubble from './MessageBubble';
import ChatHeader from './ChatHeader';

interface ChatInterfaceProps {
  conversation: Conversation;
  onSendMessage: (content: string) => void;
  onDeleteChat: () => void;
  onGenerateTitle?: () => void;
  isGeneratingTitle?: boolean;
  isLoading: boolean;
  placeholder?: string;
  showTutorialChoices?: boolean;
  onTutorialChoice?: (choice: 'tutorial' | 'continue') => void;
  showResearchChoices?: boolean;
  onResearchChoice?: (choice: string) => void;
  showThinkingProcess?: boolean;
  onToggleThinkingProcess?: (enabled: boolean) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  onSendMessage,
  onDeleteChat,
  onGenerateTitle,
  isGeneratingTitle = false,
  isLoading,
  placeholder = "Write your message here",
  showTutorialChoices = false,
  onTutorialChoice,
  showResearchChoices = false,
  onResearchChoice,
  showThinkingProcess = false,
  onToggleThinkingProcess
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-50 to-white">
      {/* Chat Header */}
      <ChatHeader 
        conversation={conversation}
        onDeleteChat={onDeleteChat}
        onGenerateTitle={onGenerateTitle}
        isGeneratingTitle={isGeneratingTitle}
        showThinkingProcess={showThinkingProcess}
        onToggleThinkingProcess={onToggleThinkingProcess}
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {conversation.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-lg">Start a conversation</p>
              <p className="text-sm">Ask me anything or use the buttons above to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex max-w-[80%]">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-pink text-purple-600 flex items-center justify-center">
                      🥔
                    </div>
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200 px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-500">Smart Potato is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 bg-white p-4">
        {/* Tutorial Choice Buttons */}
        {showTutorialChoices && onTutorialChoice && (
          <div className="mb-4 flex gap-3 justify-center">
            <button
              onClick={() => onTutorialChoice('tutorial')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 font-medium"
            >
              Yes, teach me prompting
            </button>
            <button
              onClick={() => onTutorialChoice('continue')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-2xl transition-colors duration-200 font-medium"
            >
              No, continue normally
            </button>
          </div>
        )}
        
        {/* Research Choice Buttons */}
        {showResearchChoices && onResearchChoice && (
          <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => onResearchChoice('Academic research techniques')}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 font-medium text-sm"
            >
              Academic research techniques
            </button>
            <button
              onClick={() => onResearchChoice('Market research methods')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 font-medium text-sm"
            >
              Market research methods
            </button>
            <button
              onClick={() => onResearchChoice('Technical research strategies')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 font-medium text-sm"
            >
              Technical research strategies
            </button>
            <button
              onClick={() => onResearchChoice('Fact-checking approaches')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 font-medium text-sm"
            >
              Fact-checking approaches
            </button>
            <button
              onClick={() => onResearchChoice('Continue normally')}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-2xl transition-colors duration-200 font-medium text-sm sm:col-span-2 lg:col-span-1"
            >
              Continue normally
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32 disabled:opacity-50 disabled:cursor-not-allowed"
              rows={1}
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition-colors duration-200 flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>Go</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface; 