import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project, ProjectMemory } from '../types';
import MemoryItem from './MemoryItem';

interface ProjectMemorySectionProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

const ProjectMemorySection: React.FC<ProjectMemorySectionProps> = ({
  project,
  onUpdateProject
}) => {
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemoryTitle, setNewMemoryTitle] = useState('');
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [isAddingMemory, setIsAddingMemory] = useState(false);

  const handleAddMemory = async () => {
    if (!newMemoryTitle.trim() || !newMemoryContent.trim()) return;

    setIsAddingMemory(true);
    try {
      const newMemory: ProjectMemory = {
        id: uuidv4(),
        title: newMemoryTitle.trim(),
        content: newMemoryContent.trim(),
        source: 'user-created',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedProject: Project = {
        ...project,
        memories: [newMemory, ...project.memories],
        updatedAt: new Date()
      };

      onUpdateProject(updatedProject);
      
      // Reset form
      setNewMemoryTitle('');
      setNewMemoryContent('');
      setShowAddMemory(false);
    } catch (error) {
      console.error('Error adding memory:', error);
    } finally {
      setIsAddingMemory(false);
    }
  };

  const handleUpdateMemory = (updatedMemory: ProjectMemory) => {
    const updatedProject: Project = {
      ...project,
      memories: project.memories.map(memory => 
        memory.id === updatedMemory.id ? updatedMemory : memory
      ),
      updatedAt: new Date()
    };
    
    onUpdateProject(updatedProject);
  };

  const handleDeleteMemory = (memoryId: string) => {
    const updatedProject: Project = {
      ...project,
      memories: project.memories.filter(memory => memory.id !== memoryId),
      updatedAt: new Date()
    };
    
    onUpdateProject(updatedProject);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Project Memory</h2>
            <p className="text-gray-600 text-sm mt-1">
              Store and manage knowledge gathered from conversations in this project
            </p>
          </div>
          
          <button
            onClick={() => setShowAddMemory(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Memory
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Add Memory Form */}
        {showAddMemory && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Memory</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="memory-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="memory-title"
                  type="text"
                  value={newMemoryTitle}
                  onChange={(e) => setNewMemoryTitle(e.target.value)}
                  placeholder="Brief title for this memory..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={200}
                />
              </div>
              
              <div>
                <label htmlFor="memory-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  id="memory-content"
                  value={newMemoryContent}
                  onChange={(e) => setNewMemoryContent(e.target.value)}
                  placeholder="Write the memory content here. You can use markdown formatting..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAddMemory(false);
                  setNewMemoryTitle('');
                  setNewMemoryContent('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                disabled={isAddingMemory}
              >
                Cancel
              </button>
              <button
                onClick={handleAddMemory}
                disabled={!newMemoryTitle.trim() || !newMemoryContent.trim() || isAddingMemory}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium"
              >
                {isAddingMemory ? 'Adding...' : 'Add Memory'}
              </button>
            </div>
          </div>
        )}

        {/* Memories List */}
        {project.memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧠</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No memories yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Start building your project's knowledge base by adding memories from conversations or your own insights.
            </p>
            {!showAddMemory && (
              <button
                onClick={() => setShowAddMemory(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Add Your First Memory
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {project.memories.map((memory) => (
              <MemoryItem
                key={memory.id}
                memory={memory}
                onUpdate={handleUpdateMemory}
                onDelete={handleDeleteMemory}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMemorySection; 