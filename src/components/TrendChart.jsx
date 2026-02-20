import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { SectionTitle } from './SubjectCards';
import { METRIC_META } from '../utils/processData';

const LINES = [
  { key: 'Math',    color: '#15803d' },
  { key: 'English', color: '#0d9488' },
  { key: 'Science', color: '#7c3aed' },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: '12px', border: '1px solid #e2e8f0',
    fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  labelStyle: { fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
};

export default function TrendChart({ data, metric }) {
  const hasData = data && data.length >= 2;
  const meta    = METRIC_META[metric] ?? METRIC_META.scaledScore;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <SectionTitle
        title="Performance Trend Over Time"
        subtitle={`Average ${meta.label} per subject across all assessment dates`}
      />

      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
              domain={metric === 'percentile' ? [0, 100] : ['auto', 'auto']}
              tickFormatter={v => metric === 'percentile' ? `${v}` : v}
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
            {LINES.map(({ key, color }) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
          <span className="text-3xl">📈</span>
          <p className="text-sm">At least 2 assessment dates required to show trends.</p>
        </div>
      )}
    </section>
  );
}
