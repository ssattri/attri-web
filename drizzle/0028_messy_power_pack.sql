ALTER TABLE `testimonials` ADD `testimonial_type` text DEFAULT 'text' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `youtube_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `video_object_key` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `video_file_name` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `video_content_type` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `thumbnail_url` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `featured` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `testimonials` ADD `updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL;