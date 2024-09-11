/*
  Warnings:

  - Added the required column `discordUserAvatar` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discordUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "discordUsername" TEXT NOT NULL PRIMARY KEY,
    "discordUserId" TEXT NOT NULL,
    "discordUserAvatar" TEXT NOT NULL,
    "pointsSent" INTEGER NOT NULL,
    "pointsReceived" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL
);
INSERT INTO "new_User" ("balance", "discordUsername", "pointsReceived", "pointsSent") SELECT "balance", "discordUsername", "pointsReceived", "pointsSent" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
