/*
  Warnings:

  - A unique constraint covering the columns `[uniquename]` on the table `problem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uniquename` to the `problem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "problem" ADD COLUMN     "uniquename" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "problem_uniquename_key" ON "problem"("uniquename");
