# Vercel Serverless Functions

This directory contains the API endpoints for the Salla Theme Assistant.

## Setup

1. **Add your Agent code:**
   - Copy your agent code (the `runWorkflow` function) to this directory
   - Update `api/agent.ts` to import and use your agent code

2. **Set Environment Variables in Vercel:**
   - Go to your Vercel project settings
   - Add `OPENAI_API_KEY` with your OpenAI API key
   - Add any other environment variables your agent needs

3. **Deploy:**
   - The API will be available at `/api/agent` automatically
   - No need to change the frontend settings

## Example Agent Integration

```typescript
// In api/agent.ts, replace the placeholder with:

import { runWorkflow } from '../agent'; // or wherever your agent code is

export default async function handler(req, res) {
  // ... existing code ...
  
  const result = await runWorkflow({ input_as_text });
  return res.status(200).json(result);
}
```

## Testing Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

The API will be available at `http://localhost:3000/api/agent`
