/*
  Warnings:

  - You are about to drop the column `access_token` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `passwordLastUpdated` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccessToken` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccessTokenExpiry` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `VerificationTokens` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[strategy,providerUid]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `strategy` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `VerificationTokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Strategy" AS ENUM ('LOCAL', 'GOOGLE', 'GITHUB');

-- DropIndex
DROP INDEX "Accounts_provider_providerUid_key";

-- AlterTable
ALTER TABLE "Accounts" DROP COLUMN "access_token",
DROP COLUMN "emailVerified",
DROP COLUMN "expires_at",
DROP COLUMN "passwordLastUpdated",
DROP COLUMN "provider",
DROP COLUMN "providerAccessToken",
DROP COLUMN "providerAccessTokenExpiry",
DROP COLUMN "refresh_token",
ADD COLUMN     "refreshTokens" TEXT[],
ADD COLUMN     "strategy" "Strategy" NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "VerificationTokens" DROP COLUMN "expires_at",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_strategy_providerUid_key" ON "Accounts"("strategy", "providerUid");
