import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { readFile } from 'node:fs/promises';
import { api } from './apiRouter.js';

const app = new Hono();

app.use(cors());
app.use('/assets/*', serveStatic({ root: './client' }));
app.route('/api', api);
app.get('/*', async (c) => {
  return c.html(readFile('/app/client/index.html', { encoding: 'utf-8' }));
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
