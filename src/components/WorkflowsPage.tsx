import React, { useState } from 'react';
import { Workflow, Integration, SampleWorkflow } from '../types';

interface WorkflowsPageProps {
  workflows: Workflow[];
  integrations: Integration[];
  onCreateWorkflow: (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>) => void;
  onDeleteWorkflow: (workflowId: string) => void;
  onEditWorkflow: (workflowId: string) => void;
  onToggleWorkflow: (workflowId: string, status: 'active' | 'inactive') => void;
  onNavigateToIntegrations: () => void;
}

const WorkflowsPage: React.FC<WorkflowsPageProps> = ({
  workflows,
  integrations,
  onCreateWorkflow,
  onDeleteWorkflow,
  onEditWorkflow,
  onToggleWorkflow,
  onNavigateToIntegrations
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const connectedIntegrations = integrations.filter(i => i.status === 'connected');
  const connectedCount = connectedIntegrations.length;

  // Sample workflows that become available when enough integrations are connected
  const sampleWorkflows: SampleWorkflow[] = [
    {
      id: 'email-to-discord',
      name: 'Email to Discord Notification',
      description: 'Forward important emails to a Discord channel',
      category: 'Communication',
      difficulty: 'beginner',
      requiredIntegrations: ['email', 'notification'],
      icon: '📧',
      template: {
        name: 'Email to Discord Notification',
        description: 'Forward important emails to a Discord channel',
        status: 'draft',
        nodes: [],
        connections: [],
        triggers: [],
        integrations: []
      }
    },
    {
      id: 'calendar-weather-reminder',
      name: 'Weather-Based Calendar Reminders',
      description: 'Get weather updates before outdoor events',
      category: 'Productivity',
      difficulty: 'intermediate',
      requiredIntegrations: ['calendar', 'api'],
      icon: '📅',
      template: {
        name: 'Weather-Based Calendar Reminders',
        description: 'Get weather updates before outdoor events',
        status: 'draft',
        nodes: [],
        connections: [],
        triggers: [],
        integrations: []
      }
    },
    {
      id: 'document-backup',
      name: 'Automated Document Backup',
      description: 'Backup important documents to cloud storage',
      category: 'Storage',
      difficulty: 'beginner',
      requiredIntegrations: ['document', 'storage'],
      icon: '💾',
      template: {
        name: 'Automated Document Backup',
        description: 'Backup important documents to cloud storage',
        status: 'draft',
        nodes: [],
        connections: [],
        triggers: [],
        integrations: []
      }
    },
    {
      id: 'daily-reddit-digest',
      name: 'Daily Reddit Digest',
      description: 'Compile top posts and send to email',
      category: 'Content',
      difficulty: 'intermediate',
      requiredIntegrations: ['social', 'email'],
      icon: '📰',
      template: {
        name: 'Daily Reddit Digest',
        description: 'Compile top posts and send to email',
        status: 'draft',
        nodes: [],
        connections: [],
        triggers: [],
        integrations: []
      }
    }
  ];

  // Filter sample workflows based on available integrations
  const availableSampleWorkflows = sampleWorkflows.filter(sample => 
    sample.requiredIntegrations.every(required => 
      connectedIntegrations.some(integration => integration.type === required)
    )
  );

  const categories = ['all', 'Communication', 'Productivity', 'Storage', 'Content'];
  const filteredWorkflows = selectedCategory === 'all' 
    ? workflows 
    : workflows.filter(w => w.name.includes(selectedCategory));

  const getStatusColor = (status: Workflow['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateFromTemplate = (sample: SampleWorkflow) => {
    onCreateWorkflow(sample.template);
  };

  // No integrations connected state
  if (connectedCount === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-2">
            Automate your daily tasks with intelligent workflows
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            <div className="text-8xl mb-6">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Apps First</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              To create powerful workflows, you need to connect at least 2 integrations. 
              Start by connecting your favorite apps and services.
            </p>
            <button
              onClick={onNavigateToIntegrations}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-xl transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
            >
              Browse Integrations
            </button>
            
            <div className="mt-12 bg-blue-50 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 mb-4">What you can automate:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📧</span>
                  <span className="text-blue-800">Email notifications and responses</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📅</span>
                  <span className="text-blue-800">Calendar events and reminders</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">📄</span>
                  <span className="text-blue-800">Document creation and storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🤖</span>
                  <span className="text-blue-800">Social media monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has some integrations but less than 2
  if (connectedCount === 1) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
          <p className="text-gray-600 mt-2">
            Automate your daily tasks with intelligent workflows
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center max-w-lg">
            <div className="text-8xl mb-6">🔗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect One More Integration</h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Great! You have <strong>{connectedCount} integration</strong> connected. 
              Connect one more to unlock powerful workflow templates.
            </p>
            
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={onNavigateToIntegrations}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Add Integration
              </button>
              <button
                onClick={() => onEditWorkflow('new')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Create Custom Workflow
              </button>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <h3 className="font-semibold text-amber-900 mb-2">Connected Integration:</h3>
              <div className="flex justify-center">
                {connectedIntegrations.map(integration => (
                  <div key={integration.id} className="flex items-center space-x-2 bg-white rounded-lg px-4 py-2">
                    <span className="text-xl">{integration.icon}</span>
                    <span className="font-medium text-gray-900">{integration.name}</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Connected</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Has 2+ integrations - show sample workflows or existing workflows
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Workflows</h1>
            <p className="text-gray-600 mt-2">
              Automate your daily tasks with intelligent workflows
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{workflows.filter(w => w.status === 'active').length}</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{workflows.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            
            <button
              onClick={() => onEditWorkflow('new')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
            >
              <svg className="w-4 h-4 mr-1.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Workflow
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
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
        {workflows.length === 0 ? (
          /* Empty state with sample workflows */
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Automate!</h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                You have <strong>{connectedCount} integrations</strong> connected. 
                Choose from these sample workflows to get started, or create your own from scratch.
              </p>
            </div>

            {/* Sample Workflows */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sample Workflows</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSampleWorkflows.map((sample) => (
                  <div
                    key={sample.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">{sample.icon}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        sample.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        sample.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sample.difficulty}
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{sample.name}</h4>
                    <p className="text-gray-600 text-sm mb-4">{sample.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {sample.requiredIntegrations.length} integrations
                      </div>
                      <button
                        onClick={() => handleCreateFromTemplate(sample)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Workflow Option */}
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Need Something Custom?</h3>
              <p className="text-gray-600 mb-6">
                Create your own workflow from scratch with our visual editor
              </p>
              <button
                onClick={() => onEditWorkflow('new')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Create Custom Workflow
              </button>
            </div>
          </div>
        ) : (
          /* Existing workflows */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <div
                key={workflow.id}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{workflow.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onToggleWorkflow(workflow.id, workflow.status === 'active' ? 'inactive' : 'active')}
                      className={`w-8 h-4 rounded-full relative transition-colors ${
                        workflow.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${
                        workflow.status === 'active' ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </button>
                    
                    <button
                      onClick={() => onDeleteWorkflow(workflow.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {workflow.description && (
                  <p className="text-gray-600 text-sm mb-4">{workflow.description}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{workflow.nodes.length} steps</span>
                  <span>{workflow.runCount} runs</span>
                </div>

                <button
                  onClick={() => onEditWorkflow(workflow.id)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  Edit Workflow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkflowsPage; 