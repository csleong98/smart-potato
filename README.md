# 🥔 Smart Potato AI Assistant

A modern AI assistant wrapper built with React and TailwindCSS, powered by DeepSeek R1 - an open-source AI model that performs on par with OpenAI's o1.

## ✨ Features

- **Multiple Onboarding Modes**: Quick start options for different use cases
  - 🎨 Create Something: Build creative projects and applications
  - 🔍 Search the Web: Find real-time information
  - 📚 Research Topics: Deep dive into subjects with analysis
  - 🏗️ Build Workflow: Learn effective prompting for development

- **Special Build Flow**: Interactive tutorial teaching users how to write effective prompts for building applications

- **Beautiful UI**: Modern design with pastel color scheme and smooth animations

- **Real-time Chat**: Responsive chat interface with message history

- **Conversation Management**: Create, switch between, and manage multiple conversations

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-potato
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🤖 AI Model Integration

This application is designed to work with DeepSeek R1, a powerful open-source AI model available through OpenRouter. Currently running in demo mode with mock responses.

### To connect to real AI:

1. Get an API key from [OpenRouter](https://openrouter.ai/)
2. Replace `MockAIService` with `AIService` in `src/App.tsx`
3. Set your API key in the service initialization

## 🎨 Design System

- **Colors**: Custom pastel color palette with TailwindCSS
- **Typography**: Inter font family for modern readability
- **Components**: Reusable, well-structured React components
- **Animations**: Smooth transitions and hover effects

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.tsx     # Navigation and conversation history
│   ├── WelcomeScreen.tsx # Landing page with onboarding
│   ├── OnboardingButtons.tsx # Quick start buttons
│   ├── ChatInterface.tsx # Main chat interface
│   └── MessageBubble.tsx # Individual message display
├── services/           # External service integrations
│   └── aiService.ts    # AI model communication
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared interfaces
└── App.tsx             # Main application component
```

## 🛠️ Built With

- **React** - Frontend framework
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS framework
- **DeepSeek R1** - Open-source AI model via OpenRouter
- **UUID** - Unique identifier generation

## 🎯 Key Features Implemented

### 1. Onboarding Flow
- Four distinct pathways for different user needs
- Special "Build Workflow" with interactive prompting tutorial
- Smooth transitions between modes

### 2. Build Tutorial
The "Build Workflow" button triggers a special 3-step onboarding:
1. Introduction to prompting concepts
2. Project type identification
3. Specific guidance based on user's project

### 3. Chat Interface
- Real-time messaging with typing indicators
- Auto-scroll to latest messages
- Auto-resizing text input
- Message timestamps and avatars

### 4. Conversation Management
- Create new conversations
- Switch between existing chats
- Automatic conversation titling
- Persistent conversation history

## 🎨 UI/UX Highlights

- **Responsive Design**: Works on desktop and mobile
- **Pastel Theme**: Calming, professional color scheme
- **Micro-interactions**: Hover effects and smooth animations
- **Accessibility**: Proper focus states and semantic HTML
- **Loading States**: Clear feedback during AI processing

## 🚀 Future Enhancements

- Integration with real DeepSeek R1 API
- Advanced conversation features (export, search)
- Additional onboarding workflows
- Plugin system for extended functionality
- Mobile app version

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ as a prototype for intelligent AI assistance.
