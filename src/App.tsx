import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation, OnboardingMode, Project, Workflow, Integration, IntegrationType, Reminder } from './types';
import { AIService, MockAIService } from './services/aiService';
import Sidebar from './components/Sidebar';
import WelcomeScreen from './components/WelcomeScreen';
import ChatInterface from './components/ChatInterface';
import ProjectsPage from './components/ProjectsPage';
import ProjectView from './components/ProjectView';
import WorkflowsPage from './components/WorkflowsPage';
import IntegrationsPage from './components/IntegrationsPage';
import RemindersPage from './components/RemindersPage';
import ReminderModal from './components/ReminderModal';
import Snackbar from './components/Snackbar';

function App() {
  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<OnboardingMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
  const [createStep, setCreateStep] = useState(0);
  const [researchStep, setResearchStep] = useState(0);
  const [showThinkingProcess, setShowThinkingProcess] = useState(true);
  
  // Chat organization state
  const [isGroupedView, setIsGroupedView] = useState(false);
  const [groupedConversations, setGroupedConversations] = useState<{ [key: string]: Conversation[] }>({});
  const [isTidying, setIsTidying] = useState(false);
  
  // Projects state
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentView, setCurrentView] = useState<'chat' | 'projects' | 'project' | 'workflows' | 'integrations' | 'reminders'>('chat');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Workflows and Integrations state
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  
  // Reminders state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  
  // First-time user detection
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(() => {
    return !localStorage.getItem('smart-potato-visited');
  });
  
  // Tutorial access state
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  
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

  // Generate dynamic greeting messages
  const generateGreeting = useCallback(() => {
    const greetings = [
      "Hey there! Ready to dive into something interesting? 🥔",
      "Hi! What's on your mind today? ✨",
      "Hello! I'm here to help with whatever you need 🌟",
      "Hey! Let's explore something amazing together 🚀",
      "Hi there! What can we discover today? 💭",
      "Hello! Ready to tackle something new? 🎯",
      "Hey! I'm excited to help you out 🌈",
      "Hi! What adventure shall we embark on? 🧭",
      "Hello there! Let's make something happen 💡",
      "Hey! What's sparking your curiosity today? ⚡"
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, []);

  // Mark user as no longer first-time
  const markUserAsReturning = useCallback(() => {
    localStorage.setItem('smart-potato-visited', 'true');
    setIsFirstTimeUser(false);
  }, []);

  // Get active conversation and project
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeProject = projects.find(p => p.id === activeProjectId);

  // Create a new conversation
  const createNewConversation = useCallback(() => {
    // For first-time users, just reset state to show tutorial
    if (isFirstTimeUser) {
      if (currentView === 'project') {
        setActiveConversationId(null);
        setCurrentMode(null);
        setCreateStep(0);
        setResearchStep(0);
      } else {
        setCurrentView('chat');
        setActiveConversationId(null);
        setCurrentMode(null);
        setCreateStep(0);
        setResearchStep(0);
        setActiveProjectId(null);
      }
      return;
    }

    // For returning users, create a chat directly with greeting
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: currentView === 'project' ? activeProjectId || undefined : undefined
    };

    // Add greeting message
    const greetingMessage: Message = {
      id: uuidv4(),
      content: generateGreeting(),
      sender: 'ai',
      timestamp: new Date()
    };
    newConversation.messages = [greetingMessage];

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);

    // If we're in a project, add this conversation to the project
    if (currentView === 'project' && activeProjectId) {
      setProjects(prev => prev.map(project => {
        if (project.id === activeProjectId) {
          return {
            ...project,
            chatIds: [newConversation.id, ...project.chatIds],
            lastInteractionAt: new Date(),
            updatedAt: new Date()
          };
        }
        return project;
      }));
    }

    // Reset onboarding states
    setCurrentMode(null);
    setCreateStep(0);
    setResearchStep(0);

    // Ensure we're in the right view
    if (currentView !== 'project') {
      setCurrentView('chat');
      setActiveProjectId(null);
    }
  }, [currentView, isFirstTimeUser, activeProjectId, generateGreeting]);

  // Delete a conversation
  const deleteConversation = useCallback((conversationId: string) => {
    // Find the conversation to get its project ID before deletion
    const conversationToDelete = conversations.find(conv => conv.id === conversationId);
    
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    
    // If the conversation belonged to a project, remove it from the project's chatIds
    if (conversationToDelete?.projectId) {
      setProjects(prev => prev.map(project => {
        if (project.id === conversationToDelete.projectId) {
          return {
            ...project,
            chatIds: project.chatIds.filter(chatId => chatId !== conversationId),
            updatedAt: new Date()
          };
        }
        return project;
      }));
    }
    
    // If we're deleting the currently active conversation, go back to welcome screen
    if (activeConversationId === conversationId) {
      setActiveConversationId(null);
      setCurrentMode(null);
      setCreateStep(0);
      setResearchStep(0);
    }
  }, [activeConversationId, conversations]);

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
    
    // Don't mark user as returning yet - wait until they complete tutorial
    
    // Create new conversation for the selected mode
    const newConversation: Conversation = {
      id: uuidv4(),
      title: 'New Chat', // Always start with "New Chat"
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: activeProjectId || undefined // Add to current project if in project view
    };
    
    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);

    // If we're in a project, add this conversation to the project
    if (activeProjectId) {
      setProjects(prev => prev.map(project => {
        if (project.id === activeProjectId) {
          return {
            ...project,
            chatIds: [newConversation.id, ...project.chatIds],
            lastInteractionAt: new Date(),
            updatedAt: new Date()
          };
        }
        return project;
      }));
    }

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

    // Handle Research workflow specifically
    else if (mode === 'research') {
      // Use fixed message for research tutorial intro
      const aiMessage: Message = {
        id: uuidv4(),
        content: "Welcome! I'm Smart Potato, ready to help you master the art of effective research. Good research prompting can mean the difference between scattered results and targeted, valuable insights.\n\nWhat type of research guidance would you like?",
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(newConversation.id, aiMessage);
      setResearchStep(1); // Set to step 1 to show choice buttons
    } else {
      // For other modes, add a generic introduction
      const aiMessage: Message = {
        id: uuidv4(),
        content: "Hi! I'm Smart Potato. How can I help you today?",
        sender: 'ai',
        timestamp: new Date()
      };
      addMessage(newConversation.id, aiMessage);
    }
  }, [addMessage, aiService, activeProjectId]);

  // Handle message sending
  const handleSendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) return;

    // Mark user as returning when they send their first message
    if (isFirstTimeUser) {
      markUserAsReturning();
    }

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    addMessage(activeConversationId, userMessage);

    // Check if this is the first user message (before adding current message)
    const isFirstUserMessage = activeConversation && 
      activeConversation.messages.filter(msg => msg.sender === 'user').length === 0;

    // Get AI response
    setIsLoading(true);
    try {
      let response: string;
      let thinkingProcessContent: string | undefined;
      
      if (currentMode === 'create' && createStep === 1) {
        // Don't use AI service for createStep 1 - user should use choice buttons
        // If they type instead, just continue normally
        response = "Great! I'm here to help you create something amazing. Whether you want to build an app, write content, design something, or explore any creative idea - just let me know what's on your mind!\n\nWhat would you like to create today?";
        setCreateStep(2); // Move to normal conversation mode
      } else if (currentMode === 'research' && researchStep === 1) {
        // Don't use AI service for researchStep 1 - user should use choice buttons
        // If they type instead, just continue normally
        response = "Perfect! I'm here to help you dive deep into any topic you're curious about. Whether you need help with academic research, market analysis, fact-checking, or any other research task - just let me know what you'd like to explore!\n\nWhat would you like to research today?";
        setResearchStep(2); // Move to normal conversation mode
      } else if ((currentMode === 'create' && createStep >= 2) || 
                 (currentMode === 'research' && researchStep >= 2)) {
        // After first tutorial response, transition to natural conversation with thinking process
        const conversationMessages = activeConversation?.messages || [];
        let contextMessages = [...conversationMessages, userMessage];
        
        // Check if this conversation is in a project and include project memories
        if (activeConversation?.projectId && activeProject?.memories && activeProject.memories.length > 0) {
          const memoryContext = activeProject.memories
            .map(memory => `**${memory.title}**\n${memory.content}`)
            .join('\n\n---\n\n');
            
          const systemContextMessage: Message = {
            id: 'system-context',
            content: `You are Smart Potato AI assistant. The user is working in a project and has saved the following information as project memories. ONLY reference these actual memories, do not make up or hallucinate any information:

ACTUAL PROJECT MEMORIES:
---
${memoryContext}
---

When the user asks about their project memories or notes, reference ONLY the content above. If they ask for something not in these memories, say you don't see that specific information in their saved memories.`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          contextMessages = [systemContextMessage, ...conversationMessages, userMessage];
        }
        
        // Use natural conversation with thinking process
        const result = await aiService.sendMessageWithThinking(contextMessages, showThinkingProcess, activeProject?.context);
        response = result.response;
        thinkingProcessContent = result.thinking;
        
        // Clear the tutorial mode after natural response - user can now chat normally
        setCurrentMode(null);
        setCreateStep(0);
        setResearchStep(0);
      } else {
        const conversationMessages = activeConversation?.messages || [];
        
        // Check if this conversation is in a project and include project memories
        let contextMessages = [...conversationMessages, userMessage];
        
        if (activeConversation?.projectId && activeProject?.memories && activeProject.memories.length > 0) {
          // Create a system message with project memories as context
          const memoryContext = activeProject.memories
            .map(memory => `**${memory.title}**\n${memory.content}`)
            .join('\n\n---\n\n');
            
          const systemContextMessage: Message = {
            id: 'system-context',
            content: `You are Smart Potato AI assistant. The user is working in a project and has saved the following information as project memories. ONLY reference these actual memories, do not make up or hallucinate any information:

ACTUAL PROJECT MEMORIES:
---
${memoryContext}
---

When the user asks about their project memories or notes, reference ONLY the content above. If they ask for something not in these memories, say you don't see that specific information in their saved memories.`,
            sender: 'ai',
            timestamp: new Date()
          };
          
          contextMessages = [systemContextMessage, ...conversationMessages, userMessage];
        }
        
        const result = await aiService.sendMessageWithThinking(contextMessages, showThinkingProcess, activeProject?.context);
        response = result.response;
        
        // Store thinking process for use in AI message creation
        thinkingProcessContent = result.thinking;
      }

      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        thinkingProcess: thinkingProcessContent
      };
      addMessage(activeConversationId, aiMessage);

      // Auto-generate title after first user message and AI response
      if (isFirstUserMessage && activeConversation?.title === 'New Chat') {
        setTimeout(async () => {
          try {
            // Get the updated conversation with the new AI message
            const allMessages = [...(activeConversation?.messages || []), userMessage, aiMessage];
            const newTitle = await aiService.generateChatTitle(allMessages);
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
        }, 1000); // Small delay to ensure all messages are processed
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService, currentMode, createStep, researchStep, activeConversation, conversations, showThinkingProcess, isFirstTimeUser, markUserAsReturning, activeProject]);

  // Handle tutorial choice
  const handleTutorialChoice = useCallback(async (choice: 'tutorial' | 'continue') => {
    if (!activeConversationId) return;

    // Mark user as returning when they interact with tutorial
    if (isFirstTimeUser) {
      markUserAsReturning();
    }

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
      const conversationMessages = activeConversation?.messages || [];
      const fullHistory = [...conversationMessages, userMessage];
      
      let response: string;
      let thinkingProcessContent: string | undefined;
      
      if (showThinkingProcess) {
        // Get thinking process for onboarding responses too
        const result = await aiService.getCreateOnboardingResponseWithThinking(choiceText, 1, fullHistory);
        response = result.response;
        thinkingProcessContent = result.thinking;
      } else {
        response = await aiService.getCreateOnboardingResponse(choiceText, 1, fullHistory);
      }

      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        thinkingProcess: thinkingProcessContent
      };
      addMessage(activeConversationId, aiMessage);
      
      // After tutorial response, clear mode to enable natural conversation
      setCurrentMode(null);
      setCreateStep(0);
    } catch (error) {
      console.error('Error handling tutorial choice:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService, activeConversation?.messages, showThinkingProcess, isFirstTimeUser, markUserAsReturning]);

  // Handle research tutorial choice
  const handleResearchChoice = useCallback(async (choice: string) => {
    if (!activeConversationId) return;

    // Mark user as returning when they interact with tutorial
    if (isFirstTimeUser) {
      markUserAsReturning();
    }

    // Add user's choice as a message bubble
    const userMessage: Message = {
      id: uuidv4(),
      content: choice,
      sender: 'user',
      timestamp: new Date()
    };
    addMessage(activeConversationId, userMessage);

    setIsLoading(true);
    try {
      // Use AI service to generate response based on choice
      const conversationMessages = activeConversation?.messages || [];
      const fullHistory = [...conversationMessages, userMessage];
      
      let response: string;
      let thinkingProcessContent: string | undefined;
      
      if (showThinkingProcess) {
        // Get thinking process for onboarding responses too
        const result = await aiService.getResearchOnboardingResponseWithThinking(choice, 1, fullHistory);
        response = result.response;
        thinkingProcessContent = result.thinking;
      } else {
        response = await aiService.getResearchOnboardingResponse(choice, 1, fullHistory);
      }

      const aiMessage: Message = {
        id: uuidv4(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        thinkingProcess: thinkingProcessContent
      };
      addMessage(activeConversationId, aiMessage);
      
      // After tutorial response, clear mode to enable natural conversation
      setCurrentMode(null);
      setResearchStep(0);
    } catch (error) {
      console.error('Error handling research choice:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeConversationId, addMessage, aiService, activeConversation?.messages, showThinkingProcess, isFirstTimeUser, markUserAsReturning]);

  // Handle starting a random chat
  const handleStartChat = useCallback((initialMessage?: string) => {
    if (initialMessage) {
      // Create conversation with the initial message
      const newConversation: Conversation = {
        id: uuidv4(),
        title: 'New Chat',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: currentView === 'project' ? activeProjectId || undefined : undefined
      };

      // Add user's initial message (no greeting message)
      const userMessage: Message = {
        id: uuidv4(),
        content: initialMessage,
        sender: 'user',
        timestamp: new Date()
      };

      newConversation.messages = [userMessage];

      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversation.id);

      // If we're in a project, add this conversation to the project
      if (currentView === 'project' && activeProjectId) {
        setProjects(prev => prev.map(project => {
          if (project.id === activeProjectId) {
            return {
              ...project,
              chatIds: [newConversation.id, ...project.chatIds],
              lastInteractionAt: new Date(),
              updatedAt: new Date()
            };
          }
          return project;
        }));
      }

          // Reset onboarding states
    setCurrentMode(null);
    setCreateStep(0);
    setResearchStep(0);

      // Ensure we're in the right view
      if (currentView !== 'project') {
        setCurrentView('chat');
        setActiveProjectId(null);
      }

      // Mark as returning user if it's their first time
      if (isFirstTimeUser) {
        markUserAsReturning();
      }

      // Show loading state and get AI response to the initial message
      setIsLoading(true);
      (async () => {
        try {
          const result = await aiService.sendMessageWithThinking([userMessage], showThinkingProcess, activeProject?.context);
          const aiResponse: Message = {
            id: uuidv4(),
            content: result.response,
            sender: 'ai',
            timestamp: new Date(),
            thinkingProcess: result.thinking
          };
          
          // Add AI response to the conversation
          setConversations(prev => prev.map(conv => {
            if (conv.id === newConversation.id) {
              return {
                ...conv,
                messages: [...conv.messages, aiResponse],
                updatedAt: new Date()
              };
            }
            return conv;
          }));

          // Auto-generate title after first exchange with improved context
          setTimeout(async () => {
            try {
              const conversationMessages = [userMessage, aiResponse];
              const newTitle = await aiService.generateChatTitle(conversationMessages);
              setConversations(prev => prev.map(conv => {
                if (conv.id === newConversation.id) {
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
          }, 500); // Small delay to ensure all messages are processed
        } catch (error) {
          console.error('Error getting AI response:', error);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      createNewConversation();
    }
  }, [createNewConversation, currentView, activeProjectId, isFirstTimeUser, markUserAsReturning, aiService, showThinkingProcess, activeProject?.context]);

  // Select conversation
  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    setCurrentMode(null);
    setCreateStep(0);
    setResearchStep(0);
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

  // Update conversation title manually
  const updateConversationTitle = useCallback((newTitle: string) => {
    if (!activeConversationId) return;

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
  }, [activeConversationId]);

  // Project management functions
  const createProject = useCallback((name: string, description?: string) => {
    const newProject: Project = {
      id: uuidv4(),
      name,
      description,
      chatIds: [],
      memories: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      lastInteractionAt: new Date()
    };
    
    setProjects(prev => [newProject, ...prev]);
  }, []);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  }, []);

  const selectProject = useCallback((projectId: string) => {
    setActiveProjectId(projectId);
    setCurrentView('project');
    setActiveConversationId(null);
    setCurrentMode(null);
  }, []);

  const updateProject = useCallback((updatedProject: Project) => {
    setProjects(prev => prev.map(project => 
      project.id === updatedProject.id ? updatedProject : project
    ));
  }, []);

  const addConversationsToProject = useCallback((projectId: string, conversationIds: string[]) => {
    // Update conversations to set their projectId
    setConversations(prev => prev.map(conv => {
      if (conversationIds.includes(conv.id)) {
        return { ...conv, projectId, updatedAt: new Date() };
      }
      return conv;
    }));

    // Update project to add conversation IDs
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const newChatIds = [...project.chatIds, ...conversationIds];
        return {
          ...project,
          chatIds: newChatIds,
          lastInteractionAt: new Date(),
          updatedAt: new Date()
        };
      }
      return project;
    }));
  }, []);

  const backToProjects = useCallback(() => {
    setActiveProjectId(null);
    setCurrentView('projects');
  }, []);

  const navigateToProjects = useCallback(() => {
    setCurrentView('projects');
    setActiveConversationId(null);
    setCurrentMode(null);
  }, []);

  const navigateToChats = useCallback(() => {
    setCurrentView('chat');
    setActiveProjectId(null);
    setActiveConversationId(null);
    setCurrentMode(null);
    setCreateStep(0);
    setResearchStep(0);
  }, []);

  const navigateToReminders = useCallback(() => {
    setCurrentView('reminders');
    setActiveConversationId(null);
    setCurrentMode(null);
    setActiveProjectId(null);
    setCreateStep(0);
    setResearchStep(0);
  }, []);

  // Workflow management functions
  const navigateToWorkflows = useCallback(() => {
    setCurrentView('workflows');
    setActiveConversationId(null);
    setCurrentMode(null);
    setActiveProjectId(null);
  }, []);

  const createWorkflow = useCallback((workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt' | 'lastRun' | 'runCount'>) => {
    const newWorkflow: Workflow = {
      ...workflow,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
      runCount: 0
    };
    
    setWorkflows(prev => [newWorkflow, ...prev]);
  }, []);

  const deleteWorkflow = useCallback((workflowId: string) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== workflowId));
  }, []);

  const editWorkflow = useCallback((workflowId: string) => {
    // TODO: Implement workflow editor
    console.log('Edit workflow:', workflowId);
  }, []);

  const toggleWorkflow = useCallback((workflowId: string, status: 'active' | 'inactive') => {
    setWorkflows(prev => prev.map(workflow => 
      workflow.id === workflowId 
        ? { ...workflow, status, updatedAt: new Date() }
        : workflow
    ));
  }, []);

  // Integration management functions
  const navigateToIntegrations = useCallback(() => {
    setCurrentView('integrations');
    setActiveConversationId(null);
    setCurrentMode(null);
    setActiveProjectId(null);
  }, []);

  const connectIntegration = useCallback((type: IntegrationType, config: any) => {
    const newIntegration: Integration = {
      id: uuidv4(),
      name: getIntegrationName(type),
      type,
      status: 'connected',
      description: getIntegrationDescription(type),
      icon: getIntegrationIcon(type),
      config: {
        ...config,
        settings: {}
      },
      connectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setIntegrations(prev => [newIntegration, ...prev]);
  }, []);

  const disconnectIntegration = useCallback((integrationId: string) => {
    setIntegrations(prev => prev.filter(integration => integration.id !== integrationId));
  }, []);

  const updateIntegration = useCallback((integration: Integration) => {
    setIntegrations(prev => prev.map(i => 
      i.id === integration.id ? integration : i
    ));
  }, []);

  // Helper functions for integrations
  const getIntegrationName = (type: IntegrationType): string => {
    const names = {
      email: 'Gmail',
      calendar: 'Google Calendar',
      storage: 'Google Drive',
      notification: 'Discord Webhooks',
      document: 'Google Docs',
      database: 'Airtable',
      api: 'OpenWeather API',
      social: 'Reddit API'
    };
    return names[type] || type;
  };

  const getIntegrationDescription = (type: IntegrationType): string => {
    const descriptions = {
      email: 'Connect to Gmail for email automation',
      calendar: 'Automate calendar events and scheduling',
      storage: 'File storage and document management',
      notification: 'Send notifications to Discord channels',
      document: 'Create and edit documents automatically',
      database: 'Database operations and data storage',
      api: 'Weather data for automations',
      social: 'Monitor and post to Reddit'
    };
    return descriptions[type] || '';
  };

  const getIntegrationIcon = (type: IntegrationType): string => {
    const icons = {
      email: '📧',
      calendar: '📅',
      storage: '🗂️',
      notification: '🔔',
      document: '📄',
      database: '🗃️',
      api: '🌤️',
      social: '🤖'
    };
    return icons[type] || '🔗';
  };

  // Handle tutorial modal mode selection
  const handleTutorialModalSelection = useCallback((mode: OnboardingMode) => {
    setShowTutorialModal(false);
    // Create a new conversation with the selected tutorial mode
    handleModeSelection(mode);
  }, [handleModeSelection]);

  // Snackbar functions
  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ message, type, isVisible: true });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Reminder functions
  const handleSetReminder = useCallback(() => {
    if (!activeConversationId) return;
    setShowReminderModal(true);
  }, [activeConversationId]);



  const handleCreateReminder = useCallback(async (reminderData: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>, generateSummary?: boolean) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setReminders(prev => [newReminder, ...prev]);
    showSnackbar('Reminder set! We will remind you to come back to this conversation.', 'success');

    // If summary is requested, generate it in the chat
    if (generateSummary && activeConversationId && activeConversation) {
      // Add a system message indicating summary generation
      const summaryRequestMessage: Message = {
        id: uuidv4(),
        content: '🔔 **Generating conversation summary for your reminder...**',
        sender: 'user',
        timestamp: new Date(),
        isSystemMessage: true
      };

      // Add the request message to conversation
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.id === activeConversationId
            ? { ...conv, messages: [...conv.messages, summaryRequestMessage] }
            : conv
        )
      );

      setIsLoading(true);

      try {
        // Use the dedicated generateSummary method for clean results
        const summary = await aiService.generateSummary(activeConversation.messages, activeProject?.context);

        // Add AI response with summary
        const summaryResponseMessage: Message = {
          id: uuidv4(),
          content: `📝 **Conversation Summary:**\n\n${summary}`,
          sender: 'ai',
          timestamp: new Date(),
          isSystemMessage: true
        };

        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === activeConversationId
              ? { ...conv, messages: [...conv.messages, summaryResponseMessage] }
              : conv
          )
        );

        // Update the reminder with the generated summary
        setReminders(prev => prev.map(reminder => 
          reminder.id === newReminder.id 
            ? { ...reminder, summary, updatedAt: new Date() }
            : reminder
        ));

      } catch (error) {
        console.error('Error generating summary:', error);
        
        // Add error message
        const errorMessage: Message = {
          id: uuidv4(),
          content: '❌ Failed to generate conversation summary. Please try again later.',
          sender: 'ai',
          timestamp: new Date(),
          isSystemMessage: true
        };

        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.id === activeConversationId
              ? { ...conv, messages: [...conv.messages, errorMessage] }
              : conv
          )
        );
      } finally {
        setIsLoading(false);
      }
    }
  }, [showSnackbar, activeConversationId, activeConversation, activeProject?.context, aiService]);

  const handleUpdateReminder = useCallback((updatedReminder: Reminder) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === updatedReminder.id ? updatedReminder : reminder
    ));
  }, []);

  const handleDeleteReminder = useCallback((reminderId: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
    showSnackbar('Reminder deleted.', 'info');
  }, [showSnackbar]);

  const handleNavigateToConversation = useCallback((conversationId: string, projectId?: string) => {
    if (projectId) {
      setActiveProjectId(projectId);
      setCurrentView('project');
    } else {
      setCurrentView('chat');
      setActiveProjectId(null);
    }
    setActiveConversationId(conversationId);
    setCurrentMode(null);
    setCreateStep(0);
    setResearchStep(0);
  }, []);

  // AI-powered conversation grouping
  const groupConversationsByTopic = useCallback(async (conversations: Conversation[], includeAllChats: boolean = false): Promise<{ [key: string]: Conversation[] }> => {
    if (conversations.length <= 1) return {};

    let conversationsToGroup = conversations;
    
    // Only exclude recent chats on initial grouping, not when user manually re-tides
    if (!includeAllChats) {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      conversationsToGroup = conversations.filter(conv => {
        const isRecent = new Date(conv.createdAt) > fiveMinutesAgo;
        const hasDefaultTitle = conv.title === 'New Chat' || conv.title.startsWith('Chat ');
        return !isRecent && !hasDefaultTitle;
      });
    }

    if (conversationsToGroup.length <= 1) return {};

    try {
      // Extract titles for AI analysis
      const titles = conversationsToGroup.map(conv => conv.title);

      // Create AI prompt for intelligent grouping
      const systemPrompt = `You are an expert at organizing and categorizing chat conversations. Your task is to analyze chat titles and group them into logical, meaningful categories.

INSTRUCTIONS:
1. Group similar chat titles into logical categories (3-8 groups max)
2. Create descriptive group names that capture the essence of the conversations
3. Each group should have at least 1 conversation
4. If some conversations don't fit well into any group, put them in "Others"
5. Return ONLY a JSON object in this exact format:

{
  "Group Name 1": [0, 2, 5],
  "Group Name 2": [1, 3],
  "Others": [4, 6]
}

Where the numbers are the index positions of the titles in the original list.

EXAMPLE:
Input: ["Build React App", "Learn Python", "Debug CSS Issue", "Create Landing Page", "Fix API Error"]
Output: {
  "Development & Building": [0, 3],
  "Learning": [1],
  "Problem Solving": [2, 4]
}

Remember: Return ONLY the JSON object, no explanations or additional text.`;

      const userPrompt = `Please group these chat titles:\n${titles.map((title, i) => `${i}: ${title}`).join('\n')}`;

      // Call AI service
      const response = await aiService.sendMessage([
        { id: 'system', content: systemPrompt, sender: 'ai' as const, timestamp: new Date() },
        { id: 'user', content: userPrompt, sender: 'user' as const, timestamp: new Date() }
      ]);

      // Parse AI response
      let groupingResult: { [key: string]: number[] };
      try {
        // Extract JSON from response (in case AI adds extra text)
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        groupingResult = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.warn('Failed to parse AI grouping response:', response);
        throw parseError;
      }

      // Convert AI grouping to our format
      const groups: { [key: string]: Conversation[] } = {};
      
      Object.entries(groupingResult).forEach(([groupName, indices]) => {
        const conversations = indices
          .filter(index => index >= 0 && index < conversationsToGroup.length)
          .map(index => conversationsToGroup[index]);
        
        if (conversations.length > 0) {
          groups[groupName] = conversations;
        }
      });

      // Debug logging (only in development)
      if (process.env.NODE_ENV === 'development') {
        console.log('🤖 AI Grouping Result:', {
          inputTitles: titles,
          aiResponse: response,
          parsedGrouping: groupingResult,
          finalGroups: Object.keys(groups).map(key => `${key} (${groups[key].length})`)
        });
      }

      return groups;

    } catch (error) {
      console.error('AI grouping failed, falling back to simple grouping:', error);
      
      // Fallback to basic grouping if AI fails
      const groups: { [key: string]: Conversation[] } = {};
      
      // Simple keyword-based fallback
      const keywordGroups = {
        'Development': ['build', 'create', 'develop', 'code', 'app', 'website', 'react', 'python', 'javascript', 'api'],
        'Learning': ['learn', 'tutorial', 'guide', 'explain', 'understand', 'how'],
        'Problem Solving': ['debug', 'fix', 'error', 'issue', 'problem', 'help', 'solve'],
        'Design': ['design', 'ui', 'ux', 'style', 'layout']
      };

      const usedConversations = new Set<string>();

      Object.entries(keywordGroups).forEach(([groupName, keywords]) => {
        const matching = conversationsToGroup.filter(conv => {
          if (usedConversations.has(conv.id)) return false;
          const title = conv.title.toLowerCase();
          return keywords.some(keyword => title.includes(keyword));
        });

        if (matching.length > 0) {
          groups[groupName] = matching;
          matching.forEach(conv => usedConversations.add(conv.id));
        }
      });

      // Put remaining in Others
      const remaining = conversationsToGroup.filter(conv => !usedConversations.has(conv.id));
      if (remaining.length > 0) {
        groups['Others'] = remaining;
      }

      return groups;
    }
  }, [aiService]);

  // Handle tidy chats functionality
  const handleTidyChats = useCallback(async () => {
    if (conversations.length <= 1 || isTidying) return;

    setIsTidying(true);

    try {
      // Include all chats if already in grouped view, otherwise exclude recent ones
      const includeAllChats = isGroupedView;
      const groups = await groupConversationsByTopic(conversations, includeAllChats);
      setGroupedConversations(groups);
      setIsGroupedView(true);
      
      const groupCount = Object.keys(groups).length;
      const message = includeAllChats 
        ? `Regrouped all ${conversations.length} chats into ${groupCount} groups`
        : `Organized ${conversations.length} chats into ${groupCount} groups`;
      showSnackbar(message, 'success');
    } catch (error) {
      console.error('Error organizing chats:', error);
      showSnackbar('Failed to organize chats. Please try again.', 'error');
    } finally {
      setIsTidying(false);
    }
  }, [conversations, groupConversationsByTopic, showSnackbar, isGroupedView, isTidying]);

  // Handle view reset (can be called from elsewhere if needed)
  const handleResetView = useCallback(() => {
    setIsGroupedView(false);
    setGroupedConversations({});
    showSnackbar('Switched back to list view', 'info');
  }, [showSnackbar]);

  // Update grouped conversations when conversations change (if in grouped view)
  useEffect(() => {
    if (isGroupedView && conversations.length > 0) {
      // When auto-updating groups, include all chats (like a re-tidy)
      const updateGroups = async () => {
        try {
          const groups = await groupConversationsByTopic(conversations, true);
          setGroupedConversations(groups);
        } catch (error) {
          console.error('Error updating groups:', error);
        }
      };
      updateGroups();
    }
  }, [conversations, isGroupedView, groupConversationsByTopic]);

  // Determine what to show in the main area  
  const shouldShowTutorial = isFirstTimeUser && currentView === 'chat' && !activeConversationId;
  const showWelcome = currentView === 'chat' && !activeConversationId;
  const showChat = (currentView === 'chat' || currentView === 'project') && activeConversationId && activeConversation;
  const showProjects = currentView === 'projects';
  const showProjectView = currentView === 'project' && activeProject && !activeConversationId;
  const showReminders = currentView === 'reminders';

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
        onNavigateToProjects={navigateToProjects}
        onNavigateToChats={navigateToChats}
        onNavigateToWorkflows={navigateToWorkflows}
        onNavigateToIntegrations={navigateToIntegrations}
        onNavigateToReminders={navigateToReminders}
        currentView={currentView}
        onTidyChats={handleTidyChats}
        onUntidyChats={handleResetView}
        isGroupedView={isGroupedView}
        groupedConversations={groupedConversations}
        isTidying={isTidying}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {(shouldShowTutorial || showWelcome) && (
          <WelcomeScreen
            onSelectMode={handleModeSelection}
            onStartChat={handleStartChat}
            isFirstTime={isFirstTimeUser}
          />
        )}

        {showProjects && (
          <ProjectsPage
            projects={projects}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
            onSelectProject={selectProject}
          />
        )}

        {showProjectView && activeProject && (
          <ProjectView
            project={activeProject}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={deleteConversation}
            onNewConversation={createNewConversation}
            onBackToProjects={backToProjects}
            onUpdateProject={updateProject}
            onSelectMode={handleModeSelection}
            onAddConversationsToProject={addConversationsToProject}
            isFirstTimeUser={isFirstTimeUser}
          />
        )}

        {currentView === 'workflows' && (
          <WorkflowsPage
            workflows={workflows}
            integrations={integrations}
            onCreateWorkflow={createWorkflow}
            onDeleteWorkflow={deleteWorkflow}
            onEditWorkflow={editWorkflow}
            onToggleWorkflow={toggleWorkflow}
            onNavigateToIntegrations={navigateToIntegrations}
          />
        )}

        {currentView === 'integrations' && (
          <IntegrationsPage
            integrations={integrations}
            onConnectIntegration={connectIntegration}
            onDisconnectIntegration={disconnectIntegration}
            onUpdateIntegration={updateIntegration}
          />
        )}

        {showReminders && (
          <RemindersPage
            reminders={reminders}
            onUpdateReminder={handleUpdateReminder}
            onDeleteReminder={handleDeleteReminder}
            onNavigateToConversation={handleNavigateToConversation}
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
            showResearchChoices={currentMode === 'research' && researchStep === 1}
            onResearchChoice={handleResearchChoice}
            showThinkingProcess={showThinkingProcess}
            onToggleThinkingProcess={setShowThinkingProcess}

            onSetReminder={handleSetReminder}
            projects={projects}
            onAddToProject={addConversationsToProject}
            onUpdateTitle={updateConversationTitle}
            placeholder={
              currentMode === 'create' && createStep === 1 
                ? "Type your choice or continue normally..."
                : currentMode === 'research' && researchStep === 1
                ? "Choose research guidance or continue normally..."
                : "Write your message here"
            }
          />
        )}
      </div>

      {/* Tutorial Access Modal */}
      {showTutorialModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Choose Tutorial</h3>
            <p className="text-gray-600 mb-6">What would you like to learn about?</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleTutorialModalSelection('create')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-left"
              >
                <div className="font-medium">Create something</div>
                <div className="text-sm text-blue-100">Learn effective prompting for building projects</div>
              </button>
              
              <button
                onClick={() => handleTutorialModalSelection('research')}
                className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors duration-200 text-left"
              >
                <div className="font-medium">Research about a topic</div>
                <div className="text-sm text-green-100">Master research techniques and information gathering</div>
              </button>
            </div>
            
            <button
              onClick={() => setShowTutorialModal(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && activeConversation && (
        <ReminderModal
          conversation={activeConversation}
          projectName={activeProject?.name}
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          onCreateReminder={handleCreateReminder}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
    </div>
  );
}

export default App;
