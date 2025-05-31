import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { insertCheckout, selectCheckouts } from './db/queries.js';

const app = new Hono();

// TODO: handle CORS issues
app.use('/*', cors());

app.get('/', async (c) => {
  const rows = await selectCheckouts();
  if (rows) return c.json(rows);
  return c.text('Hello Hono!');
});

app.post('/checkout', async (c) => {
  // To get the JSON body:
  const body = await c.req.json();
  const success = await insertCheckout(body.patronBarcode, body.itemBarcodes);
  if (!success) return c.text('Unable to save checkout');
  return c.text('Checkout saved!');
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
