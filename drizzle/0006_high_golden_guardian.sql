CREATE TABLE `certificates` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`student_name` text NOT NULL,
	`student_email` text NOT NULL,
	`course_title` text NOT NULL,
	`issued_date` text NOT NULL,
	`status` text DEFAULT 'issued' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `certificates_reference_unique` ON `certificates` (`reference`);--> statement-breakpoint
CREATE TABLE `client_files` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_email` text NOT NULL,
	`file_name` text NOT NULL,
	`object_key` text NOT NULL,
	`content_type` text NOT NULL,
	`size` integer NOT NULL,
	`category` text DEFAULT 'Project file' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `client_files_reference_unique` ON `client_files` (`reference`);--> statement-breakpoint
CREATE UNIQUE INDEX `client_files_object_key_unique` ON `client_files` (`object_key`);--> statement-breakpoint
CREATE TABLE `payment_records` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_email` text NOT NULL,
	`purpose` text NOT NULL,
	`gateway` text NOT NULL,
	`transaction_id` text DEFAULT '' NOT NULL,
	`amount` integer NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payment_records_reference_unique` ON `payment_records` (`reference`);--> statement-breakpoint
CREATE TABLE `workflow_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`title` text NOT NULL,
	`assignee` text NOT NULL,
	`due_date` text NOT NULL,
	`priority` text DEFAULT 'normal' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workflow_tasks_reference_unique` ON `workflow_tasks` (`reference`);