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

// TODO: handle failed insertions
app.post('/checkout', async (c) => {
  // To get the JSON body:
  const { patronBarcode, itemBarcodes } = await c.req.json();

  if (typeof patronBarcode !== 'string' || !(itemBarcodes instanceof Array)) {
    return c.text('Bad request');
  }

  const inserts = itemBarcodes.map((barcode) =>
    insertCheckout(patronBarcode, barcode as string)
  );
  const results = await Promise.allSettled(inserts); // all promises always fulfilled
  const failures = results.filter((result) => result.status === 'rejected');
  console.log(results);
  console.log(failures);
  return c.json(failures);
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
