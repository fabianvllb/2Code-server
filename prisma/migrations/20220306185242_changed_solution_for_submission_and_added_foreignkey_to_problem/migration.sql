/*
  Warnings:

  - You are about to drop the `solution` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "solution" DROP CONSTRAINT "solution_authorId_fkey";

-- DropTable
DROP TABLE "solution";

-- CreateTable
CREATE TABLE "submission" (
    "id" SERIAL NOT NULL,
    "content" TEXT,
    "language" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problemId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "submission_problemId_key" ON "submission"("problemId");

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "submission" ADD CONSTRAINT "submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
