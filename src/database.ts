import fs from 'node:fs/promises';
import { CreateTaskDTO, UpdateTaskDTO } from './models/tasks/index.js';
import { ErrorTaskNotFound } from './helpers.js';

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

  select(table: string, search: any): any[] {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row: any) => {
        return Object.entries(search).some(([key, value]: [string, string]) => {
          return row[key].toLowerCase().includes(value.toLowerCase());
        });
      });
    }
    return data;
  }

  insert(table: string, data: CreateTaskDTO): any {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    this.#persist();
    return data;
  }

  update(table: string, id: string, data: UpdateTaskDTO): void {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );
    if (rowIndex > -1) {
      Object.entries(data).forEach(([key, value]: [string, string]) => {
        if (value !== undefined) this.#database[table][rowIndex][key] = value;
      });
      this.#persist();
    } else {
      throw ErrorTaskNotFound;
    }
  }

  delete(table: string, id: string): void {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );
    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    } else {
      throw ErrorTaskNotFound;
    }
  }

  updateTaskState(table: string, id: string): void {
    const rowIndex = this.#database[table].findIndex(
      (row: any) => row.id === id
    );
    if (rowIndex > -1) {
      this.#database[table][rowIndex].is_done =
        !this.#database[table][rowIndex].is_done;
      this.#persist();
    } else {
      throw ErrorTaskNotFound;
    }
  }
}
