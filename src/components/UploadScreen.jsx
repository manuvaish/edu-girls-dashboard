import React, { useRef, useState } from 'react';

export default function UploadScreen({ onFile, uploading, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (file && file.name.endsWith('.xlsx')) onFile(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handle(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-green-950 to-green-900 flex flex-col items-center justify-center p-6">

      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 border border-white/20 mb-4">
          <span className="text-xl font-black text-white tracking-tight">EG</span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Vimukti / Edu-GIRLS</h1>
        <p className="text-green-300 mt-1 text-sm">Student Assessment Intelligence Dashboard</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Card header strip */}
        <div className="bg-green-700 px-6 py-4">
          <h2 className="text-white font-bold text-base">Upload Assessment Data</h2>
          <p className="text-green-200 text-xs mt-0.5">
            Excel file → "Raw Table" sheet · Row 1 headers · Row 2+ data
          </p>
        </div>

        <div className="p-6">
          {/* Drop zone */}
          <div
            className={`border-2 border-dashed rounded-xl p-10 text-center mb-5 cursor-pointer transition-colors ${
              dragging
                ? 'border-green-400 bg-green-50'
                : 'border-slate-200 hover:border-green-300 hover:bg-slate-50'
            }`}
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <div className="text-4xl mb-3 select-none">📊</div>
            <p className="font-semibold text-slate-700 text-sm">
              {dragging ? 'Drop to upload' : 'Click to select file, or drag & drop'}
            </p>
            <p className="text-xs text-slate-400 mt-1">Accepts .xlsx only</p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => { handle(e.target.files[0]); e.target.value = ''; }}
          />

          <button
            onClick={() => inputRef.current.click()}
            disabled={uploading}
            className="w-full py-3 rounded-xl bg-green-700 hover:bg-green-800 active:bg-green-900 text-white font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Parsing file…
              </span>
            ) : 'Upload Excel File'}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700"><strong>Error:</strong> {error}</p>
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium mb-2">Expected column headers (row 2):</p>
            <div className="flex flex-wrap gap-1.5">
              {['School','Date','Subject','S.no','Name','Score','Scaled Score','Percentile','Section','Class'].map(h => (
                <span key={h} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
