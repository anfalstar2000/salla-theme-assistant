import { useState } from 'react';
import Group1 from '@/imports/Group1';
import { Button } from '@/app/components/ui/button';
import { Settings } from 'lucide-react';
import { SettingsDialog } from '@/app/components/SettingsDialog';

export function Header() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Group1 />
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Salla Theme Assistant</h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </header>
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}