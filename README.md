# Codei - Salla Theme Assistant

A bilingual (Arabic/English) chat interface for the Codei AI assistant, built to help developers working with Salla themes using Twilight Engine.

## Features

- 💬 **Interactive Chat Interface** - Real-time conversation with the Codei assistant
- 🌗 **Dark/Light Mode** - Toggle between themes for comfortable viewing
- 🌐 **Bilingual Support** - Seamlessly works in both Arabic and English
- 💻 **Code Highlighting** - Syntax-highlighted code blocks using react-syntax-highlighter
- 📝 **Markdown Support** - Rich text formatting for better readability
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Quick Start

The project includes a Vercel Serverless Function setup. After deployment:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables in Vercel:**
   - Go to your Vercel project → Settings → Environment Variables
   - Add `OPENAI_API_KEY` with your OpenAI API key

3. **Deploy to Vercel:**
   - The API will automatically be available at `/api/agent`
   - No additional configuration needed!

## Connecting to Your Agent Backend

The agent service is configured to connect to your backend API. You have two options:

### Option 1: Use Built-in Vercel Serverless Function (Recommended)

The project includes a Vercel Serverless Function at `api/agent.ts` that uses the agent code in `agent.ts`. This works automatically when deployed to Vercel.

**Setup:**
1. Make sure `agent.ts` contains your agent code (already included)
2. Set `OPENAI_API_KEY` in Vercel environment variables
3. Deploy - the API will be available at `/api/agent`

### Option 2: External Backend

If you prefer to use a separate backend server, set up your backend and configure the API endpoint:

### 1. Set Up Backend API

**Important:** You need to deploy the agent code to a backend server first. The frontend cannot work without a running backend.

Create a backend API endpoint that runs your `runWorkflow` function. Here's an example using Express.js:

```typescript
// Example Express.js endpoint
import express from 'express';
import cors from 'cors';
import { runWorkflow } from './agent'; // Import your agent code

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/agent', async (req, res) => {
  try {
    const { input_as_text } = req.body;
    
    if (!input_as_text) {
      return res.status(400).json({ error: 'input_as_text is required' });
    }
    
    const result = await runWorkflow({ input_as_text });
    
    res.json(result);
  } catch (error) {
    console.error('Agent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**The API should return a JSON response with the following structure:**
```json
{
  "output_text": "The agent's response text"
}
```

**Your agent code should look like this:**
```typescript
import { webSearchTool, codeInterpreterTool, Agent, AgentInputItem, Runner, withTrace } from "@openai/agents";

// ... your agent configuration ...

export const runWorkflow = async (workflow: { input_as_text: string }) => {
  return await withTrace("CODI AI CHAT", async () => {
    const conversationHistory: AgentInputItem[] = [
      { role: "user", content: [{ type: "input_text", text: workflow.input_as_text }] }
    ];
    const runner = new Runner({
      traceMetadata: {
        __trace_source__: "agent-builder",
        workflow_id: "your-workflow-id"
      }
    });
    const result = await runner.run(yourAgent, conversationHistory);
    
    return {
      output_text: result.finalOutput ?? ""
    };
  });
}
```

### 2. Configure API Endpoint

You can configure the API endpoint in two ways:

**Option A: Using Settings UI (Recommended)**
1. Click the Settings icon (⚙️) in the top-right corner of the header
2. Enter your API endpoint URL (e.g., `/api/agent` or `https://your-backend.com/api/agent`)
3. Optionally add an API Key if your backend requires authentication
4. Click "Save" - settings are stored in your browser's localStorage

**Option B: Using Environment Variable**
Set the `VITE_AGENT_API_URL` environment variable:

```bash
# .env file
VITE_AGENT_API_URL=/api/agent
```

Or use an absolute URL:
```bash
VITE_AGENT_API_URL=https://your-backend.com/api/agent
```

**Priority:** Settings UI > Environment Variable > Default (`/api/agent`)

### 3. Backend Environment Variables

Add your OpenAI API key to your backend environment:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ChatInput.tsx       # Message input component
│   │   ├── ChatMessage.tsx     # Individual message display
│   │   ├── TypingIndicator.tsx # Loading animation
│   │   ├── WelcomeScreen.tsx   # Initial screen
│   │   └── ui/                 # shadcn/ui components
│   └── App.tsx                 # Main application
├── services/
│   └── agentService.ts         # Agent API communication
├── types/
│   └── chat.ts                 # TypeScript interfaces
└── styles/
    └── theme.css               # Theme variables
```

## Technologies Used

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI components
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting
- **next-themes** - Theme management
- **Vite** - Build tool

## Agent Configuration

The agent is configured with:

- **Model**: gpt-5.2
- **Reasoning Effort**: High
- **Tools**: Web Search, Code Interpreter
- **Language**: Bilingual (Arabic/English)
- **Specialty**: Salla theme development with Twilight Engine

## Customization

### Changing Colors

Modify `/src/styles/theme.css` to customize the color scheme:

```css
:root {
  --primary: #your-color;
  --accent: #your-color;
  /* ... more variables */
}
```

### Adjusting Mock Responses

Edit `/src/services/agentService.ts` to modify the mock responses for testing.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT
