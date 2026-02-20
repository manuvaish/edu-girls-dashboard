import React, { useRef } from 'react';

function Stat({ label, value, sub, active }) {
  return (
    <div className={`rounded-xl px-5 py-4 border transition-all ${
      active
        ? 'bg-white/20 border-white/40 ring-1 ring-white/30'
        : 'bg-white/10 border-white/20'
    }`}>
      <div className="text-xs text-green-200 font-semibold uppercase tracking-widest mb-1">
        {active && <span className="mr-1 text-white/70">▶</span>}{label}
      </div>
      <div className="text-2xl font-black text-white leading-none">{value ?? '—'}</div>
      {sub && <div className="text-xs text-green-300 mt-1">{sub}</div>}
    </div>
  );
}

export default function DashboardHeader({ stats, onUpload, uploading, metric }) {
  const inputRef = useRef(null);

  return (
    <header className="bg-gradient-to-r from-slate-950 via-green-950 to-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top row: branding + upload button */}
        <div className="flex items-start justify-between gap-4 mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="w-7 h-7 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-xs font-black">EG</div>
              <span className="text-green-300 text-xs font-semibold uppercase tracking-widest">Assessment Dashboard</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight">Vimukti / Edu-GIRLS</h1>
            <p className="text-green-200 text-sm mt-1">
              Latest assessment:&nbsp;
              <span className="font-semibold text-white">{stats.latestDateDisplay || '—'}</span>
              <span className="text-green-400 ml-3 text-xs">{stats.totalRecords?.toLocaleString()} total records</span>
            </p>
          </div>

          <div className="shrink-0">
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(e) => { if (e.target.files[0]) onUpload(e.target.files[0]); e.target.value = ''; }}
            />
            <button
              onClick={() => inputRef.current.click()}
              disabled={uploading}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              )}
              Upload New File
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <Stat label="Total Students" value={stats.totalStudents?.toLocaleString()} sub="Latest assessment date" />
          <Stat
            label="Avg Scaled Score"
            value={stats.avgScaledScore}
            sub="All subjects combined"
            active={metric === 'scaledScore'}
          />
          <Stat
            label="Avg Percentile"
            value={stats.avgPercentile !== null ? `${stats.avgPercentile}th` : null}
            sub="All subjects combined"
            active={metric === 'percentile'}
          />
        </div>
      </div>
    </header>
  );
}
