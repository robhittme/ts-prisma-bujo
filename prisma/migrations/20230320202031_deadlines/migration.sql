-- AlterTable
ALTER TABLE "entries" ADD COLUMN     "deadline" BIGINT DEFAULT EXTRACT(epoch FROM now());
