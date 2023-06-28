import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';
import { CreateTaskDTO, Task, UpdateTaskDTO } from './models/tasks/index.js';
import { ErrorTaskNotFound } from './helpers.js';

const database = new Database();

export interface Route {
  path: RegExp;
  method: string;
  handler: (req: any, res: any) => Promise<void>;
}

export const routes: Route[] = [
  {
    path: buildRoutePath('/tasks'),
    method: 'GET',
    handler: async (req: any, res: any): Promise<void> => {
      const { search } = req.query;
      const tasks: Task[] = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search
            }
          : null
      );
      res.end(JSON.stringify(tasks));
    }
  },
  {
    path: buildRoutePath('/tasks'),
    method: 'POST',
    handler: async (req: any, res: any): Promise<void> => {
      const { title, description }: CreateTaskDTO = req.body;

      const task: Task = {
        id: randomUUID(),
        title,
        description,
        is_done: false,
        created_at: new Date(),
        updated_at: new Date(),
        completed_at: null
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },
  {
    path: buildRoutePath('/tasks/:id'),
    method: 'PUT',
    handler: async (req: any, res: any): Promise<void> => {
      const { id } = req.params;
      const { title, description }: UpdateTaskDTO = req.body;

      const task: UpdateTaskDTO = {
        title,
        description
      };
      try {
        database.update('tasks', id, task);
      } catch (error) {
        if (error === ErrorTaskNotFound) {
          return res.writeHead(404).end('Task not found');
        }
      }

      return res.writeHead(204).end();
    }
  },
  {
    path: buildRoutePath('/tasks/:id'),
    method: 'DELETE',
    handler: async (req: any, res: any): Promise<void> => {
      const { id } = req.params;
      try {
        database.delete('tasks', id);
      } catch (error) {
        if (error === ErrorTaskNotFound) {
          return res.writeHead(404).end('Task not found');
        }
      }
      return res.writeHead(204).end();
    }
  },
  {
    path: buildRoutePath('/tasks/:id/complete'),
    method: 'PATCH',
    handler: async (req: any, res: any): Promise<void> => {
      const { id } = req.params;
      try {
        database.updateTaskState('tasks', id);
      } catch (error) {
        if (error === ErrorTaskNotFound) {
          return res.writeHead(404).end('Task not found');
        }
      }
      return res.writeHead(204).end();
    }
  }
];
