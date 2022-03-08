/*
  Warnings:

  - Added the required column `runtime` to the `submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submission" ADD COLUMN     "runtime" DOUBLE PRECISION NOT NULL;
