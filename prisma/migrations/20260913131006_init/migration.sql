-- CreateEnum
CREATE TYPE "GoalKind" AS ENUM ('SUBJECTIVE', 'OBJECTIVE');

-- CreateEnum
CREATE TYPE "BetStatus" AS ENUM ('ACTIVE', 'SUCCESS', 'FAILED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "WitnessResponse" AS ENUM ('PENDING', 'CONFIRMED_SUCCESS', 'CONFIRMED_FAILURE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "goalText" TEXT NOT NULL,
    "category" TEXT,
    "goalKind" "GoalKind" NOT NULL DEFAULT 'SUBJECTIVE',
    "stakeAmount" INTEGER NOT NULL,
    "charityId" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isJournalPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" "BetStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Witness" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "userId" TEXT,
    "label" TEXT,
    "inviteToken" TEXT NOT NULL,
    "response" "WitnessResponse" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Witness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalEntry" (
    "id" TEXT NOT NULL,
    "betId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JournalEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'Other',
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,

    CONSTRAINT "Charity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Bet_ownerId_idx" ON "Bet"("ownerId");

-- CreateIndex
CREATE INDEX "Bet_status_endDate_idx" ON "Bet"("status", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Witness_inviteToken_key" ON "Witness"("inviteToken");

-- CreateIndex
CREATE INDEX "Witness_betId_idx" ON "Witness"("betId");

-- CreateIndex
CREATE UNIQUE INDEX "Witness_betId_userId_key" ON "Witness"("betId", "userId");

-- CreateIndex
CREATE INDEX "JournalEntry_betId_idx" ON "JournalEntry"("betId");

-- CreateIndex
CREATE UNIQUE INDEX "Charity_name_key" ON "Charity"("name");

-- CreateIndex
CREATE INDEX "Charity_category_idx" ON "Charity"("category");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bet" ADD CONSTRAINT "Bet_charityId_fkey" FOREIGN KEY ("charityId") REFERENCES "Charity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Witness" ADD CONSTRAINT "Witness_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Witness" ADD CONSTRAINT "Witness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalEntry" ADD CONSTRAINT "JournalEntry_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
