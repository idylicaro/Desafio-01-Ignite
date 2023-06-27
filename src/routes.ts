import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

const database = new Database();

export const routes = [
  {
    path: '/tasks',
    method: 'GET',
    handler: async (req: any, res: any) => {
      const tasks = database.select('tasks');
      res.end(JSON.stringify(tasks));
    }
  },
  {
    path: '/tasks',
    method: 'POST',
    handler: async (req: any, res: any) => {
      const { title, description } = req.body;

      const task = {
        id: randomUUID(),
        title,
        description
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  }
];
