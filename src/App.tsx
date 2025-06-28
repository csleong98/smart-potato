import React, { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, OnboardingMode } from './types';
import { AIService, MockAIService } from './services/aiService';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';

function App() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<OnboardingMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [createStep, setCreateStep] = useState(0);
  
  // AI Service instance (memoized to prevent recreation on every render)
  const aiService = useMemo(() => {
    const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    
    if (apiKey && apiKey !== 'your_api_key_here') {
      console.log('Using OpenRouter API with DeepSeek R1 (Free)');
      return new AIService(apiKey);
    } else {
      // Fallback to mock service if no API key is configured
      console.warn('No API key found. Using mock AI service. Set REACT_APP_OPENROUTER_API_KEY in your .env file.');
      return new MockAIService();
    }
  }, []);

  // Get active conversation
  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Create a new conversation (now goes to onboarding screen)
  const createNewConversation = useCallback(() => {
    setActiveConversationId(null);
    setCurrentMode(null);
    setBuildStep(0);
    setCreateStep(0);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    // If we're deleting the currently active conversation, go back to welcome screen
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
      setCurrentMode(null);
      setBuildStep(0);
      setCreateStep(0);
    }
  }, [activeConversationId]);

  // Handle deleting the active conversation
  const handleDeleteActiveConversation = useCallback(() => {
    if (activeConversationId) {
      deleteConversation(activeConversationId);
    }
  }, [activeConversationId, deleteConversation]);

  // Add message to conversation
  const addMessage = useCallback((conversationId: string, message: Message) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const updatedMessages = [...conv.messages, message];
        return {
          ...conv,
          messages: updatedMessages,
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
      title: 'New Chat', // Always start with "New Chat"
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);

    // Handle Create something specifically
    if (mode === 'create') {
      // Use fixed message instead of AI service
      const aiMessage: Message = {
        id: uuidv4(),
        content: "Before we start, do you want to learn how to be good at prompting for building projects? Learning the ways of prompting is not only about specificity but also being organised.\n\nYou can choose to go through a tutorial with me or ignore this message and type in anything to continue.",
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(newConversation.id, aiMessage);
      setCreateStep(1); // Set to step 1 to show choice buttons
    }
    // Handle Build workflow specifically
    else if (mode === 'build') {
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

    // Check if this is the first user message and auto-generate title
    const conversation = conversations.find(c => c.id === activeConversationId);
    const isFirstUserMessage = conversation && 
      conversation.messages.filter(msg => msg.sender === 'user').length === 0;

    // Get AI response
    setIsLoading(true);
    try {
      let response: string;
      
      if (currentMode === 'create' && createStep === 1) {
        // Don't use AI service for createStep 1 - user should use choice buttons
        // If they type instead, just continue normally
        response = "Great! I'm here to help you create something amazing. Whether you want to build an app, write content, design something, or explore any creative idea - just let me know what's on your mind!\n\nWhat would you like to create today?";
        setCreateStep(2); // Move to normal conversation mode
      } else if (currentMode === 'build' && buildStep <= 2) {
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

      // Auto-generate title after first user message
      if (isFirstUserMessage) {
        setTimeout(async () => {
          try {
            const newTitle = await aiService.generateChatTitle([userMessage]);
            setConversations(prev => prev.map(conv => {
              if (conv.id === activeConversationId) {
                return {
                  ...conv,
                  title: newTitle,
                  updatedAt: new Date()
                };
              }
              return conv;
            }));
          } catch (error) {
            console.error('Error auto-generating title:', error);
          }
        }, 100); // Small delay to ensure UI updates smoothly
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService, currentMode, createStep, buildStep, activeConversation, conversations]);

  // Handle tutorial choice
  const handleTutorialChoice = useCallback(async (choice: 'tutorial' | 'continue') => {
    if (!activeConversationId) return;

    // Add user's choice as a message bubble
    const choiceText = choice === 'tutorial' ? "Yes, teach me prompting" : "No, continue normally";
    const userMessage: Message = {
      id: uuidv4(),
      content: choiceText,
      sender: 'user',
      timestamp: new Date()
    };
    addMessage(activeConversationId, userMessage);

    setIsLoading(true);
    try {
      // Use AI service to generate response based on choice
      const response = await aiService.getCreateOnboardingResponse(choiceText, 1);

      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(activeConversationId, aiMessage);
      setCreateStep(2); // Move to normal conversation mode
    } catch (error) {
      console.error('Error handling tutorial choice:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService]);

  // Handle starting a random chat
  const handleStartChat = useCallback(() => {
    createNewConversation();
  }, [createNewConversation]);

  // Select conversation
  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setCurrentMode(null);
    setBuildStep(0);
    setCreateStep(0);
  }, []);

  // Generate AI title for conversation
  const generateTitle = useCallback(async () => {
    if (!activeConversationId || !activeConversation || activeConversation.messages.length === 0) {
      return;
    }

    setIsGeneratingTitle(true);
    try {
      const newTitle = await aiService.generateChatTitle(activeConversation.messages);
      
      // Update the conversation title
      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            title: newTitle,
            updatedAt: new Date()
          };
        }
        return conv;
      }));
    } catch (error) {
      console.error('Error generating title:', error);
    } finally {
      setIsGeneratingTitle(false);
    }
  }, [activeConversationId, activeConversation, aiService]);

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
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            onDeleteChat={handleDeleteActiveConversation}
            onGenerateTitle={generateTitle}
            isGeneratingTitle={isGeneratingTitle}
            isLoading={isLoading}
            showTutorialChoices={currentMode === 'create' && createStep === 1}
            onTutorialChoice={handleTutorialChoice}
            placeholder={
              currentMode === 'create' 
                ? createStep === 1 
                  ? "Type your choice or continue normally..."
                  : "Write your message here"
                : currentMode === 'build' 
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
