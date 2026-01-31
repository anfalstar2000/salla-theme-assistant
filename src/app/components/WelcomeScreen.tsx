import Group1 from '@/imports/Group1';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

export function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  const suggestions = [
    'How can I improve my Salla theme performance?',
    'Show me best practices for Twilight Engine',
    'Help me debug this theme component',
    'What are the latest Salla theme features?',
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <div className="w-12 h-12">
                <Group1 />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Salla Theme Assistant</h1>
          <p className="text-lg text-gray-600">
            Your AI assistant for Salla theme development
          </p>
        </div>

        {/* Suggestion Cards */}
        <div className="grid grid-cols-2 gap-3 mt-8">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSendMessage(suggestion)}
              className="p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all text-left"
            >
              <p className="text-sm text-gray-700">{suggestion}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}