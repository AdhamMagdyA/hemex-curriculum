/*
  Warnings:

  - You are about to drop the column `dateOfBirth` on the `user_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `user_profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user_profiles` DROP COLUMN `dateOfBirth`,
    DROP COLUMN `profilePicture`,
    ADD COLUMN `date_of_birth` DATETIME(3) NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NULL;
