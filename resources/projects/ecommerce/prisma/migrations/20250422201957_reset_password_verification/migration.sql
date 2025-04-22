-- AlterTable
ALTER TABLE `users` ADD COLUMN `resetVerified` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `resetVerifiedExpiry` DATETIME(3) NULL;
