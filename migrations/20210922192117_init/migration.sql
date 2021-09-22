/*
  Warnings:

  - You are about to drop the `event_metadata` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event_metadata" DROP CONSTRAINT "event_metadata_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_metadata" DROP CONSTRAINT "event_metadata_metadata_id_fkey";

-- DropTable
DROP TABLE "event_metadata";

-- CreateTable
CREATE TABLE "_EventToMetadata" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_EventToMetadata_AB_unique" ON "_EventToMetadata"("A", "B");

-- CreateIndex
CREATE INDEX "_EventToMetadata_B_index" ON "_EventToMetadata"("B");

-- AddForeignKey
ALTER TABLE "_EventToMetadata" ADD FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToMetadata" ADD FOREIGN KEY ("B") REFERENCES "metadata"("id") ON DELETE CASCADE ON UPDATE CASCADE;
