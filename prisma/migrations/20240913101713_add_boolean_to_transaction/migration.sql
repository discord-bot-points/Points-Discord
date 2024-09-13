/*
  Warnings:

  - Added the required column `personalUsage` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toRepay` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "personalUsage" BOOLEAN NOT NULL,
    "toRepay" BOOLEAN NOT NULL,
    CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("discordUsername") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("discordUsername") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("name") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("description", "domainId", "id", "link", "points", "receiverId", "senderId") SELECT "description", "domainId", "id", "link", "points", "receiverId", "senderId" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
