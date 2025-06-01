import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const checkouts = sqliteTable('checkouts', {
  id: int().primaryKey({ autoIncrement: true }),
  patronBarcode: text().notNull(),
  itemBarcode: text().notNull(),
  checkoutDate: text().notNull(),
  syncStatus: text(), // Either null | date string in YYYY-MM-DD HH:MM:SS.MMMZ
});
