CREATE TABLE `integration_secrets` (
	`key` text PRIMARY KEY NOT NULL,
	`cipher_text` text NOT NULL,
	`iv` text NOT NULL,
	`updated_by` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
