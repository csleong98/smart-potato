import React from 'react';
import { OnboardingMode } from '../types';

interface OnboardingButtonsProps {
  onSelectMode: (mode: OnboardingMode) => void;
}

const OnboardingButtons: React.FC<OnboardingButtonsProps> = ({ onSelectMode }) => {
  const buttons = [
    {
      mode: 'create' as OnboardingMode,
      title: 'Create something',
      description: 'Build creative projects, apps, or content with AI assistance',
      icon: '✨',
      gradient: 'from-pastel-pink to-pastel-purple'
    },
    {
      mode: 'research' as OnboardingMode,
      title: 'Research about a topic',
      description: 'Deep dive into subjects with comprehensive analysis',
      icon: '📚',
      gradient: 'from-pastel-green to-pastel-yellow'
    },
    {
      mode: 'build' as OnboardingMode,
      title: 'Build a workflow',
      description: 'Learn how to prompt effectively for building projects',
      icon: '🏗️',
      gradient: 'from-pastel-yellow to-pastel-orange'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      {buttons.map((button) => (
        <button
          key={button.mode}
          onClick={() => onSelectMode(button.mode)}
          className={`bg-gradient-to-br ${button.gradient} p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-white/50 hover:scale-105 text-left group`}
        >
          <div className="flex items-start space-x-4">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {button.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {button.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {button.description}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default OnboardingButtons; 