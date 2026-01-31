import logoIcon from '@/assets/ac4adba80905e7f2545da21fa4566cbaedaa0d5c.png';

export function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
          <img src={logoIcon} alt="AI" className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 max-w-3xl">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}