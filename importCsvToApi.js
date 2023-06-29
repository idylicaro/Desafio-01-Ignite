import fs from 'node:fs';
import { parse } from 'csv-parse';
import assert from 'assert';

const nROWS = 10000;
const CSV_FILE_NAME = 'data.csv';

const sendRequest = async (payload) => {
  try {
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.error(e);
  }
};

(async () => {
  // CSV path
  const filePath = new URL(CSV_FILE_NAME, import.meta.url);

  // Create an stream of read of csv file
  const fileStream = fs.createReadStream(filePath);

  // Init the parser
  const parser = fileStream.pipe(
    parse({
      delimiter: ';',
      skip_empty_lines: true
    })
  );
  let count = 0;
  // Report start
  process.stdout.write('start\n');
  // Iterate through each records
  for await (const record of parser) {
    const [title, description] = record;
    const payload = {
      title,
      description
    };
    // Send request
    await sendRequest(payload);
    // Report current line
    process.stdout.write(`${count++} ${record.join(',')}\n`);
  }
  // Report end
  process.stdout.write('...done\n');
  // Validation
  assert.strictEqual(count, nROWS);
})();
