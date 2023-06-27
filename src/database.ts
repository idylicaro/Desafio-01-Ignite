import fs from 'node:fs/promises';

// The URL constructor is used to create a URL object from a string.
// The PATH is relative to the current file (database.ts).
const DATABASEPATH = new URL('../database.json', import.meta.url);

export class Database {
  #database = {};

  constructor() {
    fs.readFile(DATABASEPATH, 'utf8')
      .then((data) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist = async () => {
    await fs.writeFile(DATABASEPATH, JSON.stringify(this.#database));
  };

  select(table) {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    return data;
  }
}
