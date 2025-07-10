import React, { useState } from 'react';
import { OnboardingMode } from '../types';
import OnboardingButtons from './OnboardingButtons';

interface WelcomeScreenProps {
  onSelectMode: (mode: OnboardingMode) => void;
  onStartChat: (message?: string) => void;
  isFirstTime?: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode, onStartChat, isFirstTime = true }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onStartChat(inputValue.trim());
    } else {
      // Use default placeholder text as the first question if no input
      const defaultMessage = isFirstTime ? "I wanted to be random" : "Hello! How can you help me today?";
      onStartChat(defaultMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🥔</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {isFirstTime ? "Let's get you started, Chee Seng" : "Welcome back! 👋"}
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {isFirstTime 
            ? "Welcome to Smart Potato, your intelligent AI assistant powered by DeepSeek R1. Choose how you'd like to begin your journey."
            : "Ready to dive into another conversation? Choose a tutorial option below or start typing to begin a regular chat."
          }
        </p>
      </div>

      <div className="mb-12">
        <OnboardingButtons onSelectMode={onSelectMode} />
      </div>

      <div className="w-full max-w-2xl">
        <div className="relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isFirstTime ? "I wanted to be random" : "Type your message here..."}
            className="w-full px-6 py-4 text-gray-700 bg-white border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm resize-none"
            rows={4}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSubmit}
            className="absolute right-3 bottom-3 bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
          >
            {isFirstTime ? "Go" : "Start Chat"}
          </button>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-400 text-sm">
        <p>Smart Potato AI Assistant - Powered by DeepSeek R1</p>
        <p className="mt-1">Enhanced version of Perplexity, Claude, and ChatGPT</p>
      </div>
    </div>
  );
};

export default WelcomeScreen; 