import { useState } from 'react';
import { ProcessedResult, UrlResult } from './types';
import { UrlForm } from './components/UrlForm';
import { UrlList } from './components/UrlList';
import { ProcessingResults } from './components/ProcessingResults';
import { Globe2 } from 'lucide-react';

function App() {
  const [urls, setUrls] = useState<UrlResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ProcessedResult[]>([]);
  const [totalToProcess, setTotalToProcess] = useState(0);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        'https://automator.server.wonderit.io/webhook/api/checker',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ url })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      const uniqueUrls = (Array.isArray(data) ? data : []).map((url) => ({
        url: url.links,
        selected: false
      }));

      setUrls(uniqueUrls);
    } catch (error) {
      console.error('Error fetching URLs:', error);
    } finally {
      setIsLoading(false);
    }
  };
 
  const toggleUrl = (url: string) => {
    setUrls(
      urls.map((u) => (u.url === url ? { ...u, selected: !u.selected } : u))
    );
  };

  const handleToggleAll = () => {
    const isAllSelected = urls.some(it => it.selected === false);
    return setUrls(
      urls.map((u) => ({ ...u, selected: !u.selected }))
    );
  };

  const processUrls = async () => {
    setIsProcessing(true);
    const selectedUrls = urls.filter((u) => u.selected);
    setTotalToProcess(selectedUrls.length);
    setResults([]);
    const newResults: ProcessedResult[] = [];

    for (const url of selectedUrls) {
      try {
        const response = await fetch(
          'https://automator.server.wonderit.io/webhook/api/crawl',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url.url })
          }
        );
        const resp = await response.json();

        newResults.push({
          url: url.url,
          status: response.status,
          data: resp.output,
          html: resp.html || undefined
        });
      } catch (error) {
        newResults.push({
          url: url.url,
          status: 500,
          data: null
        });
      }
      setResults([...newResults]);
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe2 className="text-blue-500" size={32} />
            <h1 className="text-3xl font-bold text-gray-900">URL Crawler</h1>
          </div>
          <p className="text-gray-600">
            Enter a URL to find and process all links within the page
          </p>
        </div>

        <UrlForm onSubmit={handleUrlSubmit} isLoading={isLoading} />

        {urls.length > 0 && (
          <UrlList
            urls={urls}
            onToggle={toggleUrl}
            onToggleAll={handleToggleAll}
            onProcess={processUrls}
            disabled={isProcessing}
          />
        )}

        <ProcessingResults results={results} totalToProcess={totalToProcess} />
      </div>
    </div>
  );
}

export default App;
