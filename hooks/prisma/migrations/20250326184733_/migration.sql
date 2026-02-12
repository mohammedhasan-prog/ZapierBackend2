/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ZapRunOutbox` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `ZapRunOutbox` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `ZapRunOutbox` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ZapRunOutbox` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[zapId]` on the table `ZapRun` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zapRunId]` on the table `ZapRunOutbox` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `metadata` to the `ZapRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "metadata" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ZapRunOutbox" DROP COLUMN "createdAt",
DROP COLUMN "message",
DROP COLUMN "status",
DROP COLUMN "updatedAt";

-- CreateIndex
CREATE UNIQUE INDEX "ZapRun_zapId_key" ON "ZapRun"("zapId");

-- CreateIndex
CREATE UNIQUE INDEX "ZapRunOutbox_zapRunId_key" ON "ZapRunOutbox"("zapRunId");
