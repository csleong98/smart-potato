import { Message } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-r1:free';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Enhanced onboarding with strict constraints and structure
  async getBuildOnboardingResponse(userAnswer: string, step: number): Promise<string> {
    const buildPrompts = {
      0: `You are Smart Potato, an AI assistant that teaches effective prompting for building applications.

STRICT CONSTRAINTS:
- Keep response under 3 sentences
- ALWAYS end with exactly this question: "What kind of project would you like to build?"
- Use friendly, encouraging tone
- Mention you'll guide them through 3 steps

REQUIRED FORMAT:
[Brief intro] + [Value proposition] + [The exact question above]`,

      1: `You are Smart Potato teaching prompting techniques. User wants to build: "${userAnswer}"

STRICT CONSTRAINTS:
- Provide EXACTLY 4 tips, numbered 1-4
- Each tip: 1 sentence max
- Focus on: specificity, tech stack, features, context
- End with: "Ready for a concrete example? Tell me more about your specific requirements!"

REQUIRED FORMAT:
Here are 4 key prompting tips for ${userAnswer} projects:
1. [Tip about being specific]
2. [Tip about tech stack]  
3. [Tip about features]
4. [Tip about context]

Ready for a concrete example? Tell me more about your specific requirements!`,

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
          temperature: 0.3, // Lower temperature for more consistent responses
          max_tokens: 500,   // Shorter responses for better UX
          top_p: 0.9,       // More focused responses
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

  async getBuildOnboardingResponse(userAnswer: string, step: number): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      0: "Great! Before we start, do you want to learn how to write good prompts to build projects? Learning the ways of prompting is not only about specificity but also being organised.\n\nYou can choose to go through a tutorial with me or ignore this message and type in anything to continue.",
      1: `Nice! So what kind of project are you trying to build?`,
      2: `Perfect! Based on your answer, here are some tips for effective prompting when building ${userAnswer.toLowerCase()} projects:\n\n1. **Be specific about requirements** - Instead of "build an app", say "build a React app with user authentication and a dashboard"\n\n2. **Define the tech stack** - Specify which technologies, frameworks, and libraries you want to use\n\n3. **Break down the features** - List the specific features and functionality you need\n\n4. **Provide context** - Explain who will use it and what problem it solves\n\nWould you like to see an example of a well-structured prompt for your project type?`
    };

    return responses[step as keyof typeof responses] || 'Thank you for your interest!';
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