-- AlterTable
ALTER TABLE "events" ALTER COLUMN "website_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP DEFAULT;
