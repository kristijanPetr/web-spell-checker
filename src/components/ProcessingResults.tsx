import { CheckCircle, Download, XCircle } from 'lucide-react';
import { ProcessedResult } from '../types';

interface Props {
  results: ProcessedResult[];
  totalToProcess: number;
}

export function ProcessingResults({ results, totalToProcess }: Props) {
  if (totalToProcess === 0) return null;

  const handleDownloadCSV = () => {
    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    
    // Create CSV header and content
    const csvRows = [
      ['URL', 'Status', 'Result'],
      ...results.map(result => [
        // Escape fields that might contain commas
        `"${result.url}"`,
        result.status,
        // Clean up the data/html content for CSV
        `"${result.html ? 'HTML content' : (result.data?.toString() || '')}"`
      ])
    ];

    // Join rows and columns properly
    const csvContent = BOM + csvRows.map(row => row.join(',')).join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `url-results-${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Processing Results</h2>
            <p className="text-sm text-gray-600">
              Processed {results.length} of {totalToProcess} URLs
            </p>
          </div>
          {results.length > 0 && results.length === totalToProcess && (
            <button
              onClick={handleDownloadCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Download size={16} />
              Download CSV
            </button>
          )}
        </div>
        <div className="divide-y max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div key={result.url} className="p-4">
              <div className="flex items-center gap-2">
                {result.status === 200 ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-red-500" size={20} />
                )}
                <span className="font-medium">{result.url}</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Status: {result.status}
              </div>
              {result.html ? (
                <div className="mt-2 text-sm text-gray-600">
                  <p dangerouslySetInnerHTML={{ __html: result.html }}></p>
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-600">
                  Result: {result.data}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
