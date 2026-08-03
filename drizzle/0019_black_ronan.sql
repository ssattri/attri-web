CREATE TABLE `auth_accounts` (
	`email` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`password_hash` text NOT NULL,
	`password_salt` text NOT NULL,
	`account_type` text NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `auth_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`expires_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
