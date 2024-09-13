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
    "parentTransactionId" INTEGER,
    CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User" ("discordUsername") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User" ("discordUsername") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain" ("name") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_parentTransactionId_fkey" FOREIGN KEY ("parentTransactionId") REFERENCES "Transaction" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("description", "domainId", "id", "link", "personalUsage", "points", "receiverId", "senderId", "toRepay") SELECT "description", "domainId", "id", "link", "personalUsage", "points", "receiverId", "senderId", "toRepay" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
