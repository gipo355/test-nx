/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `verificationToken` on the `Accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,strategy]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Accounts_refreshToken_idx";

-- DropIndex
DROP INDEX "Accounts_userId_strategy_refreshToken_idx";

-- DropIndex
DROP INDEX "Accounts_userId_strategy_refreshToken_key";

-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "expiresAt",
DROP COLUMN "refreshToken",
DROP COLUMN "verificationToken";

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "accountId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "RefreshTokens"("token");

-- CreateIndex
CREATE INDEX "RefreshTokens_token_idx" ON "RefreshTokens"("token");

-- CreateIndex
CREATE INDEX "RefreshTokens_accountId_token_idx" ON "RefreshTokens"("accountId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_accountId_token_key" ON "RefreshTokens"("accountId", "token");

-- CreateIndex
CREATE INDEX "Accounts_userId_strategy_idx" ON "Accounts"("userId", "strategy");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_userId_strategy_key" ON "Accounts"("userId", "strategy");

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
