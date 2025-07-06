import React, { useState } from 'react';
import { Integration, IntegrationType } from '../types';

interface IntegrationsPageProps {
  integrations: Integration[];
  onConnectIntegration: (type: IntegrationType, config: any) => void;
  onDisconnectIntegration: (integrationId: string) => void;
  onUpdateIntegration: (integration: Integration) => void;
}

const IntegrationsPage: React.FC<IntegrationsPageProps> = ({
  integrations,
  onConnectIntegration,
  onDisconnectIntegration,
  onUpdateIntegration
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedIntegrationType, setSelectedIntegrationType] = useState<IntegrationType | null>(null);

  // Available integrations (free APIs similar to DeepSeek)
  const availableIntegrations = [
    {
      type: 'email' as IntegrationType,
      name: 'Gmail',
      description: 'Connect to Gmail for email automation',
      icon: '📧',
      category: 'Communication',
      isConnected: integrations.some(i => i.type === 'email' && i.status === 'connected'),
      setupUrl: 'https://developers.google.com/gmail/api',
      isFree: true
    },
    {
      type: 'calendar' as IntegrationType,
      name: 'Google Calendar',
      description: 'Automate calendar events and scheduling',
      icon: '📅',
      category: 'Productivity',
      isConnected: integrations.some(i => i.type === 'calendar' && i.status === 'connected'),
      setupUrl: 'https://developers.google.com/calendar/api',
      isFree: true
    },
    {
      type: 'storage' as IntegrationType,
      name: 'Google Drive',
      description: 'File storage and document management',
      icon: '🗂️',
      category: 'Storage',
      isConnected: integrations.some(i => i.type === 'storage' && i.status === 'connected'),
      setupUrl: 'https://developers.google.com/drive/api',
      isFree: true
    },
    {
      type: 'notification' as IntegrationType,
      name: 'Discord Webhooks',
      description: 'Send notifications to Discord channels',
      icon: '🔔',
      category: 'Communication',
      isConnected: integrations.some(i => i.type === 'notification' && i.status === 'connected'),
      setupUrl: 'https://discord.com/developers/docs/resources/webhook',
      isFree: true
    },
    {
      type: 'document' as IntegrationType,
      name: 'Google Docs',
      description: 'Create and edit documents automatically',
      icon: '📄',
      category: 'Productivity',
      isConnected: integrations.some(i => i.type === 'document' && i.status === 'connected'),
      setupUrl: 'https://developers.google.com/docs/api',
      isFree: true
    },
    {
      type: 'api' as IntegrationType,
      name: 'OpenWeather API',
      description: 'Weather data for automations',
      icon: '🌤️',
      category: 'Data',
      isConnected: integrations.some(i => i.type === 'api' && i.status === 'connected'),
      setupUrl: 'https://openweathermap.org/api',
      isFree: true
    },
    {
      type: 'social' as IntegrationType,
      name: 'Reddit API',
      description: 'Monitor and post to Reddit',
      icon: '🤖',
      category: 'Social',
      isConnected: integrations.some(i => i.type === 'social' && i.status === 'connected'),
      setupUrl: 'https://www.reddit.com/dev/api',
      isFree: true
    },
    {
      type: 'database' as IntegrationType,
      name: 'Airtable',
      description: 'Database operations and data storage',
      icon: '🗃️',
      category: 'Storage',
      isConnected: integrations.some(i => i.type === 'database' && i.status === 'connected'),
      setupUrl: 'https://airtable.com/developers/web/api/introduction',
      isFree: true
    }
  ];

  const categories = ['all', ...Array.from(new Set(availableIntegrations.map(i => i.category)))];
  
  const filteredIntegrations = selectedCategory === 'all' 
    ? availableIntegrations 
    : availableIntegrations.filter(i => i.category === selectedCategory);

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  const handleConnect = (type: IntegrationType) => {
    setSelectedIntegrationType(type);
    setShowConnectModal(true);
  };

  const getStatusColor = (isConnected: boolean) => {
    return isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (isConnected: boolean) => {
    return isConnected ? 'Connected' : 'Not Connected';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Integrations</h1>
            <p className="text-gray-600 mt-2">
              Connect your favorite apps and services to power your workflows
            </p>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{connectedCount}</div>
            <div className="text-sm text-gray-500">Connected</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg w-fit">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.type}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Integration Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{integration.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{integration.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.isConnected)}`}>
                      {getStatusText(integration.isConnected)}
                    </span>
                  </div>
                </div>
                
                {integration.isFree && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                    Free
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {integration.description}
              </p>

              {/* Actions */}
              <div className="space-y-3">
                {integration.isConnected ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        const connectedIntegration = integrations.find(i => i.type === integration.type);
                        if (connectedIntegration) {
                          onDisconnectIntegration(connectedIntegration.id);
                        }
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Disconnect
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium">
                      Settings
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleConnect(integration.type)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Connect
                    </button>
                    <a
                      href={integration.setupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium text-center block"
                    >
                      Setup Guide
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Getting Started with Integrations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <div>
                <p className="font-medium text-blue-900">Choose Integration</p>
                <p className="text-blue-700">Select the apps you want to connect</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <div>
                <p className="font-medium text-blue-900">Get API Keys</p>
                <p className="text-blue-700">Follow the setup guide to get credentials</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <div>
                <p className="font-medium text-blue-900">Build Workflows</p>
                <p className="text-blue-700">Create automated workflows with your connected apps</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connect Modal */}
      {showConnectModal && selectedIntegrationType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Connect {availableIntegrations.find(i => i.type === selectedIntegrationType)?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // For now, just simulate connection
                    onConnectIntegration(selectedIntegrationType, { apiKey: 'demo-key' });
                    setShowConnectModal(false);
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsPage; 