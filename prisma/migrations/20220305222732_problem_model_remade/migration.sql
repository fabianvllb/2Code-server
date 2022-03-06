/*
  Warnings:

  - You are about to drop the column `language` on the `problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "problem" DROP COLUMN "language",
ADD COLUMN     "cmain" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "javamain" TEXT,
ADD COLUMN     "jsmain" TEXT;
