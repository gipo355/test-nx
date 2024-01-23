-- CreateTable
CREATE TABLE "BlackLists" (
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BlackLists_email_key" ON "BlackLists"("email");

-- CreateIndex
CREATE INDEX "BlackLists_email_idx" ON "BlackLists"("email");
