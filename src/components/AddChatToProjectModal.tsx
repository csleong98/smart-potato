import React, { useState } from 'react';
import { Project } from '../types';

interface AddChatToProjectModalProps {
  projects: Project[];
  conversationId: string;
  conversationTitle: string;
  onClose: () => void;
  onAddToProject: (projectId: string, conversationIds: string[]) => void;
}

const AddChatToProjectModal: React.FC<AddChatToProjectModalProps> = ({
  projects,
  conversationId,
  conversationTitle,
  onClose,
  onAddToProject
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const handleAdd = () => {
    if (selectedProjectId) {
      onAddToProject(selectedProjectId, [conversationId]);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Chat to Project
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
            Select which project to add "<span className="font-medium">{conversationTitle}</span>" to.
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-4xl mb-4">📁</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No projects available</h4>
              <p className="text-gray-600 text-center max-w-sm">
                You haven't created any projects yet. Create a project first to organize your conversations.
              </p>
            </div>
          ) : (
            <div className="p-4">
              <div className="space-y-2">
                {projects.map((project) => (
                  <label
                    key={project.id}
                    className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedProjectId === project.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="project"
                      value={project.id}
                      checked={selectedProjectId === project.id}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-semibold">
                          {project.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {project.name}
                        </h4>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span>{project.chatIds.length} chat{project.chatIds.length !== 1 ? 's' : ''}</span>
                          <span className="mx-2">•</span>
                          <span>Updated {formatDate(project.updatedAt)}</span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-600 mt-1 truncate">
                            {project.description}
                          </p>
                        )}
                      </div>
                      {selectedProjectId === project.id && (
                        <div className="text-blue-500 flex-shrink-0">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {projects.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedProjectId}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add to Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddChatToProjectModal; 