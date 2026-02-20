import React from 'react';

const SUBJECT_CONFIG = {
  Math:    { icon: '📐', accent: '#15803d', light: '#f0fdf4', dark: '#14532d', ring: '#bbf7d0' },
  English: { icon: '📖', accent: '#0d9488', light: '#f0fdfa', dark: '#134e4a', ring: '#99f6e4' },
  Science: { icon: '🔬', accent: '#7c3aed', light: '#f5f3ff', dark: '#2e1065', ring: '#ddd6fe' },
};

function TrendPill({ delta, direction }) {
  if (delta === null) {
    return <span className="text-xs text-slate-400">No prior period</span>;
  }
  const sign = delta >= 0 ? '+' : '';
  const label = `${sign}${delta} vs prev`;

  if (direction === 'up')   return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
      ▲ {label}
    </span>
  );
  if (direction === 'down') return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 text-red-700 px-2.5 py-1 rounded-full">
      ▼ {label}
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
      ● {label}
    </span>
  );
}

function SubjectCard({ subject, avgScaled, avgPercentile, delta, direction, count, metric }) {
  const cfg = SUBJECT_CONFIG[subject] ?? SUBJECT_CONFIG.Math;

  const primary       = metric === 'scaledScore' ? avgScaled      : avgPercentile;
  const primaryLabel  = metric === 'scaledScore' ? 'Avg Scaled Score' : 'Avg Percentile';
  const primarySuffix = metric === 'scaledScore' ? ''              : 'th';
  const secondary       = metric === 'scaledScore' ? avgPercentile  : avgScaled;
  const secondaryLabel  = metric === 'scaledScore' ? 'Percentile'   : 'Scaled Score';
  const secondarySuffix = metric === 'scaledScore' ? 'th'           : '';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Coloured top strip */}
      <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: cfg.light }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{cfg.icon}</span>
          <div>
            <h3 className="font-bold text-base leading-tight" style={{ color: cfg.dark }}>{subject}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{count} students assessed</p>
          </div>
        </div>
        <TrendPill delta={delta} direction={direction} />
      </div>

      {/* Primary metric — large */}
      <div className="px-5 pt-5 pb-3">
        <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1.5">
          {primaryLabel}
        </div>
        <div className="text-4xl font-black leading-none" style={{ color: cfg.accent }}>
          {primary ?? '—'}
          {primary !== null && primarySuffix && (
            <span className="text-lg font-semibold text-slate-400">{primarySuffix}</span>
          )}
        </div>
      </div>

      {/* Secondary metric — small */}
      <div className="px-5 pb-4 pt-2 border-t border-slate-100 flex items-center gap-1.5">
        <span className="text-xs text-slate-400">{secondaryLabel}:</span>
        <span className="text-xs font-bold text-slate-600">
          {secondary ?? '—'}{secondary !== null ? secondarySuffix : ''}
        </span>
      </div>
    </div>
  );
}

export default function SubjectCards({ subjects, metric }) {
  return (
    <section>
      <SectionTitle title="Subject Performance" subtitle="Latest assessment date · vs previous period" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {subjects.map(s => <SubjectCard key={s.subject} {...s} metric={metric} />)}
      </div>
    </section>
  );
}

export function SectionTitle({ title, subtitle }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-6 bg-green-700 rounded-full shrink-0" />
      <div>
        <h2 className="text-lg font-bold text-slate-800 leading-none">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
