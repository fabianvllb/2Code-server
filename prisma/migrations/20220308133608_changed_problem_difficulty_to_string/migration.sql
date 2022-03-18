/*
  Warnings:

  - You are about to drop the column `content` on the `problem` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `problem` table. All the data in the column will be lost.
  - Added the required column `timecreated` to the `problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "problem" DROP COLUMN "content",
DROP COLUMN "createdAt",
ADD COLUMN     "timecreated" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "difficulty" SET DEFAULT E'10',
ALTER COLUMN "difficulty" SET DATA TYPE TEXT;
