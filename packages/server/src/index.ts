import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import {
  insertCheckouts,
  selectCheckouts,
  UpdateCheckouts,
  type Result,
} from './db/queries.js';

const app = new Hono();

app.use('/*', cors());

app.get('/checkouts', async (c) => {
  const result = await selectCheckouts();
  return c.json(result);
});

// TODO: handle failed insertions
app.post('/checkouts', async (c) => {
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

app.post('/sync', async (c) => {
  const checkoutIDs = await c.req.json();
  if (!(checkoutIDs instanceof Array)) {
    return c.json({ success: false, message: 'Bad request' });
  }

  const result = await UpdateCheckouts(checkoutIDs as number[]);
  return c.json(result);
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
