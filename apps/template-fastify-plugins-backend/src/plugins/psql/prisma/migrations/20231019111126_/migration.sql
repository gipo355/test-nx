-- DropIndex
DROP INDEX "RefreshTokens_accountId_token_key";

-- CreateIndex
CREATE INDEX "RefreshTokens_token_idx" ON "RefreshTokens"("token");

-- CreateIndex
CREATE INDEX "RefreshTokens_userId_token_idx" ON "RefreshTokens"("userId", "token");
