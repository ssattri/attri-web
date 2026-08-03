CREATE TABLE `consultant_availability_overrides` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`consultant_id` integer NOT NULL,
	`date` text NOT NULL,
	`available_from` text DEFAULT '' NOT NULL,
	`available_to` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'available' NOT NULL,
	`capacity` integer DEFAULT 0 NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
