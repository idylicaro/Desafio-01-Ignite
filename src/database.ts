import fs from 'node:fs/promises';

interface DatabaseTable {
  [key: string]: any[];
}

// The URL constructor is used to create a URL object from a string.
// The PATH is relative to the current file (database.ts).
const DATABASEPATH = new URL('../database.json', import.meta.url);

export class Database {
  #database: DatabaseTable = {};

  constructor() {
    fs.readFile(DATABASEPATH, 'utf8')
      .then((data: string) => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist = async () => {
    await fs.writeFile(DATABASEPATH, JSON.stringify(this.#database));
  };

  select(table: string): any[] {
    const data = this.#database[table] ?? [];
    return data;
  }

  insert(table: string, data: any): any {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }
}
