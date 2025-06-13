import { eq, isNull } from 'drizzle-orm';
import { db } from './connection.js';
import { checkouts } from './schema.js';
import type { Result } from '@packages/common';

export async function selectCheckouts(): Promise<
  Result<{ id: number; patronBarcode: string; itemBarcode: string }[]>
> {
  try {
    const rows = await db
      .select()
      .from(checkouts)
      .where(isNull(checkouts.syncStatus));
    return { success: true, data: rows };
  } catch (error) {
    if (error instanceof Error) return { success: false, error };
    throw new Error('Server Error');
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
        await tx.insert(checkouts).values({
          patronBarcode,
          itemBarcode,
          checkoutDate: new Date().toISOString().replace('T', ' '),
        });
      }
    });

    return {
      success: true,
      data: { patronBarcode, itemBarcodes },
    };
  } catch (error) {
    if (error instanceof Error) return { success: false, error };
    throw new Error('Server error');
  }
}

export async function UpdateCheckouts(checkoutIDs: number[]): Promise<Result> {
  try {
    await db.transaction(async (tx) => {
      for (const id of checkoutIDs) {
        await tx
          .update(checkouts)
          .set({ syncStatus: new Date().toISOString().replace('T', ' ') })
          .where(eq(checkouts.id, id));
      }
    });

    return { success: true, data: 'Updated all checkouts' };
  } catch (error) {
    if (error instanceof Error) return { success: false, error };
    throw new Error('Server Error');
  }
}
