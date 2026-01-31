import { Button } from '@/app/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

interface FloatingActionsProps {
  onClearChat?: () => void;
  onNewChat?: () => void;
}

export function FloatingActions({ onClearChat, onNewChat }: FloatingActionsProps) {
  return (
    <div className="fixed left-6 bottom-24 flex flex-col gap-3">
      {/* Clear Chat Button */}
      <button
        onClick={onClearChat}
        className="group relative w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <Trash2 className="w-5 h-5 text-gray-700" />
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Clear Chat
        </div>
      </button>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="group relative w-12 h-12 bg-black hover:bg-gray-900 rounded-full shadow-lg flex items-center justify-center transition-all"
      >
        <Plus className="w-5 h-5 text-white" />
        <div className="absolute left-full ml-3 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          New Chat
        </div>
      </button>
    </div>
  );
}
