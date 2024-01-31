/*
  Warnings:

  - Added the required column `saltA` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saltB` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "saltA" STRING NOT NULL;
ALTER TABLE "user" ADD COLUMN     "saltB" STRING NOT NULL;
