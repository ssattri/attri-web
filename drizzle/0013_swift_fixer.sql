CREATE TABLE `notification_reads` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`notification_id` integer NOT NULL,
	`user_email` text NOT NULL,
	`read_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `portal_notifications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`audience` text DEFAULT 'all' NOT NULL,
	`recipient_email` text DEFAULT '' NOT NULL,
	`severity` text DEFAULT 'info' NOT NULL,
	`action_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`expires_at` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_email` text NOT NULL,
	`account_type` text NOT NULL,
	`plan_name` text NOT NULL,
	`billing_cycle` text DEFAULT 'monthly' NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`starts_at` text DEFAULT '' NOT NULL,
	`ends_at` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subscriptions_reference_unique` ON `subscriptions` (`reference`);