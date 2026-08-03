CREATE TABLE `marketing_banners` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`category` text DEFAULT 'general' NOT NULL,
	`placement` text DEFAULT 'home-top' NOT NULL,
	`desktop_image` text DEFAULT '' NOT NULL,
	`mobile_image` text DEFAULT '' NOT NULL,
	`heading` text DEFAULT '' NOT NULL,
	`subheading` text DEFAULT '' NOT NULL,
	`cta_label` text DEFAULT '' NOT NULL,
	`target_url` text DEFAULT '' NOT NULL,
	`starts_at` text DEFAULT '' NOT NULL,
	`ends_at` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `module_visibility` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`module_key` text NOT NULL,
	`label` text NOT NULL,
	`frontend_path` text DEFAULT '' NOT NULL,
	`enabled` integer DEFAULT 1 NOT NULL,
	`maintenance_message` text DEFAULT '' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `module_visibility_module_key_unique` ON `module_visibility` (`module_key`);--> statement-breakpoint
CREATE TABLE `service_enquiries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`service` text NOT NULL,
	`project_type` text DEFAULT '' NOT NULL,
	`location` text DEFAULT '' NOT NULL,
	`budget` text DEFAULT '' NOT NULL,
	`preferred_contact` text DEFAULT 'phone' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`assigned_to` text DEFAULT '' NOT NULL,
	`source` text DEFAULT 'website' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `service_enquiries_reference_unique` ON `service_enquiries` (`reference`);--> statement-breakpoint
CREATE TABLE `shipping_rules` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`basis` text DEFAULT 'weight' NOT NULL,
	`zones` text DEFAULT 'India' NOT NULL,
	`min_weight` integer DEFAULT 0 NOT NULL,
	`max_weight` integer DEFAULT 0 NOT NULL,
	`min_volume` integer DEFAULT 0 NOT NULL,
	`max_volume` integer DEFAULT 0 NOT NULL,
	`base_price` integer DEFAULT 0 NOT NULL,
	`rate_per_kg` integer DEFAULT 0 NOT NULL,
	`rate_per_cubic_meter` integer DEFAULT 0 NOT NULL,
	`min_charge` integer DEFAULT 0 NOT NULL,
	`free_threshold` integer DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`priority` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
