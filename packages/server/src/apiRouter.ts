import { Hono } from 'hono';
import {
  insertCheckouts,
  selectCheckouts,
  UpdateCheckouts,
} from './db/queries.js';

export const api = new Hono();

api.post('/sync', async (c) => {
  const checkoutIDs = await c.req.json();
  if (!(checkoutIDs instanceof Array)) {
    return c.json({ success: false, message: 'Bad request' });
  }

  const result = await UpdateCheckouts(checkoutIDs as number[]);
  return c.json(result);
});

api
  .get('/checkouts', async (c) => {
    const result = await selectCheckouts();
    return c.json(result);
  })
  .post(async (c) => {
    // To get the JSON body:
    const { patronBarcode, itemBarcodes } = await c.req.json();

    if (typeof patronBarcode !== 'string' || !(itemBarcodes instanceof Array)) {
      c.status(400);
      return c.text('Bad request');
    }

    const results = await insertCheckouts(
      patronBarcode,
      itemBarcodes as string[]
    );

    return c.json(results);
  });
