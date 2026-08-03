CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`excerpt` text DEFAULT '' NOT NULL,
	`content` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'Vastu' NOT NULL,
	`tags` text DEFAULT '' NOT NULL,
	`author` text DEFAULT 'CE. SS Attri' NOT NULL,
	`cover_image_url` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`featured` integer DEFAULT 0 NOT NULL,
	`published_at` text DEFAULT '' NOT NULL,
	`reading_minutes` integer DEFAULT 5 NOT NULL,
	`meta_title` text DEFAULT '' NOT NULL,
	`meta_keywords` text DEFAULT '' NOT NULL,
	`meta_description` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);