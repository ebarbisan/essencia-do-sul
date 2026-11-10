ALTER TABLE "User" ADD COLUMN "accessEnabled" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "Session" (
    "tokenHash" TEXT PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

CREATE TABLE "RateLimit" (
    "key" TEXT PRIMARY KEY,
    "attempts" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "RateLimit_expiresAt_idx" ON "RateLimit"("expiresAt");
