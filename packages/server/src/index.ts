import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { readFile } from 'node:fs/promises';
import { api } from './apiRouter.js';
import { logger } from 'hono/logger';

// TODO: fix this!
// const __dirname = fileURLToPath(import.meta.dirname);
// console.log(__dirname);

const __dirname = import.meta.dirname;
console.log(__dirname);

const app = new Hono();

app.use(cors());
app.use(logger());
app.use(
  '/assets/*',
  serveStatic({
    root: '/client',
    onNotFound(path) {
      console.log('#############');
      console.log('* NOT FOUND *');
      console.log('#############');
      console.log('current dir:', __dirname);
      console.log(path);
    },
  })
);
app.route('/api', api);

// TODO: fix this!
app.get('*', async (c) => {
  // if (c.req.path.match('\.')) return;
  return c.html(
    readFile(__dirname + '/client/index.html', { encoding: 'utf-8' })
  );
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
