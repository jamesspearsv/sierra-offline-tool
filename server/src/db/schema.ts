import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const checkouts = sqliteTable('checkouts', {
  id: int().primaryKey({ autoIncrement: true }),
  patronBarcode: text().notNull(),
  itemBarcodes: text().notNull(),
  // syncStatus: text(), // Either null | ISO timestamp representing when synced
});
