import http from 'node:http';
import { routes, Route } from './routes.js';
import { json } from './middlewares/json.js';

const server = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { method, url } = req;

    await json(req, res);

    const route: Route | undefined = routes.find((route: Route) => {
      return route.method === method && route.path === url;
    });

    if (route) {
      return route.handler(req, res);
    }
    return res.writeHead(404).end();
  }
);

server.listen(3333);

console.log('🚀 : Server running at http://localhost:3333');
