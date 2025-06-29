import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ProjectMemory } from '../types';

interface MemoryItemProps {
  memory: ProjectMemory;
  onUpdate: (memory: ProjectMemory) => void;
  onDelete: (memoryId: string) => void;
}

const MemoryItem: React.FC<MemoryItemProps> = ({
  memory,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(memory.title);
  const [editContent, setEditContent] = useState(memory.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    setIsSaving(true);
    try {
      const updatedMemory: ProjectMemory = {
        ...memory,
        title: editTitle.trim(),
        content: editContent.trim(),
        updatedAt: new Date()
      };

      onUpdate(updatedMemory);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating memory:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(memory.title);
    setEditContent(memory.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(memory.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'auto-summary':
        return '🤖';
      case 'user-created':
        return '✍️';
      default:
        return '📝';
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'auto-summary':
        return 'Auto-generated';
      case 'user-created':
        return 'User created';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
      {isEditing ? (
        /* Edit Mode */
        <div className="space-y-4">
          <div>
            <label htmlFor={`edit-title-${memory.id}`} className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id={`edit-title-${memory.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={200}
            />
          </div>
          
          <div>
            <label htmlFor={`edit-content-${memory.id}`} className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id={`edit-content-${memory.id}`}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editTitle.trim() || !editContent.trim() || isSaving}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      ) : (
        /* View Mode */
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {memory.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <span className="mr-1">{getSourceIcon(memory.source)}</span>
                  {getSourceLabel(memory.source)}
                </span>
                <span>Created {formatDate(memory.createdAt)}</span>
                {memory.updatedAt.getTime() !== memory.createdAt.getTime() && (
                  <span>Updated {formatDate(memory.updatedAt)}</span>
                )}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit memory"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className={`p-2 rounded-lg transition-colors ${
                  showDeleteConfirm 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                }`}
                title={showDeleteConfirm ? 'Click again to confirm deletion' : 'Delete memory'}
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

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 mt-4 first:mt-0" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0" {...props} />,
                p: ({node, ...props}) => <p className="mb-3 last:mb-0 text-gray-700 leading-relaxed" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1 text-gray-700" {...props} />,
                li: ({node, ...props}) => <li className="ml-2" {...props} />,
                code: ({node, inline, className, children, ...props}: any) => 
                  inline ? (
                    <code className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-800 text-xs font-mono" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block px-3 py-2 rounded-md bg-gray-100 text-gray-800 text-xs font-mono overflow-x-auto" {...props}>
                      {children}
                    </code>
                  ),
                pre: ({node, ...props}) => (
                  <pre className="mb-3 p-3 rounded-md bg-gray-100 overflow-x-auto" {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-3 border-gray-300 pl-3 mb-3 italic text-gray-600" {...props} />
                ),
                a: ({node, ...props}) => (
                  <a className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer" {...props} />
                ),
              }}
            >
              {memory.content}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryItem; 