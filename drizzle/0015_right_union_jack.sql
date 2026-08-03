CREATE TABLE `consultant_vastu_reports` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`project_id` integer NOT NULL,
	`owner_email` text NOT NULL,
	`client_email` text DEFAULT '' NOT NULL,
	`title` text NOT NULL,
	`executive_summary` text DEFAULT '' NOT NULL,
	`findings_json` text DEFAULT '[]' NOT NULL,
	`remedies_json` text DEFAULT '[]' NOT NULL,
	`conclusion` text DEFAULT '' NOT NULL,
	`prepared_by` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consultant_vastu_reports_reference_unique` ON `consultant_vastu_reports` (`reference`);