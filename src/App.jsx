import React, { useState } from 'react';
import { parseExcelFile } from './utils/parseExcel';
import {
  getHeaderStats, getSubjectStats, getTrendData,
  getClassHeatmap, getTopBottom, getSchools, getSchoolComparison,
} from './utils/processData';

import UploadScreen      from './components/UploadScreen';
import DashboardHeader   from './components/DashboardHeader';
import Controls          from './components/Controls';
import SubjectCards      from './components/SubjectCards';
import SchoolComparison  from './components/SchoolComparison';
import TrendChart        from './components/TrendChart';
import ClassHeatmap      from './components/ClassHeatmap';
import TopBottomTable    from './components/TopBottomTable';

const STORAGE_KEY = 'edu-girls-data-v1';

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [uploading,      setUploading]      = useState(false);
  const [error,          setError]          = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null); // null = all schools
  const [metric,         setMetric]         = useState('scaledScore');

  const handleFile = async (file) => {
    setUploading(true);
    setError(null);
    try {
      const parsed = await parseExcelFile(file);
      setData(parsed);
      setSelectedSchool(null); // reset filter on new upload
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed)); } catch {}
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── Before upload ──────────────────────────────────────────────────────────
  if (!data) {
    return <UploadScreen onFile={handleFile} uploading={uploading} error={error} />;
  }

  // ── Derived data ───────────────────────────────────────────────────────────
  const schools      = getSchools(data);
  const filteredData = selectedSchool ? data.filter(r => r.school === selectedSchool) : data;

  const headerStats  = getHeaderStats(filteredData);
  const subjectStats = getSubjectStats(filteredData, metric);
  const trendData    = getTrendData(filteredData, metric);
  const heatmap      = getClassHeatmap(filteredData, metric);
  const { top, bottom } = getTopBottom(filteredData, metric);

  // School comparison always uses full (unfiltered) data; shown only when 2+ schools exist
  const showComparison  = schools.length >= 2;
  const comparisonData  = showComparison ? getSchoolComparison(data, metric) : null;

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">

      <DashboardHeader
        stats={headerStats}
        onUpload={handleFile}
        uploading={uploading}
        metric={metric}
      />

      <Controls
        schools={schools}
        selectedSchool={selectedSchool}
        onSchoolChange={setSelectedSchool}
        metric={metric}
        onMetricChange={setMetric}
      />

      {error && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
            <p className="text-sm text-red-700"><strong>Upload failed:</strong> {error}</p>
            <button onClick={() => setError(null)} className="text-xs text-red-500 hover:text-red-700 underline shrink-0">
              Dismiss
            </button>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <SubjectCards   subjects={subjectStats} metric={metric} />
        {showComparison && <SchoolComparison data={comparisonData} metric={metric} />}
        <TrendChart     data={trendData} metric={metric} />
        <ClassHeatmap   matrix={heatmap.matrix} min={heatmap.min} max={heatmap.max} metric={metric} />
        <TopBottomTable top={top} bottom={bottom} metric={metric} />
      </main>

      <footer className="border-t border-slate-200 bg-white mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-slate-400">Vimukti / Edu-GIRLS · Student Assessment Dashboard</p>
          <p className="text-xs text-slate-400">
            {filteredData.length.toLocaleString()} records
            {selectedSchool ? ` · ${selectedSchool}` : ` · ${data.length.toLocaleString()} total`}
          </p>
        </div>
      </footer>
    </div>
  );
}
