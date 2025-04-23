/*
  Warnings:

  - You are about to drop the column `avatar_url` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_profiles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `user_profiles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `user_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_profiles` DROP FOREIGN KEY `user_profiles_user_id_fkey`;

-- DropIndex
DROP INDEX `user_profiles_user_id_key` ON `user_profiles`;

-- AlterTable
ALTER TABLE `user_profiles` DROP COLUMN `avatar_url`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `phone`,
    DROP COLUMN `user_id`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `bio` VARCHAR(191) NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `dateOfBirth` DATETIME(3) NULL,
    ADD COLUMN `gender` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_profiles_userId_key` ON `user_profiles`(`userId`);

-- AddForeignKey
ALTER TABLE `user_profiles` ADD CONSTRAINT `user_profiles_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
