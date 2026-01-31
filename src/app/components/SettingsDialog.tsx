import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load saved settings
    const savedApiKey = localStorage.getItem('agent_api_key') || '';
    const savedApiUrl = localStorage.getItem('agent_api_url') || '/api/agent';
    setApiKey(savedApiKey);
    setApiUrl(savedApiUrl);
  }, [open]);

  const handleSave = () => {
    localStorage.setItem('agent_api_key', apiKey);
    localStorage.setItem('agent_api_url', apiUrl || '/api/agent');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Settings / الإعدادات</DialogTitle>
          <DialogDescription>
            Configure your API endpoint and key to connect to the Agent
            <br />
            قم بإعداد API الخاص بك للاتصال بالـ Agent
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Endpoint URL</Label>
            <Input
              id="api-url"
              placeholder="/api/agent"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Your API endpoint URL (default: /api/agent)
              <br />
              رابط الـ API endpoint الخاص بك (افتراضي: /api/agent)
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key (Optional / اختياري)</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="Enter API Key if required"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Some APIs require an API key for authentication
              <br />
              بعض الـ APIs تتطلب API Key للمصادقة
            </p>
          </div>
          {saved && (
            <div className="rounded-lg bg-green-50 border border-green-200 p-3">
              <p className="text-sm text-green-700">Saved successfully! ✓ / تم الحفظ بنجاح! ✓</p>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel / إلغاء
          </Button>
          <Button onClick={handleSave}>
            Save / حفظ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
