import { useState, useCallback, useEffect } from 'react';
import { extractManagementReport, extractRentRoll, extractBudget, checkApiKeyStatus } from '../lib/ingestionService';

const ZONES = [
  { key: 'mgmt', label: 'Management Report', accept: '.pdf', description: 'Upload monthly/quarterly management report (PDF)', fn: extractManagementReport },
  { key: 'rent', label: 'Rent Roll', accept: '.pdf,.xlsx,.xls,.csv', description: 'Upload rent roll (PDF or Excel)', fn: extractRentRoll },
  { key: 'budget', label: 'Budget / Operating Statement', accept: '.xlsx,.xls,.csv', description: 'Upload budget or operating statement (Excel)', fn: extractBudget },
];

function DropZone({ zone, apiOk }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | done | error
  const [result, setResult] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const handleFile = useCallback(async (f) => {
    setFile(f);
    setStatus('uploading');
    setResult(null);
    try {
      const data = await zone.fn(f);
      setResult(data);
      setStatus('done');
    } catch (err) {
      setResult({ error: err.message });
      setStatus('error');
    }
  }, [zone]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer?.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const onInput = useCallback((e) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const borderColor = status === 'done' ? 'border-emerald-500/50' : status === 'error' ? 'border-red-500/50' : 'border-mhc-border';

  return (
    <div className={`bg-mhc-card border ${borderColor} rounded-xl p-5`}>
      <h3 className="text-white text-sm font-semibold mb-1">{zone.label}</h3>
      <p className="text-mhc-muted text-xs mb-3">{zone.description}</p>

      <div
        onDrop={onDrop}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-mhc-border rounded-lg p-6 text-center cursor-pointer hover:border-mhc-accent/40 transition"
      >
        <label className="cursor-pointer">
          <input type="file" accept={zone.accept} onChange={onInput} className="hidden" />
          {status === 'idle' && <span className="text-mhc-muted text-sm">Drop file here or click to browse</span>}
          {status === 'uploading' && <span className="text-mhc-accent text-sm animate-pulse">Extracting…</span>}
          {status === 'done' && <span className="text-emerald-400 text-sm">✓ Extraction complete — {file?.name}</span>}
          {status === 'error' && <span className="text-red-400 text-sm">✗ Failed — {file?.name}</span>}
        </label>
      </div>

      {result && (
        <div className="mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-mhc-accent text-xs hover:underline"
          >
            {expanded ? 'Hide' : 'Show'} extraction result
          </button>
          {expanded && (
            <pre className="mt-2 bg-mhc-navy rounded-lg p-3 text-xs text-mhc-muted overflow-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default function DataUpload() {
  const [apiStatus, setApiStatus] = useState(null);

  useEffect(() => {
    checkApiKeyStatus().then(s => setApiStatus(s)).catch(() => setApiStatus({ status: 'error' }));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Data Upload</h2>
          <p className="text-mhc-muted text-sm">Upload property reports for AI-powered extraction</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full ${apiStatus?.status === 'ok' ? 'bg-emerald-400' : 'bg-red-400'}`} />
          <span className="text-mhc-muted">API {apiStatus?.status === 'ok' ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {ZONES.map(z => (
          <DropZone key={z.key} zone={z} apiOk={apiStatus?.status === 'ok'} />
        ))}
      </div>

      <div className="bg-mhc-card border border-mhc-border rounded-xl p-5 text-xs text-mhc-muted">
        <p className="font-medium text-white text-sm mb-2">How it works</p>
        <p>Files are sent to the local Express API server which uses Claude AI to parse and extract structured data from your documents. Supported formats include PDF management reports, PDF/Excel rent rolls, and Excel budgets. Extracted data will be mapped to the fund data model automatically.</p>
      </div>
    </div>
  );
}
