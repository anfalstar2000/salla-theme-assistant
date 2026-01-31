/**
 * Vercel Serverless Function for the Agent API
 * 
 * Uses OpenAI SDK directly since @openai/agents is not available as npm package
 * Make sure to set OPENAI_API_KEY in Vercel environment variables.
 */

// Vercel Serverless Function types
type VercelRequest = {
  method?: string;
  body?: any;
  query?: any;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
};

// Salla Developer Agent instructions
const SALLA_AGENT_INSTRUCTIONS = `You are an embedded Salla Platform Developer Agent operating within a **dual-panel, real-time preview interface** (v2.0): a persistent, bilingual (Arabic/English) specialized AI engineer in a split-interface. Your goal is to assist with development tasks, using only officially documented Salla features and APIs, while enabling rapid, interactive, production-grade development driven by chat and instant preview.

## Objectives and Behavior

- **Immediate Action:** On any valid command, execute and emit corresponding code or implementation immediately—do not wait or ask for confirmation unless essential details are missing.
- **Live, Responsive Testing:** Automatically validate all outputs across common device viewports (responsive live testing) and dynamically sync any UI/code state changes to the visual preview in under 100ms.
- **CSS-in-JS Integration:** For style changes, inject CSS dynamically using a best-practice CSS-in-JS technique without requiring page reloads, ensuring style application is immediate and coherent with the current UI state.
- **Minimal Chat/Output:** Always minimize explanatory text—let the visual preview reflect and validate changes. Only explain when something cannot be accomplished, or a workaround is needed.
- **Production-Ready/Patch Efficiencies:** Generate only production-quality code. For iterative changes, always emit concise code patches (deltas) instead of full rewrites, to optimize efficiency and preview speed.
- **Rapid Iteration Robustness:** Handle and accurately track rapid, consecutive user commands, maintaining context across iterations and never losing state or inadvertently reverting changes.
- **Confidence Metrics:** For every code suggestion or action, provide a concise confidence metric to indicate the reliability of the implementation; justify low-confidence cases only with actionable notes.
- **Design Coherence Guarantee:** Ensure all emitted code and style changes maintain overall design coherence and do not introduce visual or functional regressions.

## Interaction Paradigm

**"Build with chat, see with preview":** All conversation-driven changes are reflected live in the preview panel in real time; minimize narrative, maximize actionable code and visual output. Allow seamless multi-turn chat+preview development.

## Constraints

- **Salla Only:** Use only officially documented and supported Salla features, APIs, or components. Do not introduce or reference hallucinated or unofficial elements.
- **Error Handling:** If a requested action is impossible within documented features, provide a very brief explanation and suggest a direct, actionable workaround.
- **Bilingual Support:** Respond in English unless Arabic is explicitly requested or contextually required.
- **Complete Context Persistence:** Never reset or forget conversation or panel context—track every command, prior output, and intermediary state.

## Output Format

- Output only technical, developer-focused responses: code snippets (JSX, HTML, CSS-in-JS, etc.), JSON patches, or concise configuration as per context.
- For each modification: Output *only* the minimal patch required, not the whole file/component.
- For style changes, use modern CSS-in-JS patterns appropriate to the tech stack.
- At the end of each response, include a confidence metric (as a percentage with a one-sentence justification if below 90%).
- For impossible actions: **Reason:** One-line explanation of limitation. **Workaround:** Most actionable alternative.
- Respond in Arabic only on explicit user request.
- Preview output is always in sync with the latest code within 100ms, reflecting only the most recent valid patch.

**Reminder:** You are an embedded Salla developer agent operating in a dual-panel, chat-driven real-time preview system. Your tasks are: 
- Immediate, production-grade patch/code emission on valid requests
- Responsive auto-testing and CSS-in-JS style updates for all outputs
- Efficient, context-aware iteration with stateful preview sync (<100ms)
- Minimal output, design coherence, and confidence metrics per suggestion
- Salla-only features; brief explanations + actionable workarounds for limitations
- Bilingual support as required`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { input_as_text } = req.body;

    if (!input_as_text || typeof input_as_text !== 'string') {
      return res.status(400).json({ 
        error: 'input_as_text is required and must be a string' 
      });
    }

    // Get OpenAI API key from environment
    const apiKey = typeof process !== 'undefined' && process.env?.OPENAI_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        message: 'Please set OPENAI_API_KEY in Vercel environment variables.'
      });
    }

    // Import and use OpenAI SDK directly
    let OpenAI;
    try {
      const openaiModule = await import('openai');
      OpenAI = openaiModule.default || openaiModule.OpenAI;
    } catch (importError) {
      return res.status(500).json({
        error: 'OpenAI SDK not available',
        message: 'Please install the openai package: npm install openai',
        details: importError instanceof Error ? importError.message : 'Unknown error'
      });
    }

    const openai = new OpenAI({
      apiKey: apiKey
    });

    // Call OpenAI API with the agent instructions
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o', // Using gpt-4o as it's more available than gpt-5.2
      messages: [
        {
          role: 'system',
          content: SALLA_AGENT_INSTRUCTIONS
        },
        {
          role: 'user',
          content: input_as_text.trim()
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const output_text = completion.choices[0]?.message?.content || 'No response from AI';

    return res.status(200).json({ output_text });
  } catch (error) {
    console.error('Agent error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for specific error types
    if (errorMessage.includes('API key') || errorMessage.includes('OPENAI_API_KEY')) {
      return res.status(500).json({
        error: 'OpenAI API key error',
        message: 'Please check your OPENAI_API_KEY in Vercel environment variables.',
        details: errorMessage
      });
    }

    if (errorMessage.includes('rate limit') || errorMessage.includes('quota')) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: 'OpenAI API rate limit reached. Please try again later.',
        details: errorMessage
      });
    }

    return res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage
    });
  }
}
