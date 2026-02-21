import React, { useState } from 'react';
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { METRIC_META, getQuartileGapData } from '../utils/processData';

const QUARTILES = [
  { q: 1, label: 'Q1 — Bottom 25%', color: '#dc2626' },
  { q: 2, label: 'Q2 — Lower Mid',  color: '#d97706' },
  { q: 3, label: 'Q3 — Upper Mid',  color: '#0d9488' },
  { q: 4, label: 'Q4 — Top 25%',    color: '#15803d' },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: '12px', border: '1px solid #e2e8f0',
    fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  labelStyle: { fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
};

export default function QuartileGapChart({ data, metric }) {
  const [quartile, setQuartile] = useState(1);

  const meta   = METRIC_META[metric] ?? METRIC_META.scaledScore;
  const qInfo  = QUARTILES.find(x => x.q === quartile);
  const chartData = getQuartileGapData(data, quartile, metric);

  const latestWithGap = [...chartData].reverse().find(d => d.gap !== null);
  const latestGap     = latestWithGap?.gap ?? null;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 bg-green-700 rounded-full shrink-0" />
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-none">Quartile Gap Analysis</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {qInfo.label} avg {meta.label} vs all-student average
            </p>
          </div>
        </div>

        {/* Quartile selector */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-xs font-semibold shrink-0">
          {QUARTILES.map(({ q, label }, i) => (
            <button
              key={q}
              onClick={() => setQuartile(q)}
              title={label}
              className={`px-3 py-1.5 transition-colors ${i > 0 ? 'border-l border-slate-200' : ''} ${
                quartile === q ? 'text-white' : 'bg-white text-slate-600 hover:bg-slate-50'
              }`}
              style={quartile === q ? { backgroundColor: QUARTILES.find(x => x.q === q).color } : {}}
            >
              Q{q}
            </button>
          ))}
        </div>
      </div>

      {/* Gap callout */}
      {latestGap !== null && (
        <div className="mb-5 flex items-center gap-3">
          <div
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{
              backgroundColor: latestGap >= 0 ? '#f0fdf4' : '#fef2f2',
              color: latestGap >= 0 ? '#15803d' : '#dc2626',
            }}
          >
            {latestGap >= 0 ? '+' : ''}{latestGap}{meta.suffix} gap (latest period)
          </div>
          <span className="text-xs text-slate-400">
            {latestGap >= 0 ? 'above' : 'below'} the all-student average
          </span>
        </div>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={45}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v, name) => [
              v !== null ? `${v}${meta.suffix}` : 'No data',
              name,
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="totalAvg"
            name="All Students"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
            connectNulls={false}
          />
          <Line
            type="monotone"
            dataKey="quartileAvg"
            name={`Q${quartile} Students`}
            stroke={qInfo.color}
            strokeWidth={2.5}
            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
            connectNulls={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </section>
  );
}
