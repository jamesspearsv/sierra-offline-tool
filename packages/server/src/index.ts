import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { insertCheckouts, selectCheckouts } from './db/queries.js';

const app = new Hono();

// TODO: handle CORS issues
app.use('/*', cors());

app.get('/', async (c) => {
  const rows = await selectCheckouts();
  if (rows) return c.json(rows);
  return c.text('Hello Hono!');
});

// TODO: handle failed insertions
app.post('/checkout', async (c) => {
  // To get the JSON body:
  const { patronBarcode, itemBarcodes } = await c.req.json();

  if (typeof patronBarcode !== 'string' || !(itemBarcodes instanceof Array)) {
    return c.text('Bad request');
  }

  const results = await insertCheckouts(
    patronBarcode,
    itemBarcodes as string[]
  );

  return c.json(results);
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
