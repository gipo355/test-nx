/*
  Warnings:

  - You are about to drop the `RefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_accountId_fkey";

-- DropTable
DROP TABLE "RefreshTokens";

-- CreateTable
CREATE TABLE "BlacklistedRefreshTokens" (
    "accountId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedRefreshTokens_token_key" ON "BlacklistedRefreshTokens"("token");

-- CreateIndex
CREATE INDEX "BlacklistedRefreshTokens_token_idx" ON "BlacklistedRefreshTokens"("token");

-- CreateIndex
CREATE INDEX "BlacklistedRefreshTokens_accountId_token_idx" ON "BlacklistedRefreshTokens"("accountId", "token");

-- CreateIndex
CREATE UNIQUE INDEX "BlacklistedRefreshTokens_accountId_token_key" ON "BlacklistedRefreshTokens"("accountId", "token");

-- AddForeignKey
ALTER TABLE "BlacklistedRefreshTokens" ADD CONSTRAINT "BlacklistedRefreshTokens_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
