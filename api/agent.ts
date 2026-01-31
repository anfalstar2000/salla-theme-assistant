/**
 * Vercel Serverless Function for the Agent API
 * 
 * This file should be deployed as a Vercel Serverless Function.
 * Make sure to set your OPENAI_API_KEY in Vercel environment variables.
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

    // Try to import and call the runWorkflow function
    let result;
    try {
      // Dynamic import with error handling
      // Try .js extension first (for ES modules), then without extension
      let agentModule;
      try {
        agentModule = await import('../agent.js');
      } catch (e1) {
        try {
          agentModule = await import('../agent');
        } catch (e2) {
          throw new Error(`Failed to import agent module: ${e1 instanceof Error ? e1.message : 'Unknown error'}`);
        }
      }
      
      if (!agentModule || !agentModule.runWorkflow) {
        throw new Error('runWorkflow function not found in agent module. Make sure agent.ts exports runWorkflow.');
      }

      result = await agentModule.runWorkflow({ input_as_text });
    } catch (importError) {
      console.error('Import/Runtime error:', importError);
      
      // Provide helpful error message
      const errorMessage = importError instanceof Error ? importError.message : 'Unknown error';
      const errorStack = importError instanceof Error ? importError.stack : undefined;
      
      // Check if it's a module not found error
      if (errorMessage.includes('Cannot find module') || 
          errorMessage.includes('@openai/agents') ||
          errorMessage.includes('MODULE_NOT_FOUND')) {
        return res.status(500).json({
          error: 'Agent dependencies not available',
          message: 'The @openai/agents package is not available as an npm package. You need to deploy the backend separately or use OpenAI SDK directly.',
          suggestion: 'Please deploy your agent code to a separate backend server (Railway, Render, etc.) and configure the API URL in Settings.',
          details: errorMessage
        });
      }
      
      // Check for OpenAI API key issues
      if (errorMessage.includes('API key') || errorMessage.includes('OPENAI_API_KEY')) {
        return res.status(500).json({
          error: 'OpenAI API key not configured',
          message: 'Please set OPENAI_API_KEY in Vercel environment variables.',
          details: errorMessage
        });
      }
      
      throw importError;
    }

    // Validate result structure
    if (!result || typeof result !== 'object') {
      throw new Error('Invalid result format from agent');
    }

    if (!result.output_text || typeof result.output_text !== 'string') {
      throw new Error('Agent result missing output_text');
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error('Agent error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    // Log full error for debugging
    console.error('Full error:', {
      message: errorMessage,
      stack: errorStack,
      body: req.body
    });

    return res.status(500).json({ 
      error: 'Internal server error',
      message: errorMessage,
      // Only include stack in development
      ...(typeof process !== 'undefined' && process.env?.NODE_ENV === 'development' && { stack: errorStack })
    });
  }
}
