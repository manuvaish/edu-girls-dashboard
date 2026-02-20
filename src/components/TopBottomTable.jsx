import React from 'react';
import { SectionTitle } from './SubjectCards';
import { METRIC_META } from '../utils/processData';

const SUBJECT_COLORS = {
  Math:    'bg-blue-100 text-blue-800',
  English: 'bg-emerald-100 text-emerald-800',
  Science: 'bg-violet-100 text-violet-800',
};

function RankTable({ rows, variant, meta }) {
  const isTop = variant === 'top';

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${isTop ? 'border-emerald-100' : 'border-red-100'}`}>

      <div className={`px-5 py-4 flex items-center gap-2 ${isTop ? 'bg-emerald-50' : 'bg-red-50'}`}>
        <div className={`w-2 h-6 rounded-full ${isTop ? 'bg-emerald-500' : 'bg-red-400'}`} />
        <div>
          <h3 className="font-bold text-slate-800 text-sm">
            {isTop ? 'Top 5 Class–Subject' : 'Bottom 5 Class–Subject'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {isTop ? `Highest avg ${meta.label}` : `Lowest avg ${meta.label}`}
          </p>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="text-left text-xs font-semibold text-slate-400 uppercase px-5 py-3">#</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase py-3">Class</th>
            <th className="text-left text-xs font-semibold text-slate-400 uppercase py-3">Subject</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase py-3 px-5">{meta.colHeader}</th>
            <th className="text-right text-xs font-semibold text-slate-400 uppercase py-3 pr-5">n</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr><td colSpan={5} className="text-center text-sm text-slate-400 py-8">No data</td></tr>
          )}
          {rows.map((row, i) => (
            <tr key={`${row.class}-${row.subject}-${i}`} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
              <td className="px-5 py-3 text-xs font-bold text-slate-300">#{i + 1}</td>
              <td className="py-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isTop ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  Class {row.class}
                </span>
              </td>
              <td className="py-3">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${SUBJECT_COLORS[row.subject] ?? 'bg-slate-100 text-slate-700'}`}>
                  {row.subject}
                </span>
              </td>
              <td className="py-3 px-5 text-right">
                <span className={`text-base font-black ${isTop ? 'text-emerald-700' : 'text-red-600'}`}>
                  {row.avgVal}{meta.suffix}
                </span>
              </td>
              <td className="py-3 pr-5 text-right text-xs text-slate-400">{row.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TopBottomTable({ top, bottom, metric }) {
  const meta = METRIC_META[metric] ?? METRIC_META.scaledScore;
  return (
    <section>
      <SectionTitle
        title="Top & Bottom Performers"
        subtitle={`Class–subject combinations ranked by average ${meta.label}`}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <RankTable rows={top}    variant="top"    meta={meta} />
        <RankTable rows={bottom} variant="bottom" meta={meta} />
      </div>
    </section>
  );
}
