-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `primary_mobile` VARCHAR(15) NOT NULL,
    `secondary_mobile` VARCHAR(15) NULL,
    `aadhaar_number` VARCHAR(12) NOT NULL,
    `pan_number` VARCHAR(10) NOT NULL,
    `date_of_birth` DATE NOT NULL,
    `place_of_birth` VARCHAR(100) NOT NULL,
    `current_address` TEXT NOT NULL,
    `permanent_address` TEXT NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `is_deleted` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,
    `created_by` VARCHAR(36) NULL,
    `updated_by` VARCHAR(36) NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_aadhaar_number_key`(`aadhaar_number`),
    UNIQUE INDEX `users_pan_number_key`(`pan_number`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_pan_number_idx`(`pan_number`),
    INDEX `users_aadhaar_number_idx`(`aadhaar_number`),
    INDEX `users_primary_mobile_idx`(`primary_mobile`),
    INDEX `users_is_deleted_idx`(`is_deleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_audit_logs` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(20) NOT NULL,
    `old_data` JSON NULL,
    `new_data` JSON NULL,
    `performed_by` VARCHAR(36) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `user_audit_logs_user_id_idx`(`user_id`),
    INDEX `user_audit_logs_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_audit_logs` ADD CONSTRAINT `user_audit_logs_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
