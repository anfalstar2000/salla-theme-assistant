import { useState, useEffect, useRef } from 'react';
import { Message, ChatState } from '@/types/chat';
import { sendMessageToAgent } from '@/services/agentService';
import { ChatMessage } from '@/app/components/ChatMessage';
import { ChatInput } from '@/app/components/ChatInput';
import { TypingIndicator } from '@/app/components/TypingIndicator';
import { WelcomeScreen } from '@/app/components/WelcomeScreen';
import { Header } from '@/app/components/Header';
import { FloatingActions } from '@/app/components/FloatingActions';
import { RegenerateButton } from '@/app/components/RegenerateButton';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Card } from '@/app/components/ui/card';
import { ThemeProvider } from 'next-themes';

// Generate unique ID to prevent collisions
function generateMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function ChatInterface() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatState.messages, chatState.isLoading]);

  const handleSendMessage = async (content: string) => {
    // Prevent duplicate sends during loading
    if (chatState.isLoading) {
      return;
    }

    // Clear any previous errors
    setChatState((prev) => ({
      ...prev,
      error: undefined,
    }));

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setChatState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Call the agent service
      const response = await sendMessageToAgent(content);

      // Add assistant message
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.output_text,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.';
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const handleRegenerateLastResponse = async () => {
    if (chatState.messages.length < 2 || chatState.isLoading) return;

    // Find last user message
    let lastUserMessage: Message | null = null;
    for (let i = chatState.messages.length - 1; i >= 0; i--) {
      if (chatState.messages[i].role === 'user') {
        lastUserMessage = chatState.messages[i];
        break;
      }
    }

    if (!lastUserMessage) return;

    // Clear any previous errors
    setChatState((prev) => ({
      ...prev,
      error: undefined,
    }));

    // Remove last assistant message and regenerate
    setChatState((prev) => ({
      ...prev,
      messages: prev.messages.slice(0, -1),
      isLoading: true,
    }));

    try {
      const response = await sendMessageToAgent(lastUserMessage.content);
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: response.output_text,
        timestamp: new Date(),
      };

      setChatState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        error: undefined,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to regenerate response. Please try again.';
      setChatState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const handleClearChat = () => {
    setChatState({
      messages: [],
      isLoading: false,
    });
  };

  const lastMessage = chatState.messages[chatState.messages.length - 1];
  const showRegenerateButton = lastMessage && lastMessage.role === 'assistant' && !chatState.isLoading;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Chat Content */}
        <div className="flex-1 overflow-hidden">
          {chatState.messages.length === 0 ? (
            <WelcomeScreen onSendMessage={handleSendMessage} />
          ) : (
            <ScrollArea className="h-full px-8">
              <div className="py-8 space-y-6 max-w-5xl mx-auto">
                {chatState.messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {chatState.isLoading && <TypingIndicator />}
                {showRegenerateButton && (
                  <RegenerateButton onClick={handleRegenerateLastResponse} />
                )}
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Input Area */}
        {chatState.error && (
          <div className="px-8 pt-4">
            <Card className="p-3 bg-red-50 border-red-200 max-w-4xl mx-auto">
              <p className="text-sm text-red-600">{chatState.error}</p>
            </Card>
          </div>
        )}
        <ChatInput onSendMessage={handleSendMessage} isLoading={chatState.isLoading} />
      </div>

      {/* Floating Actions */}
      <FloatingActions onClearChat={handleClearChat} onNewChat={handleClearChat} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ChatInterface />
    </ThemeProvider>
  );
}