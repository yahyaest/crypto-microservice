-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('CRYPTO', 'STOCK', 'FOREX');

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "type" "TransactionType" NOT NULL DEFAULT 'CRYPTO';
