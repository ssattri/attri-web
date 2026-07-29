CREATE TABLE `client_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_email` text NOT NULL,
	`title` text NOT NULL,
	`report_type` text NOT NULL,
	`summary` text NOT NULL,
	`findings` text DEFAULT '' NOT NULL,
	`recommendations` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `client_reports_reference_unique` ON `client_reports` (`reference`);--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`number` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`description` text NOT NULL,
	`amount` integer NOT NULL,
	`tax_rate` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'issued' NOT NULL,
	`due_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_number_unique` ON `invoices` (`number`);