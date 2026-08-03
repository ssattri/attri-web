ALTER TABLE `invoices` ADD `order_id` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `order_reference` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `invoice_type` text DEFAULT 'tax-invoice' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `source` text DEFAULT 'manual' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `items_json` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `billing_address` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `customer_phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `place_of_supply` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `payment_reference` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `issue_date` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `terms` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `seller_json` text DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `updated_at` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` ADD `gstin` text DEFAULT '' NOT NULL;
