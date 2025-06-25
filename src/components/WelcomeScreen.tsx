import React from 'react';
import { OnboardingMode } from '../types';
import OnboardingButtons from './OnboardingButtons';

interface WelcomeScreenProps {
  onSelectMode: (mode: OnboardingMode) => void;
  onStartChat: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode, onStartChat }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-pastel-purple to-pastel-pink rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🥔</span>
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Let's get you started, Chee Seng
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Welcome to Smart Potato, your intelligent AI assistant powered by DeepSeek R1. 
          Choose how you'd like to begin your journey.
        </p>
      </div>

      <div className="mb-12">
        <OnboardingButtons onSelectMode={onSelectMode} />
      </div>

      <div className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="I wanted to be random"
            className="w-full px-6 py-4 text-gray-600 bg-white border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onStartChat();
              }
            }}
          />
          <button
            onClick={onStartChat}
            className="absolute right-2 top-2 bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
          >
            Go
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