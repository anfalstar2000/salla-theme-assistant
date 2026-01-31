import Group1 from '@/imports/Group1';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <Group1 />
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Salla Theme Assistant</h1>
        </div>
      </div>
    </header>
  );
}