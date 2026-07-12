PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`username` text NOT NULL,
	`master_password_hash` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "first_name", "last_name", "username", "master_password_hash", "created_at", "updated_at", "deleted_at") SELECT "id", "first_name", "last_name", "username", "master_password_hash", "created_at", "updated_at", "deleted_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `user_key` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user_key` ADD `key_hash` text NOT NULL;