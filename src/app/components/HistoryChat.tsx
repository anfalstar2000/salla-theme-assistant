import { Card } from '@/app/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface HistoryChatProps {
  chatHistory?: Array<{ id: string; text: string }>;
}

export function HistoryChat({ chatHistory }: HistoryChatProps) {
  const defaultHistory = [
    { id: '1', text: 'Write a persuasive email to convince potential customers to try our service' },
    { id: '2', text: 'Write a script for a training video on how to use our software' },
    { id: '3', text: 'Generate a script for a 30-second commercial promoting our new product' },
    { id: '4', text: 'Tell me what is Artificial Intelligence?' },
    { id: '5', text: 'What can Artificial Intelligence do?' },
  ];

  const history = chatHistory || defaultHistory;

  return (
    <div className="w-80 bg-gray-50 border-l border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">History Chat</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* History Items */}
      <div className="space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            className="w-full text-left p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 line-clamp-2">{item.text}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Pro Plan Card */}
      <Card className="bg-gradient-to-br from-emerald-400 to-emerald-500 border-0 p-6 text-white">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <span className="font-bold text-xl">Pro Plan</span>
          </div>
          <div>
            <p className="text-3xl font-bold">$126.54<span className="text-lg font-normal">/month</span></p>
            <p className="text-sm text-white/80 mt-1">Get various other interesting features</p>
          </div>
          <button className="w-full bg-black hover:bg-gray-900 text-white font-medium py-3 rounded-lg transition-colors">
            Get Pro Plan Now
          </button>
        </div>
      </Card>
    </div>
  );
}
