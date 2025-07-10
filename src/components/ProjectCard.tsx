import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelect,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card selection
    if (showDeleteConfirm) {
      onDelete(project.id);
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      // Auto-hide confirmation after 3 seconds
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => onSelect(project.id)}
      className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {project.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
            </div>
          </div>
          
          {/* Delete Button */}
          <button
            onClick={handleDeleteClick}
            className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-100 ${
              showDeleteConfirm ? 'opacity-100 bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-600'
            }`}
            title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete project'}
          >
            {showDeleteConfirm ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {project.chatIds.length}
            </div>
            <div className="text-xs text-gray-500">
              Chat{project.chatIds.length !== 1 ? 's' : ''}
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {project.memories.length}
            </div>
            <div className="text-xs text-gray-500">
              Memor{project.memories.length !== 1 ? 'ies' : 'y'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-100">
          <span>Created {formatDate(project.createdAt)}</span>
          <span>Updated {formatDate(project.lastInteractionAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard; 