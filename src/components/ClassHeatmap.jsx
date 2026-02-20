import React from 'react';
import { SUBJECTS, getCellStyle, METRIC_META } from '../utils/processData';
import { SectionTitle } from './SubjectCards';

const LEGEND_STEPS = [
  { bg: '#fecaca', text: '#991b1b', label: 'Low'        },
  { bg: '#fed7aa', text: '#7c2d12', label: 'Below avg'  },
  { bg: '#fef08a', text: '#78350f', label: 'Average'    },
  { bg: '#bbf7d0', text: '#14532d', label: 'Above avg'  },
  { bg: '#4ade80', text: '#14532d', label: 'High'       },
];

export default function ClassHeatmap({ matrix, min, max, metric }) {
  if (!matrix || !matrix.length) return null;
  const meta = METRIC_META[metric] ?? METRIC_META.scaledScore;

  return (
    <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <SectionTitle
        title="Class × Subject Breakdown"
        subtitle={`Average ${meta.label} · All assessment dates combined · Red = low → Green = high`}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider pb-3 pr-6 w-28">
                Class
              </th>
              {SUBJECTS.map(s => (
                <th key={s} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider pb-3 px-3 min-w-[110px]">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row) => (
              <tr key={row.class} className="border-t border-slate-50">
                <td className="py-2 pr-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-blue-700 text-sm">
                      {row.class}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">Class</span>
                  </div>
                </td>
                {SUBJECTS.map(subject => {
                  const val   = row[subject];
                  const style = getCellStyle(val, min, max);
                  return (
                    <td key={subject} className="py-2 px-3 text-center">
                      <div
                        className="inline-flex items-center justify-center rounded-xl min-w-[80px] px-4 py-2.5 text-sm font-bold"
                        style={{ backgroundColor: style.bg, color: style.text }}
                      >
                        {val !== null ? val : <span className="text-slate-300 font-normal">—</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Colour legend */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="text-xs text-slate-400 font-medium">Score range:</span>
        {LEGEND_STEPS.map(({ bg, text, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md" style={{ backgroundColor: bg }} />
            <span className="text-xs text-slate-500">{label}</span>
          </div>
        ))}
        <span className="text-xs text-slate-300 ml-auto">
          Min {min}{meta.suffix} · Max {max}{meta.suffix}
        </span>
      </div>
    </section>
  );
}
