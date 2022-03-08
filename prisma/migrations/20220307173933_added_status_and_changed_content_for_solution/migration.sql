/*
  Warnings:

  - You are about to drop the column `content` on the `submission` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `submission` table. All the data in the column will be lost.
  - Added the required column `status` to the `submission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submission" DROP COLUMN "content",
DROP COLUMN "createdAt",
ADD COLUMN     "solution" TEXT,
ADD COLUMN     "status" TEXT NOT NULL;
