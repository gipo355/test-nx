/*
  Warnings:

  - You are about to drop the `BlacklistedRefreshTokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BlacklistedRefreshTokens" DROP CONSTRAINT "BlacklistedRefreshTokens_accountId_fkey";

-- DropTable
DROP TABLE "BlacklistedRefreshTokens";
