import { db } from './connection.js';
import { checkouts } from './schema.js';

export type Result<T = string> =
  | {
      success: true;
      message: string;
      data: T;
    }
  | { success: false; message: string; data: T };

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
  itemBarcode: string
): Promise<Result<{ patronBarcode: string; itemBarcode: string }>> {
  try {
    if (itemBarcode === 'james') throw new Error('debug error');
    await db.insert(checkouts).values({ patronBarcode, itemBarcode });
    return {
      success: true,
      message: 'Insert successful',
      data: { patronBarcode, itemBarcode },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: { patronBarcode, itemBarcode },
      };
    }

    throw new Error('Server error');
  }
}
