import React, { useState } from 'react';
import { Project, ContextType } from '../types';

interface ProjectContextSectionProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

const ProjectContextSection: React.FC<ProjectContextSectionProps> = ({
  project,
  onUpdateProject
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contextValue, setContextValue] = useState(project.context || '');
  const [contextType, setContextType] = useState<ContextType>(project.contextType || 'custom');
  const [showSamples, setShowSamples] = useState(false);

  // Sample context templates
  const sampleContexts = {
    development: {
      title: 'Software Development Project',
      content: `Project Context:
- Tech Stack: React, TypeScript, Node.js
- Target Audience: Web developers
- Key Requirements: Performance, scalability, user experience
- Development Phase: MVP development
- Team Size: 3-5 developers
- Timeline: 3 months
- Key Constraints: Budget limitations, browser compatibility

Please consider these technical requirements and project constraints when providing assistance.`
    },
    business: {
      title: 'Business Strategy Project',
      content: `Business Context:
- Industry: SaaS/Technology
- Company Size: 50-100 employees
- Target Market: B2B enterprises
- Revenue Model: Subscription-based
- Key Metrics: MRR, CAC, LTV
- Current Challenges: Market expansion, customer retention
- Goals: Increase market share, optimize operations

Please provide business-focused advice considering our current market position and growth objectives.`
    },
    research: {
      title: 'Research Project',
      content: `Research Context:
- Field: [Your research field]
- Methodology: [Qualitative/Quantitative/Mixed]
- Timeline: [Research duration]
- Key Questions: [Main research questions]
- Target Audience: [Who will use this research]
- Resources Available: [Budget, tools, team]
- Expected Outcomes: [What you hope to achieve]

Please provide research-focused assistance with proper methodology and academic rigor.`
    },
    creative: {
      title: 'Creative Project',
      content: `Creative Context:
- Project Type: [Content creation, design, writing, etc.]
- Target Audience: [Age group, interests, demographics]
- Brand Voice: [Tone, style, personality]
- Key Messages: [What you want to communicate]
- Constraints: [Time, budget, platform requirements]
- Success Metrics: [Engagement, conversions, reach]

Please provide creative suggestions that align with our brand and audience.`
    },
    personal: {
      title: 'Personal Project',
      content: `Personal Context:
- Goal: [What you want to achieve]
- Background: [Your relevant experience/knowledge]
- Timeline: [When you want to complete this]
- Resources: [Time, budget, tools available]
- Challenges: [What obstacles you anticipate]
- Success Criteria: [How you'll measure success]

Please provide personalized advice considering my specific situation and goals.`
    },
    custom: {
      title: 'Custom Context',
      content: `Add your custom context here...

Consider including:
- Project objectives
- Target audience
- Key constraints
- Success criteria
- Relevant background information
- Specific requirements or preferences`
    }
  };

  const handleSave = () => {
    const updatedProject = {
      ...project,
      context: contextValue.trim() || undefined,
      contextType: contextValue.trim() ? contextType : undefined,
      updatedAt: new Date()
    };
    onUpdateProject(updatedProject);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setContextValue(project.context || '');
    setContextType(project.contextType || 'custom');
    setIsEditing(false);
    setShowSamples(false);
  };

  const handleUseSample = (type: ContextType) => {
    setContextType(type);
    setContextValue(sampleContexts[type].content);
    setShowSamples(false);
  };

  const handleClearContext = () => {
    setContextValue('');
    setContextType('custom');
    const updatedProject = {
      ...project,
      context: undefined,
      contextType: undefined,
      updatedAt: new Date()
    };
    onUpdateProject(updatedProject);
    setIsEditing(false);
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Project Context</h2>
              <p className="text-sm text-gray-600 mt-1">
                Add context that will be included in all conversations within this project
              </p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {project.context ? 'Edit Context' : 'Add Context'}
              </button>
            )}
          </div>

          {!isEditing ? (
            // Display Mode
            <div>
              {project.context ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Type:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {project.contextType || 'custom'}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {project.context}
                    </pre>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleClearContext}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Clear Context
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No context added yet</h3>
                  <p className="text-gray-600 mb-4">
                    Add project context to help AI understand your project better
                  </p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Add Context
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Context Type
                </label>
                <button
                  onClick={() => setShowSamples(!showSamples)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showSamples ? 'Hide' : 'Show'} Sample Templates
                </button>
              </div>
              
              <select
                value={contextType}
                onChange={(e) => setContextType(e.target.value as ContextType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="development">Development</option>
                <option value="business">Business</option>
                <option value="research">Research</option>
                <option value="creative">Creative</option>
                <option value="personal">Personal</option>
                <option value="custom">Custom</option>
              </select>

              {showSamples && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Sample Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(sampleContexts).map(([type, sample]) => (
                      <button
                        key={type}
                        onClick={() => handleUseSample(type as ContextType)}
                        className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-sm text-gray-900">{sample.title}</div>
                        <div className="text-xs text-gray-600 mt-1 truncate">
                          {sample.content.substring(0, 100)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Context Content
                </label>
                <textarea
                  value={contextValue}
                  onChange={(e) => setContextValue(e.target.value)}
                  placeholder="Enter project context that will be included in all conversations..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={12}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Save Context
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectContextSection; 