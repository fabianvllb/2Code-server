/*
  Warnings:

  - You are about to drop the column `timecreated` on the `submission` table. All the data in the column will be lost.
  - Added the required column `timesubmitted` to the `submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submission" DROP COLUMN "timecreated",
ADD COLUMN     "timesubmitted" TIMESTAMP(3) NOT NULL;
