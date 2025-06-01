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

export async function insertCheckouts(
  patronBarcode: string,
  itemBarcodes: string[]
): Promise<Result<{ patronBarcode: string; itemBarcodes: string[] }>> {
  try {
    await db.transaction(async (tx) => {
      for (const itemBarcode of itemBarcodes) {
        if (itemBarcode === 'debug') throw new Error('Debuging Error');
        await tx.insert(checkouts).values({ patronBarcode, itemBarcode });
      }
    });

    return {
      success: true,
      message: 'Insert successful',
      data: { patronBarcode, itemBarcodes },
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
        data: { patronBarcode, itemBarcodes },
      };
    }

    throw new Error('Server error');
  }
}
