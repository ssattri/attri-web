CREATE TABLE `consultant_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`display_name` text NOT NULL,
	`professional_title` text DEFAULT 'Consultant' NOT NULL,
	`specialties` text DEFAULT '' NOT NULL,
	`bio` text DEFAULT '' NOT NULL,
	`languages` text DEFAULT 'Hindi, English' NOT NULL,
	`experience_years` integer DEFAULT 0 NOT NULL,
	`photo_url` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`whatsapp` text DEFAULT '' NOT NULL,
	`meeting_url` text DEFAULT '' NOT NULL,
	`call_enabled` integer DEFAULT 1 NOT NULL,
	`chat_enabled` integer DEFAULT 1 NOT NULL,
	`video_enabled` integer DEFAULT 1 NOT NULL,
	`fee` integer DEFAULT 0 NOT NULL,
	`duration_minutes` integer DEFAULT 30 NOT NULL,
	`available_days` text DEFAULT 'Mon,Tue,Wed,Thu,Fri' NOT NULL,
	`available_from` text DEFAULT '10:00' NOT NULL,
	`available_to` text DEFAULT '18:00' NOT NULL,
	`simultaneous_capacity` integer DEFAULT 1 NOT NULL,
	`availability_status` text DEFAULT 'available' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consultant_profiles_email_unique` ON `consultant_profiles` (`email`);--> statement-breakpoint
CREATE TABLE `consultation_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`session_id` integer NOT NULL,
	`sender_email` text NOT NULL,
	`sender_role` text NOT NULL,
	`message` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `consultation_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`user_email` text NOT NULL,
	`user_name` text NOT NULL,
	`consultant_id` integer NOT NULL,
	`consultation_mode` text NOT NULL,
	`scheduled_date` text NOT NULL,
	`scheduled_time` text NOT NULL,
	`duration_minutes` integer DEFAULT 30 NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`amount` integer DEFAULT 0 NOT NULL,
	`meeting_url` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consultation_sessions_reference_unique` ON `consultation_sessions` (`reference`);