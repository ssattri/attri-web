CREATE TABLE `consultation_payment_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`appointment_id` integer NOT NULL,
	`customer_email` text NOT NULL,
	`amount` integer NOT NULL,
	`razorpay_order_id` text NOT NULL,
	`razorpay_payment_id` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`signature_verified` integer DEFAULT 0 NOT NULL,
	`failure_reason` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consultation_payment_attempts_reference_unique` ON `consultation_payment_attempts` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `consultation_payment_attempts_razorpay_order_id_unique` ON `consultation_payment_attempts` (`razorpay_order_id`);--> statement-breakpoint
ALTER TABLE `appointments` ADD `package_slug` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `amount` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `duration_minutes` integer DEFAULT 60 NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `meeting_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `assigned_to` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `appointments` ADD `admin_notes` text DEFAULT '' NOT NULL;