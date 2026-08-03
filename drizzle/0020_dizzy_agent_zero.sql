ALTER TABLE `auth_accounts` ADD `failed_login_count` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_accounts` ADD `locked_until` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `auth_accounts` ADD `last_login_at` text DEFAULT '' NOT NULL;