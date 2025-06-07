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

const app = new Hono();

app.use(cors());
app.use(logger());
app.use(
  '/assets/*',
  serveStatic({
    /* BUG
     * Relative root path will be different
     * when using pnpm preview and running in production.
     * How to handle this?
     */
    root: process.env.NODE_ENV === 'production' ? './client' : './dist/client',
    onNotFound(path, c) {
      console.log('---> Current working dir: ', process.cwd());
      console.log('---> Looking for:', path);
    },
  })
);
app.route('/api', api);

app.get('/*', async (c) => {
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
