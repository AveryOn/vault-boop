PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`access_token_id` text,
	`last_user_action_id` text NOT NULL,
	`device_id` text NOT NULL,
	`status` text DEFAULT 'ACTIVE',
	`expires_at` text NOT NULL,
	`last_used_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`access_token_id`) REFERENCES `access_token`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`last_user_action_id`) REFERENCES `user_action`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_session`("id", "user_id", "access_token_id", "last_user_action_id", "device_id", "status", "expires_at", "last_used_at", "created_at") SELECT "id", "user_id", "access_token_id", "last_user_action_id", "device_id", "status", "expires_at", "last_used_at", "created_at" FROM `session`;--> statement-breakpoint
DROP TABLE `session`;--> statement-breakpoint
ALTER TABLE `__new_session` RENAME TO `session`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `access_token` ADD `replaced_by` text;