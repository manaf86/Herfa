-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[];
