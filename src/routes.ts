import { randomUUID } from 'node:crypto';
import { Database } from './database.js';

export interface Task {
  id: string;
  title: string;
  description: string;
}

const database = new Database();

export interface Route {
  path: string;
  method: string;
  handler: (req: any, res: any) => Promise<void>;
}

export const routes: Route[] = [
  {
    path: '/tasks',
    method: 'GET',
    handler: async (req: any, res: any): Promise<void> => {
      const tasks: Task[] = database.select('tasks');
      res.end(JSON.stringify(tasks));
    }
  },
  {
    path: '/tasks',
    method: 'POST',
    handler: async (req: any, res: any): Promise<void> => {
      const { title, description }: { title: string; description: string } =
        req.body;

      const task: Task = {
        id: randomUUID(),
        title,
        description
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  }
];
