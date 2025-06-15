/*
  Warnings:

  - Added the required column `uniqueCode` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_MovieTemp" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "uniqueCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT,
    "overview" TEXT,
    "year" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "shelfCode" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "productionInfo" TEXT NOT NULL,
    "rating" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);

-- Copy data with generated uniqueCode
INSERT INTO "_MovieTemp" (
    "id", "uniqueCode", "title", "originalTitle", "overview", "year", 
    "mediaType", "shelfCode", "coverUrl", "productionInfo", "rating", 
    "createdAt", "updatedAt", "deletedAt"
)
SELECT 
    "id",
    SUBSTR(HEX(ABS(RANDOM())), 1, 8),
    "title", "originalTitle", "overview", "year", 
    "mediaType", "shelfCode", "coverUrl", "productionInfo", "rating", 
    "createdAt", "updatedAt", "deletedAt"
FROM "Movie";

-- Drop old table
DROP TABLE "Movie";

-- Rename temp table
ALTER TABLE "_MovieTemp" RENAME TO "Movie";

-- Create unique index
CREATE UNIQUE INDEX "Movie_uniqueCode_key" ON "Movie"("uniqueCode");
