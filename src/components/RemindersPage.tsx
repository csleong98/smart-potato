import React, { useState } from 'react';
import { Reminder } from '../types';

interface RemindersPageProps {
  reminders: Reminder[];
  onUpdateReminder: (reminder: Reminder) => void;
  onDeleteReminder: (reminderId: string) => void;
  onNavigateToConversation: (conversationId: string, projectId?: string) => void;
}

const RemindersPage: React.FC<RemindersPageProps> = ({
  reminders,
  onUpdateReminder,
  onDeleteReminder,
  onNavigateToConversation
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'created'>('date');

  // Filter and sort reminders
  const filteredReminders = reminders
    .filter(reminder => filter === 'all' || reminder.status === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.reminderDate).getTime() - new Date(b.reminderDate).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Separate overdue reminders
  const now = new Date();
  const overdueReminders = filteredReminders.filter(
    reminder => reminder.status === 'pending' && new Date(reminder.reminderDate) < now
  );
  const upcomingReminders = filteredReminders.filter(
    reminder => reminder.status !== 'pending' || new Date(reminder.reminderDate) >= now
  );

  const handleMarkCompleted = (reminder: Reminder) => {
    onUpdateReminder({
      ...reminder,
      status: 'completed',
      updatedAt: new Date()
    });
  };

  const handleMarkPending = (reminder: Reminder) => {
    onUpdateReminder({
      ...reminder,
      status: 'pending',
      updatedAt: new Date()
    });
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMs < 0) {
      const pastDays = Math.abs(diffInDays);
      if (pastDays === 0) return 'Today (overdue)';
      if (pastDays === 1) return 'Yesterday (overdue)';
      return `${pastDays} days ago (overdue)`;
    }
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `In ${diffInDays} days`;
    
    const weeks = Math.floor(diffInDays / 7);
    if (weeks === 1) return 'In 1 week';
    if (weeks < 4) return `In ${weeks} weeks`;
    
    const months = Math.floor(diffInDays / 30);
    if (months === 1) return 'In 1 month';
    return `In ${months} months`;
  };

  const ReminderCard: React.FC<{ reminder: Reminder; isOverdue?: boolean }> = ({ 
    reminder, 
    isOverdue = false 
  }) => (
    <div className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
      isOverdue ? 'border-red-300 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center space-x-2 mb-2">
            <button
              onClick={() => onNavigateToConversation(reminder.conversationId, reminder.projectId)}
              className="text-blue-600 hover:text-blue-800 font-medium truncate"
            >
              {reminder.conversationTitle}
            </button>
            {reminder.projectName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {reminder.projectName}
              </span>
            )}
          </div>

          {/* Date */}
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDateTime(reminder.reminderDate)}
            </span>
            <span className={`text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
              {formatRelativeTime(reminder.reminderDate)}
            </span>
          </div>

          {/* Message */}
          {reminder.message && (
            <p className="text-sm text-gray-700 mb-2 italic">"{reminder.message}"</p>
          )}

          {/* Summary */}
          {reminder.summary && (
            <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-2">
              <h4 className="text-xs font-medium text-gray-700 mb-1">Conversation Summary:</h4>
              <p className="text-xs text-gray-600 line-clamp-3">{reminder.summary}</p>
            </div>
          )}

          {/* Status */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              reminder.status === 'completed' 
                ? 'bg-green-100 text-green-800'
                : reminder.status === 'cancelled'
                ? 'bg-gray-100 text-gray-800'
                : isOverdue
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {reminder.status === 'completed' ? 'Completed' :
               reminder.status === 'cancelled' ? 'Cancelled' :
               isOverdue ? 'Overdue' : 'Pending'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {reminder.status === 'pending' && (
            <button
              onClick={() => handleMarkCompleted(reminder)}
              className="text-green-600 hover:text-green-800 p-1"
              title="Mark as completed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
          
          {reminder.status === 'completed' && (
            <button
              onClick={() => handleMarkPending(reminder)}
              className="text-yellow-600 hover:text-yellow-800 p-1"
              title="Mark as pending"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDeleteReminder(reminder.id)}
            className="text-red-600 hover:text-red-800 p-1"
            title="Delete reminder"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Reminders</h1>
          <p className="text-gray-600">
            Manage your conversation reminders and stay on top of important discussions.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'pending' | 'completed')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All reminders</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'created')}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Reminder date</option>
                <option value="created">Created date</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {filteredReminders.length} reminder{filteredReminders.length !== 1 ? 's' : ''}
            {overdueReminders.length > 0 && (
              <span className="text-red-600 font-medium ml-2">
                ({overdueReminders.length} overdue)
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        {filteredReminders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-4xl mb-4">🔔</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reminders found</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "You haven't set any reminders yet. Set a reminder from any conversation to get started."
                : `No ${filter} reminders found. Try adjusting your filter.`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overdue Reminders */}
            {overdueReminders.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-red-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Overdue ({overdueReminders.length})
                </h2>
                <div className="space-y-3">
                  {overdueReminders.map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} isOverdue={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Reminders */}
            {upcomingReminders.length > 0 && (
              <div>
                {overdueReminders.length > 0 && (
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {filter === 'completed' ? 'Completed' : 'Upcoming'} ({upcomingReminders.length})
                  </h2>
                )}
                <div className="space-y-3">
                  {upcomingReminders.map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RemindersPage; 