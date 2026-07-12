PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user_key` (
	`id` text PRIMARY KEY NOT NULL,
	`user_action_id` text NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`key_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`user_action_id`) REFERENCES `user_action`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_user_key`("id", "user_action_id", "user_id", "name", "key_hash", "created_at", "updated_at", "deleted_at") SELECT "id", "user_action_id", "user_id", "name", "key_hash", "created_at", "updated_at", "deleted_at" FROM `user_key`;--> statement-breakpoint
DROP TABLE `user_key`;--> statement-breakpoint
ALTER TABLE `__new_user_key` RENAME TO `user_key`;--> statement-breakpoint
PRAGMA foreign_keys=ON;