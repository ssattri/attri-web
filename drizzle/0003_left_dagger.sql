CREATE TABLE `courses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`category` text NOT NULL,
	`level` text DEFAULT 'Beginner' NOT NULL,
	`mode` text DEFAULT 'Recorded' NOT NULL,
	`duration` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`price` integer DEFAULT 0 NOT NULL,
	`lessons` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `courses_slug_unique` ON `courses` (`slug`);--> statement-breakpoint
CREATE TABLE `enrollments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`course_id` integer NOT NULL,
	`student_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`experience` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `enrollments_reference_unique` ON `enrollments` (`reference`);