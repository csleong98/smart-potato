import React, { useState } from 'react';
import { Project } from '../types';

interface ProjectListItemProps {
  project: Project;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({
  project,
  onSelect,
  onDelete
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row selection
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
      className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
    >
      <div className="grid grid-cols-12 gap-4 items-center">
        {/* Project Name */}
        <div className="col-span-4 flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-semibold">
              {project.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {project.name}
            </div>
            {project.description && (
              <div className="text-xs text-gray-500 truncate">
                {project.description}
              </div>
            )}
          </div>
        </div>

        {/* Chats Count */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">
            {project.chatIds.length}
          </div>
          <div className="text-xs text-gray-500">
            chat{project.chatIds.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Memories Count */}
        <div className="col-span-2">
          <div className="text-sm font-medium text-gray-900">
            {project.memories.length}
          </div>
          <div className="text-xs text-gray-500">
            memor{project.memories.length !== 1 ? 'ies' : 'y'}
          </div>
        </div>

        {/* Last Updated */}
        <div className="col-span-3">
          <div className="text-sm text-gray-900">
            {formatDate(project.lastInteractionAt)}
          </div>
          <div className="text-xs text-gray-500">
            Created {formatDate(project.createdAt)}
          </div>
        </div>

        {/* Actions */}
        <div className="col-span-1 flex justify-end">
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
      </div>
    </div>
  );
};

export default ProjectListItem; 