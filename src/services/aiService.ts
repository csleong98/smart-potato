import { Message } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-r1:free';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Enhanced onboarding with strict constraints and structure
  async getBuildOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    const buildPrompts = {
      0: `You are Smart Potato, an AI assistant that teaches effective prompting for building applications.

STRICT CONSTRAINTS:
- Keep response under 3 sentences
- ALWAYS end with exactly this question: "What kind of project would you like to build?"
- Use friendly, encouraging tone
- Mention you'll guide them through 3 steps

REQUIRED FORMAT:
[Brief intro] + [Value proposition] + [The exact question above]`,

      1: `You are Smart Potato, an expert in teaching effective prompting for software building and development.

The user has chosen: "${userAnswer}"

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

IF they want the tutorial (contains "yes", "teach", "tutorial", etc.):

YOU MUST ALWAYS INCLUDE ALL OF THE FOLLOWING:
1. Brief encouraging intro (1 sentence)
2. EXACTLY 3-4 principles 
3. For EACH principle: MANDATORY ❌ BAD and ✅ GOOD prompt examples
4. A complete copyable template at the end
5. Closing question about their project

STRICT FORMAT REQUIREMENT:
**[Principle Name]**
❌ *Bad:* "[specific bad example]"
✅ *Good:* "[detailed good example with tech stack]"

MANDATORY TEMPLATE SECTION:
**Example Template You Can Copy:**
\`\`\`
[Actual template they can use]
\`\`\`

IF they want to continue normally (contains "no", "continue", "normally", etc.):
- Provide encouraging creative assistance
- Ask what they'd like to create

ABSOLUTE REQUIREMENTS:
- NEVER skip the BAD vs GOOD examples
- ALWAYS include the copyable template with backticks
- Focus on SOFTWARE BUILDING specifically
- Use markdown formatting with ** for bold and ❌ ✅ symbols
- Template MUST be in code block format`,

      2: `You are Smart Potato providing a concrete prompting example. User wants: "${userAnswer}" with details: "${userAnswer}"

STRICT CONSTRAINTS:
- Show BAD vs GOOD prompt example
- Keep each example under 2 lines
- End with: "Try this approach in your next conversation!"

REQUIRED FORMAT:
❌ BAD PROMPT: [Short vague example]

✅ GOOD PROMPT: [Detailed structured example]

The difference? Specificity and structure. Try this approach in your next conversation!`
    };

    const systemPrompt = buildPrompts[step as keyof typeof buildPrompts];
    if (!systemPrompt) return 'Thank you for completing the prompting tutorial!';

    // Use conversation history if available, otherwise create new message structure
    if (conversationHistory && conversationHistory.length > 0) {
      // Add system prompt and use full conversation history for context
      const messages: Message[] = [
        {
          id: 'system',
          content: systemPrompt,
          sender: 'ai',
          timestamp: new Date()
        },
        ...conversationHistory
      ];
      return this.sendMessage(messages);
    } else {
      // Enhanced message structure with system constraints
      const messages: Message[] = [
        {
          id: 'system',
          content: systemPrompt,
          sender: 'ai',
          timestamp: new Date()
        }
      ];

      // Only add user input for steps that need it
      if (step > 0 && userAnswer.trim()) {
        messages.push({
          id: 'user-input',
          content: userAnswer,
          sender: 'user',
          timestamp: new Date()
        });
      }

      return this.sendMessage(messages);
    }
  }

  // Create onboarding with tutorial choice
  async getCreateOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    const createPrompts = {
      0: `You are Smart Potato, an AI assistant that helps with creative projects.

Your response MUST be EXACTLY this message:

"Before we start, do you want to learn how to be good at prompting for building projects? Learning the ways of prompting is not only about specificity but also being organised.

You can choose to go through a tutorial with me or ignore this message and type in anything to continue."

NO VARIATIONS ALLOWED - use these exact words.`,

      1: `You are Smart Potato, an expert in teaching effective prompting for software building and development.

The user has chosen: "${userAnswer}"

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

IF they want the tutorial (contains "yes", "teach", "tutorial", etc.):

YOU MUST ALWAYS INCLUDE ALL OF THE FOLLOWING:
1. Brief encouraging intro (1 sentence)
2. EXACTLY 3-4 principles 
3. For EACH principle: MANDATORY ❌ BAD and ✅ GOOD prompt examples
4. A complete copyable template at the end
5. Closing question about their project

STRICT FORMAT REQUIREMENT:
**[Principle Name]**
❌ *Bad:* "[specific bad example]"
✅ *Good:* "[detailed good example with tech stack]"

MANDATORY TEMPLATE SECTION:
**Example Template You Can Copy:**
\`\`\`
[Actual template they can use]
\`\`\`

IF they want to continue normally (contains "no", "continue", "normally", etc.):
- Provide encouraging creative assistance
- Ask what they'd like to create

ABSOLUTE REQUIREMENTS:
- NEVER skip the BAD vs GOOD examples
- ALWAYS include the copyable template with backticks
- Focus on SOFTWARE BUILDING specifically
- Use markdown formatting with ** for bold and ❌ ✅ symbols
- Template MUST be in code block format`
    };

    const systemPrompt = createPrompts[step as keyof typeof createPrompts];
    if (!systemPrompt) return 'Thank you for using Smart Potato!';

    // Use conversation history if available, otherwise create new message structure
    if (conversationHistory && conversationHistory.length > 0) {
      // Add system prompt and use full conversation history for context
      const messages: Message[] = [
        {
          id: 'system',
          content: systemPrompt,
          sender: 'ai',
          timestamp: new Date()
        },
        ...conversationHistory
      ];
      return this.sendMessage(messages);
    } else {
      // Enhanced message structure with system constraints
      const messages: Message[] = [
        {
          id: 'system',
          content: systemPrompt,
          sender: 'ai',
          timestamp: new Date()
        }
      ];

      // Only add user input for steps that need it
      if (step > 0 && userAnswer.trim()) {
        messages.push({
          id: 'user-input',
          content: userAnswer,
          sender: 'user',
          timestamp: new Date()
        });
      }

      return this.sendMessage(messages);
    }
  }

  // Enhanced general chat with personality constraints
  async sendMessage(messages: Message[]): Promise<string> {
    try {
      // Add system personality constraints for all conversations
      const systemMessage = {
        role: 'system',
        content: `You are Smart Potato, a helpful AI assistant with these constraints:

PERSONALITY:
- Friendly, encouraging, and approachable
- Use simple language, avoid jargon
- Keep responses focused and concise
- Add light humor when appropriate

RESPONSE RULES:
- Maximum 3 paragraphs
- End with a question or call-to-action when helpful
- For technical topics: provide step-by-step guidance
- Always be constructive and solution-oriented

FORBIDDEN:
- Don't repeat the user's question back to them
- Don't be overly formal or robotic
- Don't give incomplete answers without offering next steps`
      };

      // Convert our Message format to OpenAI format with system message
      const openAIMessages = [
        systemMessage,
        ...messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content
        }))
      ];

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart Potato AI Assistant'
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: openAIMessages,
          temperature: 0.1, // Much lower temperature for more consistent responses
          max_tokens: 800,   // Increased tokens to ensure complete responses with examples
          top_p: 0.7,       // More focused responses
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Sorry, there was an error connecting to the AI service. Please try again.';
    }
  }

  // Generate a concise title for a conversation based on the first user message only
  async generateChatTitle(messages: Message[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (messages.length === 0) {
      return 'New Chat';
    }

    // Get only the first user message
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (!firstUserMessage) {
      return 'New Chat';
    }

    const content = firstUserMessage.content.toLowerCase();
    
    // Mock intelligent title generation based on first user message
    if (content.includes('build') || content.includes('create') || content.includes('make')) {
      if (content.includes('app') || content.includes('application')) {
        return 'Build App Project';
      } else if (content.includes('website') || content.includes('web')) {
        return 'Build Website';
      } else {
        return 'Build Project';
      }
    } else if (content.includes('help') || content.includes('how')) {
      if (content.includes('debug') || content.includes('fix') || content.includes('error')) {
        return 'Debug Help';
      } else {
        return 'Help Request';
      }
    } else if (content.includes('learn') || content.includes('explain') || content.includes('teach')) {
      return 'Learning Session';
    } else if (content.includes('weather')) {
      return 'Weather Check';
    } else if (content.includes('code') || content.includes('programming')) {
      return 'Code Discussion';
    } else {
      // Use first 2-3 meaningful words as fallback
      const words = firstUserMessage.content.split(' ')
        .filter(word => word.length > 2) // Remove small words like "I", "a", "the"
        .slice(0, 3); // Take first 3 meaningful words
      const title = words.join(' ');
      return title.length > 0 ? title : 'General Chat';
    }
  }
}



