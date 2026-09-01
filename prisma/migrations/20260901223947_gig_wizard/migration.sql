-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GigStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "GigStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "faqs" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rejectionNote" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "serviceType" TEXT;
