CREATE TABLE `consultant_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`owner_email` text NOT NULL,
	`project_name` text NOT NULL,
	`client_name` text NOT NULL,
	`property_type` text DEFAULT 'Residence' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`city` text DEFAULT '' NOT NULL,
	`facing` text DEFAULT 'North' NOT NULL,
	`compass_rotation` integer DEFAULT 0 NOT NULL,
	`floor_plan_key` text DEFAULT '' NOT NULL,
	`floor_plan_name` text DEFAULT '' NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`findings_json` text DEFAULT '[]' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `consultant_projects_reference_unique` ON `consultant_projects` (`reference`);