// For demo purposes, we'll use a mock service when no API key is provided
export class MockAIService extends AIService {
  constructor() {
    super('');
  }

  async sendMessage(messages: Message[]): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') {
      return `Thanks for your message: "${lastMessage.content}". This is a mock response from Smart Potato AI assistant powered by DeepSeek R1. In the full version, this would connect to the actual AI model!`;
    }
    
    return 'Hello! I\'m Smart Potato, your AI assistant.';
  }

  async getBuildOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      0: "Great! Before we start, do you want to learn how to write good prompts to build projects? Learning the ways of prompting is not only about specificity but also being organised.\n\nYou can choose to go through a tutorial with me or ignore this message and type in anything to continue.",
      1: `Nice! So what kind of project are you trying to build?`,
      2: `Perfect! Based on your answer, here are some tips for effective prompting when building ${userAnswer.toLowerCase()} projects:\n\n1. **Be specific about requirements** - Instead of "build an app", say "build a React app with user authentication and a dashboard"\n\n2. **Define the tech stack** - Specify which technologies, frameworks, and libraries you want to use\n\n3. **Break down the features** - List the specific features and functionality you need\n\n4. **Provide context** - Explain who will use it and what problem it solves\n\nWould you like to see an example of a well-structured prompt for your project type?`
    };

    return responses[step as keyof typeof responses] || 'Thank you for your interest!';
  }

  async getCreateOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      0: "Before we start, do you want to learn how to be good at prompting for building projects? Learning the ways of prompting is not only about specificity but also being organised.\n\nYou can choose to go through a tutorial with me or ignore this message and type in anything to continue.",
      1: (userAnswer: string) => {
        const lowerAnswer = userAnswer.toLowerCase();
        
        // Check if user wants tutorial
        if (lowerAnswer.includes('yes') || lowerAnswer.includes('tutorial') || lowerAnswer.includes('learn') || lowerAnswer.includes('teach') || lowerAnswer.includes('guide')) {
          return "Perfect! Let's dive into effective prompting for software building. Here are the key principles for getting better results when building applications:\n\n**1. Be Specific About Tech Stack**\n❌ *Bad:* \"Help me build a todo app\"\n✅ *Good:* \"Create a React todo app with TypeScript, using Firebase for authentication and Firestore for data storage\"\n\n**2. Define Architecture & Features**\n❌ *Bad:* \"Make it have users and tasks\"\n✅ *Good:* \"Include user registration/login, CRUD operations for tasks, real-time updates, and email notifications for deadlines\"\n\n**3. Specify Code Quality & Context**\n❌ *Bad:* \"Write some code\"\n✅ *Good:* \"Generate production-ready code with error handling, TypeScript interfaces, unit tests, and comprehensive comments\"\n\n**Example Template You Can Use:**\n```\nBuild a [type] application using [tech stack]. \nFeatures needed: [specific list]\nTechnical requirements: [authentication, database, API, etc.]\nCode style: [beginner-friendly/production-ready]\nInclude: [tests, documentation, error handling]\n```\n\nWhat kind of software project are you looking to build? I'll help you craft the perfect prompt using these principles!";
        } else {
          return "Great! I'm here to help you create something amazing. Whether you want to build an app, write content, design something, or explore any creative idea - just let me know what's on your mind!\n\nWhat would you like to create today?";
        }
      }
    };

    if (step === 1 && typeof responses[step] === 'function') {
      return (responses[step] as Function)(userAnswer);
    }

    return (responses[step as keyof typeof responses] as string) || 'Thank you for using Smart Potato!';
  }

  async generateChatTitle(messages: Message[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (messages.length === 0) {
      return 'New Chat';
    }

    // Simple mock title generation based on first user message
    const firstUserMessage = messages.find(msg => msg.sender === 'user');
    if (firstUserMessage) {
      const content = firstUserMessage.content.toLowerCase();
      
      // Mock some intelligent title generation
      if (content.includes('build') || content.includes('create')) {
        return 'Build Project Discussion';
      } else if (content.includes('help') || content.includes('how')) { 
        return 'Help & How-To Chat';
      } else if (content.includes('debug') || content.includes('error') || content.includes('fix')) {
        return 'Debug & Fix Issues';
      } else if (content.includes('learn') || content.includes('explain')) {
        return 'Learning Session';
      } else {
        // Use first few words as title
        const words = firstUserMessage.content.split(' ').slice(0, 4);
        return words.join(' ') + (words.length < firstUserMessage.content.split(' ').length ? '...' : '');
      }
    }
    
    return 'General Chat';
  }
}