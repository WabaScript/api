/*
  Warnings:

  - You are about to alter the column `duration` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "events" ALTER COLUMN "duration" SET DATA TYPE DOUBLE PRECISION;
