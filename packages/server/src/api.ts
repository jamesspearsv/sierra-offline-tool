import { Hono } from 'hono';
import {
  insertCheckouts,
  selectCheckouts,
  UpdateCheckouts,
} from './db/queries.js';
import type { Result } from '@packages/common';

export const api = new Hono();

/** 
TODO: update endpoint responses
- Each endpoint should return... 
- an appropriate status code
- either data or an error message 
*/
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
    const { patronBarcode, itemBarcodes } = await c.req.json();

    // Perform basic validation
    if (typeof patronBarcode !== 'string' || !(itemBarcodes instanceof Array)) {
      c.status(400);
      return c.json({
        success: false,
        message: 'Incomplete request',
      } as Result);
    }

    if (patronBarcode.length != 14) {
      c.status(400);
      return c.json({
        success: false,
        message: 'Bad patron barcode',
      } as Result);
    }

    itemBarcodes.forEach((barcode) => {
      if (typeof barcode !== 'string' || barcode.length !== 14)
        c.json({ success: false, message: 'Bad item barcode' } as Result);
    });

    // Insert checkouts and await the result
    const results = await insertCheckouts(
      patronBarcode,
      itemBarcodes as string[]
    );

    if (!results.success)
      return c.json({ message: 'Server Error' }).status(500);

    return c.json(results);
  });
