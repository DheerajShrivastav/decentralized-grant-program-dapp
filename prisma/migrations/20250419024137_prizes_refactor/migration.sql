/*
  Warnings:

  - You are about to drop the column `prizesId` on the `Event` table. All the data in the column will be lost.
  - Added the required column `title` to the `Prize` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Event_prizesId_key";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "prizesId";

-- AlterTable
ALTER TABLE "Prize" ADD COLUMN     "title" TEXT NOT NULL;
