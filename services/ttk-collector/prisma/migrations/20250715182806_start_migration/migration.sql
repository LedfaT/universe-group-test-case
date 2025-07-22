-- CreateEnum
CREATE TYPE "Source" AS ENUM ('facebook', 'tiktok');

-- CreateEnum
CREATE TYPE "FunnelStage" AS ENUM ('top', 'bottom');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'non_binary');

-- CreateEnum
CREATE TYPE "Referrer" AS ENUM ('newsfeed', 'marketplace', 'groups');

-- CreateEnum
CREATE TYPE "ClickPosition" AS ENUM ('top_left', 'bottom_right', 'center');

-- CreateEnum
CREATE TYPE "Device" AS ENUM ('mobile', 'desktop', 'Android', 'iOS', 'Desktop');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'Safari');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "Source" NOT NULL,
    "funnelStage" "FunnelStage" NOT NULL,
    "eventType" TEXT NOT NULL,
    "facebookUserId" TEXT,
    "tiktokUserId" TEXT,
    "fbEngagementTopId" TEXT,
    "fbEngagementBottomId" TEXT,
    "ttEngagementTopId" TEXT,
    "ttEngagementBottomId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "FacebookUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "followers" INTEGER NOT NULL,

    CONSTRAINT "TiktokUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookEngagementTop" (
    "id" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "referrer" "Referrer" NOT NULL,
    "videoId" TEXT,

    CONSTRAINT "FacebookEngagementTop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FacebookEngagementBottom" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "clickPosition" "ClickPosition" NOT NULL,
    "device" "Device" NOT NULL,
    "browser" "Browser" NOT NULL,
    "purchaseAmount" TEXT,

    CONSTRAINT "FacebookEngagementBottom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokEngagementTop" (
    "id" TEXT NOT NULL,
    "watchTime" INTEGER NOT NULL,
    "percentageWatched" INTEGER NOT NULL,
    "device" "Device" NOT NULL,
    "country" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "TiktokEngagementTop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiktokEngagementBottom" (
    "id" TEXT NOT NULL,
    "actionTime" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT,
    "purchasedItem" TEXT,
    "purchaseAmount" TEXT,

    CONSTRAINT "TiktokEngagementBottom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_facebookUserId_key" ON "Event"("facebookUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_tiktokUserId_key" ON "Event"("tiktokUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_fbEngagementTopId_key" ON "Event"("fbEngagementTopId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_fbEngagementBottomId_key" ON "Event"("fbEngagementBottomId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_ttEngagementTopId_key" ON "Event"("ttEngagementTopId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_ttEngagementBottomId_key" ON "Event"("ttEngagementBottomId");

-- CreateIndex
CREATE UNIQUE INDEX "FacebookUser_userId_key" ON "FacebookUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TiktokUser_userId_key" ON "TiktokUser"("userId");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_facebookUserId_fkey" FOREIGN KEY ("facebookUserId") REFERENCES "FacebookUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_tiktokUserId_fkey" FOREIGN KEY ("tiktokUserId") REFERENCES "TiktokUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_fbEngagementTopId_fkey" FOREIGN KEY ("fbEngagementTopId") REFERENCES "FacebookEngagementTop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_fbEngagementBottomId_fkey" FOREIGN KEY ("fbEngagementBottomId") REFERENCES "FacebookEngagementBottom"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ttEngagementTopId_fkey" FOREIGN KEY ("ttEngagementTopId") REFERENCES "TiktokEngagementTop"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_ttEngagementBottomId_fkey" FOREIGN KEY ("ttEngagementBottomId") REFERENCES "TiktokEngagementBottom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
