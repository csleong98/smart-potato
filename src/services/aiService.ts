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

  // Create onboarding with thinking process
  async getCreateOnboardingResponseWithThinking(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<{response: string, thinking?: string}> {
    // Get the regular response first
    const response = await this.getCreateOnboardingResponse(userAnswer, step, conversationHistory);
    
    // Generate thinking process for this response
    const thinkingSystemMessage = {
      role: 'system',
      content: `You are analyzing how Smart Potato (an AI assistant) would think about providing prompting guidance for creative projects.

The user chose: "${userAnswer}"

Explain the REASONING PROCESS behind why this tutorial response was structured this way:

THINKING FORMAT:
1. **Understanding the User's Choice**: What does their selection tell me about their needs?
2. **Educational Goals**: What specific prompting skills should I teach them?
3. **Response Strategy**: Why did I structure the tutorial this way?
4. **Content Decisions**: Why did I include these specific examples and templates?
5. **Follow-up Planning**: How does this set up their continued learning?

Focus on the REASONING behind the educational approach, not repeating the content itself.`
    };

    try {
      const thinkingResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart Potato AI Assistant - Thinking'
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [thinkingSystemMessage],
          temperature: 0.2,
          max_tokens: 400,
          top_p: 0.8,
        })
      });

      let thinking: string | undefined;
      if (thinkingResponse.ok) {
        const thinkingData = await thinkingResponse.json();
        thinking = thinkingData.choices[0]?.message?.content || undefined;
      }

      return {
        response,
        thinking
      };
    } catch (error) {
      console.error('Error generating thinking process:', error);
      return { response };
    }
  }

  // Research onboarding with multiple choice options
  async getResearchOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    const researchPrompts = {
      0: `You are Smart Potato, an AI assistant that helps with research.

Your response MUST be EXACTLY this message:

"Welcome! I'm Smart Potato, ready to help you master the art of effective research. Good research prompting can mean the difference between scattered results and targeted, valuable insights.

What type of research guidance would you like?"

NO VARIATIONS ALLOWED - use these exact words.`,

      1: `You are Smart Potato, an expert in teaching effective research and information gathering techniques.

The user has chosen: "${userAnswer}"

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

Analyze their choice and provide specialized guidance based on their selection:

IF they chose "Academic research techniques":
- Focus on scholarly research methods, citation practices, and credible source evaluation
- Provide structured approaches for literature reviews and systematic research
- Include tips for using academic databases and peer-reviewed sources

IF they chose "Market research methods":
- Focus on business intelligence, competitor analysis, and consumer insights
- Provide frameworks for surveys, interviews, and data collection
- Include tips for trend analysis and market validation

IF they chose "Technical research strategies":
- Focus on technical documentation, troubleshooting, and solution finding
- Provide approaches for researching technologies, tools, and methodologies
- Include tips for evaluating technical resources and implementation guides

IF they chose "Fact-checking approaches":
- Focus on verification methods, source credibility, and bias detection
- Provide techniques for cross-referencing information and identifying misinformation
- Include tips for using fact-checking tools and primary source validation

IF they chose "Continue normally":
- Provide general research assistance without specific tutorial focus
- Ask what they'd like to research

REQUIRED STRUCTURE:
1. Brief acknowledgment of their choice
2. 3-4 specific techniques with examples
3. Practical template or framework they can use
4. Follow-up question about their specific research needs

ABSOLUTE REQUIREMENTS:
- Tailor response specifically to their chosen research type
- Include actionable techniques they can implement immediately
- Provide concrete examples relevant to their choice
- Use clear formatting with headers and bullet points`
    };

    const systemPrompt = researchPrompts[step as keyof typeof researchPrompts];
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

  // Research onboarding with thinking process
  async getResearchOnboardingResponseWithThinking(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<{response: string, thinking?: string}> {
    // Get the regular response first
    const response = await this.getResearchOnboardingResponse(userAnswer, step, conversationHistory);
    
    // Generate thinking process for this response
    const thinkingSystemMessage = {
      role: 'system',
      content: `You are analyzing how Smart Potato (an AI assistant) would think about providing research guidance.

The user chose: "${userAnswer}"

Explain the REASONING PROCESS behind why this research tutorial response was structured this way:

THINKING FORMAT:
1. **Understanding the User's Choice**: What does their research selection tell me about their needs?
2. **Research Goals**: What specific research skills should I prioritize teaching?
3. **Methodology Selection**: Why did I choose these particular research techniques?
4. **Template Design**: Why did I structure the framework template this way?
5. **Skill Building**: How does this set up their research competency development?

Focus on the REASONING behind the research guidance approach, not repeating the content itself.`
    };

    try {
      const thinkingResponse = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart Potato AI Assistant - Thinking'
        },
        body: JSON.stringify({
          model: MODEL_NAME,
          messages: [thinkingSystemMessage],
          temperature: 0.2,
          max_tokens: 400,
          top_p: 0.8,
        })
      });

      let thinking: string | undefined;
      if (thinkingResponse.ok) {
        const thinkingData = await thinkingResponse.json();
        thinking = thinkingData.choices[0]?.message?.content || undefined;
      }

      return {
        response,
        thinking
      };
    } catch (error) {
      console.error('Error generating thinking process:', error);
      return { response };
    }
  }

  // Enhanced message with optional thinking process capture
  async sendMessageWithThinking(messages: Message[], captureThinking: boolean = false, projectContext?: string): Promise<{response: string, thinking?: string}> {
    try {
      let thinkingProcess: string | undefined;
      
      if (captureThinking) {
        // First API call: Get the thinking process
        const thinkingSystemMessage = {
          role: 'system',
          content: `You are analyzing how Smart Potato (an AI assistant) would think about responding to a user message.

IMPORTANT: Do NOT provide the actual response. Only explain the REASONING PROCESS.

THINKING FORMAT:
1. **Understanding the Question**: What is the user really asking? What do they need?
2. **Context Analysis**: What information from their message should guide my response?
3. **Response Strategy**: How should I structure my approach to be most helpful?
4. **Key Elements to Include**: What specific information or guidance should I prioritize?
5. **Tone and Style**: How should I communicate to match their needs and my personality?

Focus ONLY on the reasoning behind how you would approach this response. Do NOT include the actual answer.`
        };

        const thinkingMessages = [
          thinkingSystemMessage,
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        ];

        const thinkingResponse = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'Smart Potato AI Assistant - Thinking'
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: thinkingMessages,
            temperature: 0.2, // Slightly higher for more varied thinking
            max_tokens: 500,   // Moderate length for thinking process
            top_p: 0.8,
          })
        });

        if (thinkingResponse.ok) {
          const thinkingData = await thinkingResponse.json();
          thinkingProcess = thinkingData.choices[0]?.message?.content || undefined;
        }
      }

      // Second API call (or only call if not capturing thinking): Get the actual response
      const response = await this.sendMessage(messages, projectContext);
      
      return {
        response,
        thinking: thinkingProcess
      };
    } catch (error) {
      console.error('AI Service Error (with thinking):', error);
      return {
        response: 'Sorry, there was an error connecting to the AI service. Please try again.'
      };
    }
  }

  // Enhanced general chat with personality constraints
  async sendMessage(messages: Message[], projectContext?: string): Promise<string> {
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
- Don't give incomplete answers without offering next steps

${projectContext ? `

PROJECT CONTEXT:
The user is working within a project with the following context. Please consider this context when providing assistance:

${projectContext}

Keep this context in mind when responding to help provide more relevant and targeted assistance.` : ''}`
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

  async sendMessage(messages: Message[], projectContext?: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.sender === 'user') {
      return `Thanks for your message: "${lastMessage.content}". This is a mock response from Smart Potato AI assistant powered by DeepSeek R1. In the full version, this would connect to the actual AI model!`;
    }
    
    return 'Hello! I\'m Smart Potato, your AI assistant.';
  }

  async sendMessageWithThinking(messages: Message[], captureThinking: boolean = false, projectContext?: string): Promise<{response: string, thinking?: string}> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lastMessage = messages[messages.length - 1];
    let response: string;
    let thinking: string | undefined;
    
    if (lastMessage.sender === 'user') {
      response = `Thanks for your message: "${lastMessage.content}". This is a mock response from Smart Potato AI assistant powered by DeepSeek R1. In the full version, this would connect to the actual AI model!`;
      
      if (captureThinking) {
        thinking = `**Understanding the Question**: The user sent me a message: "${lastMessage.content}". I need to acknowledge it and explain this is a mock response.

**Key Considerations**: This is a demo/mock environment, so I should:
- Acknowledge their input
- Explain this is just a demonstration
- Be helpful and encouraging

**Approach**: I'll provide a friendly acknowledgment that references their exact message and explains the mock nature.

**Solution Strategy**: Simple acknowledgment with context about the mock environment.`;
      }
    } else {
      response = 'Hello! I\'m Smart Potato, your AI assistant.';
      
      if (captureThinking) {
        thinking = `**Understanding the Question**: This appears to be an initial greeting or system message.

**Approach**: Provide a simple, friendly introduction.

**Solution Strategy**: Basic greeting to establish the AI assistant persona.`;
      }
    }
    
    return {
      response,
      thinking
    };
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

  async getResearchOnboardingResponse(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = {
      0: "Welcome! I'm Smart Potato, ready to help you master the art of effective research. Good research prompting can mean the difference between scattered results and targeted, valuable insights.\n\nWhat type of research guidance would you like?",
      1: (userAnswer: string) => {
        const choice = userAnswer.toLowerCase();
        
        if (choice.includes('academic')) {
          return "**Academic Research Mastery** 🎓\n\nExcellent choice! Academic research is all about credibility and systematic approaches. Here are key techniques:\n\n**1. Source Quality Pyramid**\n❌ *Bad:* \"Find info about climate change\"\n✅ *Good:* \"Find peer-reviewed studies from 2020-2024 on climate change impacts in coastal regions, focusing on sea-level rise data from IPCC reports\"\n\n**2. Structured Literature Review**\n- Start with review papers and meta-analyses\n- Use academic databases (PubMed, IEEE, JSTOR)\n- Follow citation trails both forward and backward\n\n**3. Research Query Template:**\n```\nTopic: [specific subject + time frame]\nSources needed: [peer-reviewed journals, government reports, etc.]\nFocus: [particular aspect or question]\nExclusions: [what to avoid - popular media, opinion pieces]\n```\n\nWhat academic topic would you like to research? I'll help you craft a systematic research approach!";
        } else if (choice.includes('market')) {
          return "**Market Research Excellence** 📊\n\nSmart choice! Market research requires both quantitative data and qualitative insights. Here's your toolkit:\n\n**1. Multi-Source Validation**\n❌ *Bad:* \"Is there a market for my app?\"\n✅ *Good:* \"Analyze market size, competitor pricing, customer pain points, and growth trends for productivity apps targeting remote workers in 2024\"\n\n**2. Research Framework:**\n- Industry reports (Statista, IBISWorld, McKinsey)\n- Competitor analysis (pricing, features, reviews)\n- Customer surveys and interviews\n- Trend analysis (Google Trends, social media sentiment)\n\n**3. Market Research Template:**\n```\nMarket: [specific industry + geographic region]\nTarget audience: [demographics + psychographics]\nData needed: [size, growth, trends, pain points]\nCompetition: [direct + indirect competitors]\nSources: [industry reports, surveys, interviews]\n```\n\nWhat market are you looking to research? Let's build a comprehensive research strategy!";
        } else if (choice.includes('technical')) {
          return "**Technical Research Mastery** 🔧\n\nGreat pick! Technical research is about finding reliable, implementable solutions. Here's your approach:\n\n**1. Source Credibility Ladder**\n❌ *Bad:* \"How to fix this error?\"\n✅ *Good:* \"Find official documentation and verified solutions for React hydration errors in Next.js 14, including root causes and prevention strategies\"\n\n**2. Technical Research Stack:**\n- Official documentation (first priority)\n- GitHub issues and discussions\n- Stack Overflow (verified answers)\n- Technical blogs from authoritative sources\n- Community forums and Discord servers\n\n**3. Technical Query Template:**\n```\nProblem: [specific issue + environment]\nTech stack: [versions, frameworks, tools]\nGoal: [what you want to achieve]\nConstraints: [limitations, requirements]\nSources: [docs, forums, tutorials needed]\n```\n\nWhat technical challenge are you researching? I'll help you find the most reliable solutions!";
        } else if (choice.includes('fact')) {
          return "**Fact-Checking Expertise** 🔍\n\nCrucial skill! In the age of misinformation, effective fact-checking is essential. Here's your verification toolkit:\n\n**1. Source Triangulation**\n❌ *Bad:* \"Is this news article true?\"\n✅ *Good:* \"Verify claims about vaccine efficacy by cross-referencing CDC data, peer-reviewed studies, and official health organization statements\"\n\n**2. Verification Checklist:**\n- Primary sources (original studies, official statements)\n- Multiple independent confirmations\n- Check publication dates and context\n- Identify potential bias or conflicts of interest\n- Use fact-checking websites (Snopes, PolitiFact, FactCheck.org)\n\n**3. Fact-Check Template:**\n```\nClaim: [specific statement to verify]\nOriginal source: [where you found it]\nPrimary sources needed: [official data, studies]\nRed flags: [bias indicators, missing context]\nVerification: [multiple source confirmation]\n```\n\nWhat claim or information would you like to fact-check? Let's build a bulletproof verification process!";
        } else {
          return "Perfect! I'm here to help you dive deep into any topic you're curious about. Whether you need help with academic research, market analysis, fact-checking, or any other research task - just let me know what you'd like to explore!\n\nWhat would you like to research today?";
        }
      }
    };

    if (step === 1 && typeof responses[step] === 'function') {
      return (responses[step] as Function)(userAnswer);
    }

    return (responses[step as keyof typeof responses] as string) || 'Thank you for using Smart Potato!';
  }

  async getCreateOnboardingResponseWithThinking(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<{response: string, thinking?: string}> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly longer for "thinking"
    
    const response = await this.getCreateOnboardingResponse(userAnswer, step, conversationHistory);
    
    const thinking = `**Understanding the User's Choice**: The user selected "${userAnswer}" which indicates they want ${userAnswer.includes('yes') || userAnswer.includes('tutorial') ? 'structured learning about effective prompting techniques' : 'to proceed with creative assistance without tutorial guidance'}.

**Educational Goals**: ${userAnswer.includes('yes') || userAnswer.includes('tutorial') ? 'I need to teach practical prompting skills with concrete examples, focusing on specificity, tech stack definition, and structured templates they can immediately apply to their projects.' : 'I should provide encouraging creative support and ask about their specific creative goals.'}

**Response Strategy**: ${userAnswer.includes('yes') || userAnswer.includes('tutorial') ? 'Structure the tutorial with clear principles, contrasting bad vs good examples, and provide a copyable template to maximize practical value.' : 'Offer broad creative assistance and guide them toward specifying their project needs.'}

**Content Decisions**: ${userAnswer.includes('yes') || userAnswer.includes('tutorial') ? 'Include specific tech stacks in examples (React, TypeScript, Firebase) because these are commonly used and relatable. Use ❌/✅ format for visual clarity.' : 'Keep the response open-ended and encouraging to maintain creative momentum.'}

**Follow-up Planning**: End with a question that encourages them to apply the learning or share their specific creative project needs.`;

    return {
      response,
      thinking
    };
  }

  async getResearchOnboardingResponseWithThinking(userAnswer: string, step: number, conversationHistory?: Message[]): Promise<{response: string, thinking?: string}> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Slightly longer for "thinking"
    
    const response = await this.getResearchOnboardingResponse(userAnswer, step, conversationHistory);
    
    const thinking = `**Understanding the User's Choice**: The user selected "${userAnswer}" which indicates they need specialized guidance for ${userAnswer.includes('academic') ? 'scholarly research methodology' : userAnswer.includes('market') ? 'business intelligence and market analysis' : userAnswer.includes('technical') ? 'technical documentation and solution research' : userAnswer.includes('fact') ? 'information verification and bias detection' : 'general research assistance'}.

**Research Goals**: I should prioritize teaching ${userAnswer.includes('academic') ? 'source credibility assessment, systematic literature review methods, and academic database navigation' : userAnswer.includes('market') ? 'quantitative and qualitative data collection, competitor analysis frameworks, and trend identification' : userAnswer.includes('technical') ? 'documentation evaluation, solution validation, and technical resource assessment' : userAnswer.includes('fact') ? 'cross-referencing techniques, bias identification, and primary source validation' : 'fundamental research organization skills'}.

**Methodology Selection**: I chose these techniques because they represent the core competencies needed for effective ${userAnswer.toLowerCase()}, moving from basic to advanced skills in logical progression.

**Template Design**: The framework template provides a structured approach they can customize for different research scenarios while maintaining quality standards.

**Skill Building**: This foundation sets them up to become more independent and systematic in their research approach, reducing scattered results and improving research efficiency.`;

    return {
      response,
      thinking
    };
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