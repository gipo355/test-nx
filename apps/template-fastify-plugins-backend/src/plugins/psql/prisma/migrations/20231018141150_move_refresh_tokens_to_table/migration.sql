/*
  Warnings:

  - You are about to drop the column `refreshTokens` on the `Accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "refreshTokens";

-- CreateTable
CREATE TABLE "RefreshTokens" (
    "accountId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_token_key" ON "RefreshTokens"("token");

-- CreateIndex
CREATE INDEX "RefreshTokens_accountId_token_idx" ON "RefreshTokens"("accountId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokens_accountId_token_key" ON "RefreshTokens"("accountId", "token");

-- AddForeignKey
ALTER TABLE "RefreshTokens" ADD CONSTRAINT "RefreshTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
