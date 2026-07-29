ALTER TABLE `products` ADD `item_type` text DEFAULT 'physical' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `delivery_mode` text DEFAULT 'Online' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `special_price` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `special_from` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `special_to` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `duration` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `classes` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `sort_order` integer DEFAULT 0 NOT NULL;