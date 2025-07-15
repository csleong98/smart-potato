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
      icon: '✨'
    },
    {
      mode: 'research' as OnboardingMode,
      title: 'Research about a topic',
      description: 'Deep dive into subjects with comprehensive analysis',
      icon: '📚'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {buttons.map((button) => (
        <button
          key={button.mode}
          onClick={() => onSelectMode(button.mode)}
          className="bg-white hover:bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
        >
          <div className="flex items-start space-x-3">
            <div className="text-2xl text-gray-600">
              {button.icon}
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-1">
                {button.title}
              </h3>
              <p className="text-gray-600 text-sm">
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