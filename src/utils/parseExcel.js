import * as XLSX from 'xlsx';

/**
 * Converts an Excel cell date value to a YYYY-MM key (month granularity).
 * Handles: JS Date objects (from cellDates:true), Excel serial numbers, strings.
 */
function toDateKey(val) {
  if (val == null || val === '') return 'Unknown';

  let d = null;
  if (val instanceof Date && !isNaN(val)) {
    d = val;
  } else if (typeof val === 'number') {
    // Excel date serial — convert to JS Date
    d = new Date(Math.round((val - 25569) * 86400 * 1000));
  } else if (typeof val === 'string' && val.trim()) {
    const parsed = new Date(val.trim());
    d = isNaN(parsed) ? null : parsed;
  }

  if (d) {
    const yyyy = d.getUTCFullYear();
    const mm   = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  }
  return String(val).trim() || 'Unknown';
}

/**
 * Reads the "Raw Table" sheet from an .xlsx file.
 * Layout: row 1 = headers, row 2+ = data.
 */
export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer   = new Uint8Array(e.target.result);
        const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });

        if (!workbook.SheetNames.includes('Raw Table')) {
          const found = workbook.SheetNames.join(', ') || 'none';
          throw new Error(`Sheet "Raw Table" not found. Sheets in this file: ${found}`);
        }

        const sheet   = workbook.Sheets['Raw Table'];
        const allRows = XLSX.utils.sheet_to_json(sheet, {
          header: 1,   // return array-of-arrays
          defval: '',
          raw: true,   // preserve native types (Date, number)
        });

        // Row index 0 = headers, index 1+ = data
        if (allRows.length < 2) {
          throw new Error('Too few rows. Expected headers on row 1 and data from row 2.');
        }

        const headers = allRows[0].map(h => String(h ?? '').trim());

        // Validate required columns
        for (const required of ['Date', 'Subject', 'Scaled Score']) {
          if (!headers.includes(required)) {
            throw new Error(
              `Column "${required}" not found in row 1. ` +
              `Found columns: ${headers.filter(Boolean).join(', ')}`
            );
          }
        }

        const idx = (name) => headers.indexOf(name);

        const records = [];
        for (let i = 1; i < allRows.length; i++) {
          const row = allRows[i];
          if (!row.length || row.every(c => c === '' || c == null)) continue;

          const subject = String(row[idx('Subject')] ?? '').trim();
          if (!subject) continue; // skip rows with no subject

          records.push({
            school:      idx('School') >= 0 ? String(row[idx('School')] ?? '').trim() : '',
            dateKey:     toDateKey(row[idx('Date')]),
            subject,
            sno:         String(row[idx('S.no')]    ?? '').trim(),
            name:        String(row[idx('Name')]    ?? '').trim(),
            score:       parseFloat(row[idx('Score')])         || 0,
            scaledScore: parseFloat(row[idx('Scaled Score')])  || 0,
            percentile:  parseFloat(row[idx('Percentile')])    || 0,
            section:     String(row[idx('Section')] ?? '').trim(),
            class:       String(row[idx('Class')]   ?? '').trim(),
          });
        }

        if (records.length === 0) {
          throw new Error('No valid data rows found. Make sure data starts from row 2 and Subject is filled in.');
        }

        resolve(records);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.readAsArrayBuffer(file);
  });
}
