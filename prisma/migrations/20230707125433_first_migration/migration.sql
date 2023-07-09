-- CreateEnum
CREATE TYPE "Action" AS ENUM ('BUY', 'SELL');

-- CreateTable
CREATE TABLE "Coin" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "rank" INTEGER,
    "description" TEXT,
    "iconUrl" TEXT,
    "websiteUrl" TEXT,
    "coinrankingUrl" TEXT,
    "marketCap" TEXT,
    "lastDayVolume" TEXT,
    "numberOfMarkets" INTEGER,
    "numberOfExchanges" INTEGER,
    "allTimeHigh" JSONB,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "action" "Action" NOT NULL,
    "username" TEXT NOT NULL,
    "wallet" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "unit_price" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");
