CREATE TABLE `store_payment_attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`order_id` integer NOT NULL,
	`customer_email` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'INR' NOT NULL,
	`razorpay_order_id` text NOT NULL,
	`razorpay_payment_id` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'created' NOT NULL,
	`signature_verified` integer DEFAULT 0 NOT NULL,
	`failure_reason` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `store_payment_attempts_reference_unique` ON `store_payment_attempts` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `store_payment_attempts_razorpay_order_id_unique` ON `store_payment_attempts` (`razorpay_order_id`);