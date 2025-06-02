CREATE TABLE `checkouts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`patronBarcode` text NOT NULL,
	`itemBarcode` text NOT NULL,
	`checkoutDate` text NOT NULL,
	`syncStatus` text
);
