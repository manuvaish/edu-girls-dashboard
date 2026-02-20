export const SUBJECTS = ['Math', 'English', 'Science'];

export const METRIC_META = {
  score:       { key: 'score',       label: 'Score',        colHeader: 'Avg Score',        suffix: '' },
  scaledScore: { key: 'scaledScore', label: 'Scaled Score', colHeader: 'Avg Scaled Score', suffix: '' },
  percentile:  { key: 'percentile',  label: 'Percentile',   colHeader: 'Avg Percentile',   suffix: 'th' },
};

// ─── helpers ────────────────────────────────────────────────────────────────

function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function round1(n) {
  if (n === null || n === undefined) return null;
  return Math.round(n * 10) / 10;
}

function formatDateFull(key) {
  if (!key || key === 'Unknown') return key ?? '';
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    return new Date(Date.UTC(+m[1], +m[2] - 1, 1))
      .toLocaleDateString('en-GB', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  return key;
}

function formatDateShort(key) {
  if (!key || key === 'Unknown') return key ?? '';
  const m = key.match(/^(\d{4})-(\d{2})$/);
  if (m) {
    return new Date(Date.UTC(+m[1], +m[2] - 1, 1))
      .toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
  }
  return key;
}

// ─── exports ────────────────────────────────────────────────────────────────

export function getUniqueDates(data) {
  return [...new Set(data.map(r => r.dateKey).filter(Boolean))].sort();
}

/** Unique non-empty school names, sorted. */
export function getSchools(data) {
  return [...new Set(data.map(r => r.school).filter(Boolean))].sort();
}

/** Summary stats for the header — always returns both metrics. */
export function getHeaderStats(data) {
  const dates      = getUniqueDates(data);
  const latestDate = dates.at(-1) ?? 'Unknown';
  const latest     = data.filter(r => r.dateKey === latestDate);

  const uniqueStudents = new Set(latest.map(r => r.name || r.sno).filter(Boolean)).size;
  const scaledScores   = latest.map(r => r.scaledScore).filter(v => v > 0);
  const percentiles    = latest.map(r => r.percentile).filter(v => v > 0);

  return {
    latestDate,
    latestDateDisplay: formatDateFull(latestDate),
    totalStudents:     uniqueStudents,
    avgScaledScore:    round1(avg(scaledScores)),
    avgPercentile:     round1(avg(percentiles)),
    totalRecords:      data.length,
  };
}

/**
 * Per-subject stats. Always computes both avgScaled and avgPercentile,
 * but the delta/direction is based on the active metric.
 */
export function getSubjectStats(data, metric = 'scaledScore') {
  const dates      = getUniqueDates(data);
  const latestDate = dates.at(-1);
  const prevDate   = dates.length >= 2 ? dates.at(-2) : null;
  const threshold  = metric === 'percentile' ? 3 : 5;

  return SUBJECTS.map(subject => {
    const latestRows = data.filter(r => r.dateKey === latestDate && r.subject === subject);
    const avgScaled  = round1(avg(latestRows.map(r => r.scaledScore).filter(v => v > 0)));
    const avgPercentile = round1(avg(latestRows.map(r => r.percentile).filter(v => v > 0)));

    let delta = null, direction = 'neutral';
    if (prevDate) {
      const prevRows = data.filter(r => r.dateKey === prevDate && r.subject === subject);
      const prevAvg  = avg(prevRows.map(r => r[metric]).filter(v => v > 0));
      const curAvg   = avg(latestRows.map(r => r[metric]).filter(v => v > 0));
      if (prevAvg !== null && curAvg !== null) {
        delta     = round1(curAvg - prevAvg);
        direction = delta > threshold ? 'up' : delta < -threshold ? 'down' : 'neutral';
      }
    }

    return { subject, avgScaled, avgPercentile, delta, direction, count: latestRows.length };
  });
}

/** Line chart data — one point per date, values from the active metric. */
export function getTrendData(data, metric = 'scaledScore') {
  return getUniqueDates(data).map(dateKey => {
    const point = { dateKey, dateLabel: formatDateShort(dateKey) };
    SUBJECTS.forEach(subject => {
      const vals = data
        .filter(r => r.dateKey === dateKey && r.subject === subject)
        .map(r => r[metric]).filter(v => v > 0);
      point[subject] = vals.length ? round1(avg(vals)) : null;
    });
    return point;
  });
}

/** Heatmap matrix with values from the active metric. */
export function getClassHeatmap(data, metric = 'scaledScore') {
  const classes = [...new Set(data.map(r => r.class).filter(Boolean))].sort((a, b) => {
    const na = Number(a), nb = Number(b);
    return !isNaN(na) && !isNaN(nb) ? na - nb : a.localeCompare(b);
  });

  const matrix = classes.map(cls => {
    const row = { class: cls };
    SUBJECTS.forEach(subject => {
      const vals = data
        .filter(r => r.class === cls && r.subject === subject)
        .map(r => r[metric]).filter(v => v > 0);
      row[subject] = vals.length ? round1(avg(vals)) : null;
    });
    return row;
  });

  const allVals = matrix.flatMap(row => SUBJECTS.map(s => row[s])).filter(v => v !== null);
  return {
    matrix,
    min: allVals.length ? Math.min(...allVals) : 0,
    max: allVals.length ? Math.max(...allVals) : 100,
  };
}

/** Top/bottom 5 class-subject combos ranked by the active metric. */
export function getTopBottom(data, metric = 'scaledScore') {
  const classes = [...new Set(data.map(r => r.class).filter(Boolean))];
  const combos  = [];

  classes.forEach(cls => {
    SUBJECTS.forEach(subject => {
      const vals = data
        .filter(r => r.class === cls && r.subject === subject)
        .map(r => r[metric]).filter(v => v > 0);
      if (vals.length) {
        combos.push({ class: cls, subject, avgVal: round1(avg(vals)), count: vals.length });
      }
    });
  });

  return {
    top:    [...combos].sort((a, b) => b.avgVal - a.avgVal).slice(0, 5),
    bottom: [...combos].sort((a, b) => a.avgVal - b.avgVal).slice(0, 5),
  };
}

/**
 * School comparison — one row per school, subject columns use active metric.
 * Truncates long school names for chart display.
 */
export function getSchoolComparison(data, metric = 'scaledScore') {
  return getSchools(data).map(school => {
    const rows  = data.filter(r => r.school === school);
    const point = {
      school:   school.length > 22 ? school.slice(0, 20) + '…' : school,
      fullName: school,
    };
    SUBJECTS.forEach(subject => {
      const vals = rows.filter(r => r.subject === subject).map(r => r[metric]).filter(v => v > 0);
      point[subject] = vals.length ? round1(avg(vals)) : null;
    });
    return point;
  });
}

/** Cell colour for the heatmap. */
export function getCellStyle(value, min, max) {
  if (value === null) return { bg: '#f8fafc', text: '#cbd5e1' };
  if (max <= min)     return { bg: '#d1fae5', text: '#065f46' };
  const pct = (value - min) / (max - min);
  if (pct < 0.20) return { bg: '#fecaca', text: '#991b1b' };
  if (pct < 0.40) return { bg: '#fed7aa', text: '#7c2d12' };
  if (pct < 0.60) return { bg: '#fef08a', text: '#78350f' };
  if (pct < 0.80) return { bg: '#bbf7d0', text: '#14532d' };
  return               { bg: '#4ade80', text: '#14532d' };
}
