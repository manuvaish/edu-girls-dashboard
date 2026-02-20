import React from 'react';

export default function Controls({
  schools, selectedSchool, onSchoolChange,
  metric,  onMetricChange,
}) {
  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4 flex-wrap">

        {/* School filter — always visible */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-slate-500 font-medium">School:</span>
          <select
            value={selectedSchool ?? ''}
            onChange={e => onSchoolChange(e.target.value || null)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
          >
            <option value="">All Schools</option>
            {schools.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Metric toggle */}
        <div className="flex items-center gap-2.5">
          <span className="text-sm text-slate-500 font-medium">View:</span>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-semibold">
            {[
              { value: 'score',       label: 'Score'        },
              { value: 'scaledScore', label: 'Scaled Score' },
              { value: 'percentile',  label: 'Percentile'   },
            ].map(({ value, label }, i) => (
              <button
                key={value}
                onClick={() => onMetricChange(value)}
                className={`px-4 py-1.5 transition-colors ${i > 0 ? 'border-l border-slate-200' : ''} ${
                  metric === value
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
