/*
  Warnings:

  - You are about to drop the `RefreshTokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationTokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,strategy,refreshToken]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_accountId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshTokens" DROP CONSTRAINT "RefreshTokens_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationTokens" DROP CONSTRAINT "VerificationTokens_identifier_fkey";

-- DropIndex
DROP INDEX "Accounts_strategy_providerUid_key";

-- DropIndex
DROP INDEX "Accounts_userId_idx";

-- AlterTable
ALTER TABLE "Accounts" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "verificationToken" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "RefreshTokens";

-- DropTable
DROP TABLE "VerificationTokens";

-- CreateIndex
CREATE INDEX "Accounts_userId_strategy_refreshToken_idx" ON "Accounts"("userId", "strategy", "refreshToken");

-- CreateIndex
CREATE INDEX "Accounts_refreshToken_idx" ON "Accounts"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_userId_strategy_refreshToken_key" ON "Accounts"("userId", "strategy", "refreshToken");
