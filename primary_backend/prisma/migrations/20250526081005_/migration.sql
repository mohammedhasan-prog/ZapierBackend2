/*
  Warnings:

  - You are about to drop the column `metadata` on the `Zap` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "metadata";
