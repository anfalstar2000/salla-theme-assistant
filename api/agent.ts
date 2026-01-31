/**
 * Vercel Serverless Function for the Agent API
 * 
 * This file should be deployed as a Vercel Serverless Function.
 * Make sure to set your OPENAI_API_KEY in Vercel environment variables.
 */

import { VercelRequest, VercelResponse } from '@vercel/node';

// Import your agent code here
// You'll need to copy your agent code to this file or import it
// For now, this is a template that you need to complete with your actual agent code

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { input_as_text } = req.body;

    if (!input_as_text || typeof input_as_text !== 'string') {
      return res.status(400).json({ 
        error: 'input_as_text is required and must be a string' 
      });
    }

    // Import and call the runWorkflow function
    const { runWorkflow } = await import('../agent');
    const result = await runWorkflow({ input_as_text });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Agent error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
