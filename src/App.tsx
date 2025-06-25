import React, { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, OnboardingMode } from './types';
import { MockAIService } from './services/aiService';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<OnboardingMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  
  // AI Service instance (memoized to prevent recreation on every render)
  const aiService = useMemo(() => new MockAIService(), []);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Create a new conversation (now goes to onboarding screen)
  const createNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setCurrentMode(null);
    setBuildStep(0);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    // If we're deleting the currently active conversation, go back to welcome screen
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
      setCurrentMode(null);
      setBuildStep(0);
    }
  }, [activeConversationId]);

  // Add message to conversation
  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        return {
          ...conv,
          messages: updatedMessages,
          title: updatedMessages.length === 1 ? message.content.slice(0, 50) + '...' : conv.title,
          updatedAt: new Date()
        };
      }
      return conv;
    }));
  }, []);

  // Handle onboarding mode selection
  const handleModeSelection = useCallback(async (mode: OnboardingMode) => {
    setCurrentMode(mode);
    
    // Create new conversation for the selected mode
    const newConversation: Conversation = {
      id: uuidv4(),
      title: mode ? `${mode.charAt(0).toUpperCase() + mode.slice(1)} Session` : 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);

    // Handle Build workflow specifically
    if (mode === 'build') {
      setIsLoading(true);
      try {
        const response = await aiService.getBuildOnboardingResponse('', 0);
        const aiMessage: Message = {
          id: uuidv4(),
          content: response,
          sender: 'ai',
          timestamp: new Date()
        };
        addMessage(newConversation.id, aiMessage);
        setBuildStep(1);
      } catch (error) {
        console.error('Error in build onboarding:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // For other modes, add a generic introduction
      const introMessages = {
        create: "Hi! I'm Smart Potato. I'd love to help you create something amazing! What would you like to build today?",
        search: "Hello! I'm Smart Potato. I can help you search for information on the web. What would you like to know about?",
        research: "Welcome! I'm Smart Potato. I'm here to help you dive deep into any topic you're curious about. What would you like to research?"
      };

      const aiMessage: Message = {
        id: uuidv4(),
        content: introMessages[mode as keyof typeof introMessages] || "Hi! I'm Smart Potato. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(newConversation.id, aiMessage);
    }
  }, [addMessage, aiService]);

  // Handle message sending
  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    addMessage(activeConversationId, userMessage);

    // Get AI response
    setIsLoading(true);
    try {
      let response: string;
      
      if (currentMode === 'build' && buildStep <= 2) {
        response = await aiService.getBuildOnboardingResponse(content, buildStep);
        setBuildStep(prev => prev + 1);
      } else {
        const conversationMessages = activeConversation?.messages || [];
        response = await aiService.sendMessage([...conversationMessages, userMessage]);
      }

      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(activeConversationId, aiMessage);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService, currentMode, buildStep, activeConversation]);

  // Handle starting a random chat
  const handleStartChat = useCallback(() => {
    createNewConversation();
  }, [createNewConversation]);

  // Select conversation
  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setCurrentMode(null);
    setBuildStep(0);
  }, []);

  // Determine what to show in the main area
  const showWelcome = !activeConversationId;
  const showChat = activeConversationId && activeConversation;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {showWelcome && (
          <WelcomeScreen
            onSelectMode={handleModeSelection}
            onStartChat={handleStartChat}
          />
        )}

        {showChat && (
          <ChatInterface
            messages={activeConversation.messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            placeholder={
              currentMode === 'build' 
                ? buildStep === 1 
                  ? "What kind of project are you trying to build?"
                  : "Continue the conversation..."
                : "Write your message here"
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;
