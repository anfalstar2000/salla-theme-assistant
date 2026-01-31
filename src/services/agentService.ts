/**
 * Agent Service - Handles communication with the OpenAI Agents workflow
 */

export interface AgentResponse {
  output_text: string;
}

const API_TIMEOUT = 30000; // 30 seconds

/**
 * Gets the API endpoint from environment variable or localStorage
 */
function getApiEndpoint(): string {
  // Check localStorage first (user settings)
  const savedUrl = localStorage.getItem('agent_api_url');
  if (savedUrl) {
    return savedUrl;
  }
  // Fall back to environment variable
  return import.meta.env.VITE_AGENT_API_URL || '/api/agent';
}

/**
 * Gets the API key from localStorage if available
 */
function getApiKey(): string | null {
  return localStorage.getItem('agent_api_key');
}

/**
 * Sends a message to the Codei - Salla Theme Assistant agent
 * @param message - The user's message/question
 * @returns The agent's response
 * @throws Error if the request fails or times out
 */
export async function sendMessageToAgent(message: string): Promise<AgentResponse> {
  // Sanitize input
  const sanitizedMessage = message.trim();
  if (!sanitizedMessage) {
    throw new Error('Message cannot be empty');
  }

  const apiEndpoint = getApiEndpoint();
  const apiKey = getApiKey();

  // Prepare headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add API key to headers if available
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ input_as_text: sanitizedMessage }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format: expected object');
    }

    if (!data.output_text || typeof data.output_text !== 'string') {
      throw new Error('Invalid response format: missing or invalid output_text');
    }

    return {
      output_text: data.output_text,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout: The agent took too long to respond');
      }
      throw error;
    }

    throw new Error('Failed to communicate with agent');
  }
}
