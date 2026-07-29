ALTER TABLE `courses` ADD `image_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `instructor` text DEFAULT 'Attri Academy Faculty' NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `certificate` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `show_in_shop` integer DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE `products` ADD `image_url` text DEFAULT '' NOT NULL;