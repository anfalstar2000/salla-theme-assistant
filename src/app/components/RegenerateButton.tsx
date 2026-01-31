import { Button } from '@/app/components/ui/button';
import { RotateCw } from 'lucide-react';

interface RegenerateButtonProps {
  onClick?: () => void;
}

export function RegenerateButton({ onClick }: RegenerateButtonProps) {
  return (
    <div className="flex justify-center my-4">
      <Button
        onClick={onClick}
        variant="outline"
        className="bg-black hover:bg-gray-800 text-white border-black rounded-full px-6 gap-2"
      >
        <RotateCw className="w-4 h-4" />
        Regenerate Response
      </Button>
    </div>
  );
}
