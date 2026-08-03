CREATE TABLE `course_lessons` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`section_id` integer NOT NULL,
	`title` text NOT NULL,
	`lesson_type` text DEFAULT 'video' NOT NULL,
	`video_url` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`duration_minutes` integer DEFAULT 0 NOT NULL,
	`is_preview` integer DEFAULT 0 NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `course_sections` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`course_id` integer NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lesson_progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`enrollment_id` integer NOT NULL,
	`lesson_id` integer NOT NULL,
	`completed` integer DEFAULT 0 NOT NULL,
	`completed_at` text DEFAULT '' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
