CREATE TABLE `portal_reviews` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_email` text NOT NULL,
	`customer_name` text DEFAULT '' NOT NULL,
	`account_type` text DEFAULT 'user' NOT NULL,
	`target_type` text DEFAULT 'general' NOT NULL,
	`target_key` text DEFAULT '' NOT NULL,
	`target_name` text DEFAULT '' NOT NULL,
	`rating` integer DEFAULT 5 NOT NULL,
	`title` text DEFAULT '' NOT NULL,
	`review` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`admin_reply` text DEFAULT '' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `portal_reviews_reference_unique` ON `portal_reviews` (`reference`);--> statement-breakpoint
CREATE TABLE `tax_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`legal_name` text DEFAULT '' NOT NULL,
	`gstin` text DEFAULT '' NOT NULL,
	`pan` text DEFAULT '' NOT NULL,
	`registered_address` text DEFAULT '' NOT NULL,
	`state_code` text DEFAULT '' NOT NULL,
	`default_gst_rate` integer DEFAULT 18 NOT NULL,
	`default_service_sac` text DEFAULT '998311' NOT NULL,
	`invoice_prefix` text DEFAULT 'AAVC' NOT NULL,
	`invoice_terms` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE `invoices` ADD `gstin` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `hsn_sac` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `taxable_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `cgst_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `sgst_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `igst_amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `account_type` text DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `issue_area` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `page_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `device_info` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `assigned_to` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `admin_reply` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `support_tickets` ADD `updated_at` text DEFAULT '' NOT NULL;
