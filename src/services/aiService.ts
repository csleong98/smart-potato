import { Message } from '../types';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL_NAME = 'deepseek/deepseek-r1:free';

export class AIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    try {
      // Convert our Message format to OpenAI format
      const openAIMessages = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

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
          temperature: 0.7,
          max_tokens: 1000,
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

  // Special method for build onboarding flow
  async getBuildOnboardingResponse(userAnswer: string, step: number): Promise<string> {
    const buildPrompts = {
      0: `You are a helpful AI assistant that teaches users how to prompt effectively for building applications. 
          Introduce yourself briefly as Smart Potato and ask the user what kind of project they want to build. 
          Keep it conversational and encouraging.`,
      1: `Based on the user's answer: "${userAnswer}", provide specific guidance on how to prompt effectively for building that type of project. 
          Give them 3-4 practical tips for writing good prompts when building applications. 
          Be encouraging and specific to their project type.`,
      2: `The user said: "${userAnswer}". Now give them a concrete example of a well-structured prompt they could use for their project type. 
          Show them the difference between a vague prompt and a detailed, effective prompt.`
    };

    const systemPrompt = buildPrompts[step as keyof typeof buildPrompts];
    if (!systemPrompt) return 'Thank you for your interest in building projects!';

    const messages: Message[] = [
      {
        id: 'system',
        content: systemPrompt,
        sender: 'ai',
        timestamp: new Date()
      },
      {
        id: 'user-input',
        content: userAnswer,
        sender: 'user',
        timestamp: new Date()
      }
    ];

    return this.sendMessage(messages);
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
}