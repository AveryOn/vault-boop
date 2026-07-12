PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_action` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deleted_at` text
);
--> statement-breakpoint
INSERT INTO `__new_action`("id", "name", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "created_at", "updated_at", "deleted_at" FROM `action`;--> statement-breakpoint
DROP TABLE `action`;--> statement-breakpoint
ALTER TABLE `__new_action` RENAME TO `action`;--> statement-breakpoint
PRAGMA foreign_keys=ON;