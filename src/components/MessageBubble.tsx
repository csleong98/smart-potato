import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white' 
              : 'bg-gradient-to-br from-pastel-purple to-pastel-pink text-purple-600'
          }`}>
            {isUser ? '👤' : '🥔'}
          </div>
        </div>
        
        {/* Message Content */}
        <div className={`relative px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-500 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
        }`}>
          {/* Message Text */}
          <div className={`text-sm leading-relaxed ${isUser ? 'text-white' : 'text-gray-800'}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Headers
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-1" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-1" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 mt-1" {...props} />,
                
                // Paragraphs
                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                
                // Strong/Bold text
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                
                // Emphasis/Italic text
                em: ({node, ...props}) => <em className="italic" {...props} />,
                
                // Lists
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="ml-2" {...props} />,
                
                // Code
                code: ({node, inline, className, children, ...props}: any) => 
                  inline ? (
                    <code className={`px-1 py-0.5 rounded text-xs font-mono ${
                      isUser ? 'bg-blue-600 text-blue-100' : 'bg-gray-100 text-gray-800'
                    }`} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className={`block px-3 py-2 rounded-md text-xs font-mono overflow-x-auto ${
                      isUser ? 'bg-blue-600 text-blue-100' : 'bg-gray-100 text-gray-800'
                    }`} {...props}>
                      {children}
                    </code>
                  ),
                
                // Pre (code blocks)
                pre: ({node, ...props}) => (
                  <pre className={`mb-2 p-3 rounded-md overflow-x-auto ${
                    isUser ? 'bg-blue-600' : 'bg-gray-100'
                  }`} {...props} />
                ),
                
                // Blockquotes
                blockquote: ({node, ...props}) => (
                  <blockquote className={`border-l-3 pl-3 mb-2 italic ${
                    isUser ? 'border-blue-300' : 'border-gray-300'
                  }`} {...props} />
                ),
                
                // Links
                a: ({node, ...props}) => (
                  <a className={`underline hover:no-underline ${
                    isUser ? 'text-blue-200 hover:text-white' : 'text-blue-600 hover:text-blue-800'
                  }`} target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
          
          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-100' : 'text-gray-400'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble; 