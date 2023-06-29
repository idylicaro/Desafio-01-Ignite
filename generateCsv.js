import fs from 'node:fs';
const nROWS = 10000;

const CSV_FILE_NAME = 'data.csv';
const filePath = new URL(CSV_FILE_NAME, import.meta.url);

const data = [];
for (let i = 0; i < nROWS; i++) {
  const row = [`Task ${i}`, `Description ${i}`];
  data.push(row);
}

function convertToCSV(header, data) {
  const csv = [];
  if (header) {
    csv.push(header.join(';'));
  }
  data.forEach((row) => csv.push(row.join(';')));
  return csv.join('\n');
}

const csv = convertToCSV(null, data);
fs.writeFileSync(filePath, csv);
