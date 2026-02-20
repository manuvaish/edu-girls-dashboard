import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { METRIC_META } from '../utils/processData';
import { SectionTitle } from './SubjectCards';

const BARS = [
  { key: 'Math',    color: '#2563eb' },
  { key: 'English', color: '#059669' },
  { key: 'Science', color: '#7c3aed' },
];

const tooltipStyle = {
  contentStyle: {
    borderRadius: '12px', border: '1px solid #e2e8f0',
    fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  labelStyle: { fontWeight: '700', color: '#1e293b', marginBottom: '4px' },
};

export default function SchoolComparison({ data, metric }) {
  const meta = METRIC_META[metric];

  return (
    <section className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6">
      <SectionTitle
        title="School Comparison"
        subtitle={`${meta.colHeader} per subject · All dates combined`}
      />

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barGap={3}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="school"
            tick={{ fontSize: 11, fill: '#64748b' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            width={45}
            tickFormatter={v => metric === 'percentile' ? `${v}th` : v}
          />
          <Tooltip
            {...tooltipStyle}
            formatter={(v, name) => [
              v !== null ? `${v}${meta.suffix}` : 'No data',
              name,
            ]}
            labelFormatter={(label) => {
              // Show full name if it was truncated
              const row = data.find(d => d.school === label);
              return row?.fullName ?? label;
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
            iconType="circle"
            iconSize={8}
          />
          {BARS.map(({ key, color }) => (
            <Bar
              key={key}
              dataKey={key}
              fill={color}
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </section>
  );
}
