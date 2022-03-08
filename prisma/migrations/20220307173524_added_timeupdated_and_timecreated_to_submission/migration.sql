/*
  Warnings:

  - Added the required column `timecreated` to the `submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeupdated` to the `submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submission" ADD COLUMN     "timecreated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "timeupdated" TIMESTAMP(3) NOT NULL;
