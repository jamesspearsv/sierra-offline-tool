import { db } from './connection.js';
import { checkouts } from './schema.js';

export async function selectCheckouts() {
  try {
    const rows = await db.select().from(checkouts);
    return rows;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function insertCheckout(
  patronBarcode: string,
  itemBarcodes: string
) {
  try {
    await db.insert(checkouts).values({ patronBarcode, itemBarcodes });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
