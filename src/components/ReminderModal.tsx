import React, { useState, useEffect } from 'react';
import { Conversation, Reminder } from '../types';

interface ReminderModalProps {
  conversation: Conversation;
  projectName?: string;
  isOpen: boolean;
  onClose: () => void;
  onCreateReminder: (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>, generateSummary?: boolean) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({
  conversation,
  projectName,
  isOpen,
  onClose,
  onCreateReminder
}) => {
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [message, setMessage] = useState('');
  const [includeSummary, setIncludeSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date/time when modal opens
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Set default to tomorrow at 9 AM
      tomorrow.setHours(9, 0, 0, 0);
      
      const dateStr = tomorrow.toISOString().split('T')[0];
      const timeStr = '09:00';
      
      setReminderDate(dateStr);
      setReminderTime(timeStr);
      setMessage('');
      setIncludeSummary(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!reminderDate || !reminderTime) return;

    // Combine date and time
    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    
    // Check if the date is in the future
    if (reminderDateTime <= new Date()) {
      alert('Please select a future date and time.');
      return;
    }

    setIsSubmitting(true);

    try {
      const reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'> = {
        conversationId: conversation.id,
        conversationTitle: conversation.title,
        projectId: conversation.projectId,
        projectName,
        reminderDate: reminderDateTime,
        message: message.trim() || undefined,
        summary: undefined, // Summary will be generated in chat if requested
        status: 'pending'
      };

      onCreateReminder(reminderData, includeSummary); // Pass includeSummary flag
      onClose();
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('Failed to create reminder. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Set Reminder</h3>
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
            Set a reminder to come back to: <span className="font-medium">{conversation.title}</span>
            {projectName && <span className="text-gray-500"> (in {projectName})</span>}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Date and Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Date
              </label>
              <input
                type="date"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Optional Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note about what you want to work on..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Conversation Summary Option */}
          {conversation.messages.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeSummary"
                  checked={includeSummary}
                  onChange={(e) => setIncludeSummary(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="includeSummary" className="text-sm font-medium text-gray-700">
                  Include conversation summary
                </label>
              </div>

              {includeSummary && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Smart Potato will generate a summary of this conversation in the chat after setting the reminder.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              {reminderDate && reminderTime && (
                <>Reminder set for {new Date(`${reminderDate}T${reminderTime}`).toLocaleDateString()} at {reminderTime}</>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!reminderDate || !reminderTime || isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Setting Reminder...
                  </>
                ) : (
                  'Set Reminder'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal; 