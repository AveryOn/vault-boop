CREATE TABLE `access_token` (
	`id` text PRIMARY KEY NOT NULL,
	`token` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`archived_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_action` (
	`id` text PRIMARY KEY NOT NULL,
	`action_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`action_id`) REFERENCES `action`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_action`("id", "action_id", "user_id", "created_at", "updated_at", "deleted_at") SELECT "id", "action_id", "user_id", "created_at", "updated_at", "deleted_at" FROM `user_action`;--> statement-breakpoint
DROP TABLE `user_action`;--> statement-breakpoint
ALTER TABLE `__new_user_action` RENAME TO `user_action`;--> statement-breakpoint
PRAGMA foreign_keys=ON;