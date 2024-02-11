/*
  Warnings:

  - Added the required column `spaceID` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterSequence
ALTER SEQUENCE "session_id_seq" MAXVALUE 9223372036854775807;

-- AlterTable
ALTER TABLE "session" ADD COLUMN     "spaceID" INT4 NOT NULL;
