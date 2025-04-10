import { Check, Search, X } from 'lucide-react';
import { useState } from 'react';
import { UrlResult } from '../types';

interface Props {
  urls: UrlResult[];
  onToggle: (url: string) => void;
  onProcess: () => void;
  disabled: boolean;
}

export function UrlList({ urls, onToggle,onToggleAll, onProcess, disabled }: Props) {
  const [search, setSearch] = useState('');

  const filteredUrls = urls.filter(u => 
    u.url.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCount = urls.filter(u => u.selected).length;
  const allSelected = urls.length > 0 && !urls.some(it => !it.selected)

  const handleSelectAll = () => {
		 return onToggleAll()
    urls.forEach(url => {
      if (allSelected && url.selected || !allSelected && !url.selected) {
        onToggle(url.url);
      }
    });
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Found URLs ({urls.length})</h2>
            <button
              onClick={onProcess}
              disabled={selectedCount === 0 || disabled}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              Process Selected ({selectedCount})
            </button>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search URLs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSelectAll}
              className={`px-4 py-2 border rounded-lg hover:bg-gray-50 ${
                allSelected ? 'bg-green-50 border-green-200' : ''
              }`}
            >
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {filteredUrls.map((url) => (
            <div
              key={url.url}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => onToggle(url.url)}
            >
              <div className={`p-2 rounded-full mr-3 transition-colors ${url.selected ? 'bg-green-100' : 'bg-gray-100'}`}>
                {url.selected ? <Check className="text-green-500" size={20} /> : <X className="text-gray-400" size={20} />}
              </div>
              <span className="text-gray-700 truncate">{url.url}</span>
            </div>
          ))}
          {filteredUrls.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No URLs found matching your search
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
