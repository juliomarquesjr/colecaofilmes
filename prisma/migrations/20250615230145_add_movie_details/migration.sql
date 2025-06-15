/*
  Warnings:

  - Added the required column `country` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalLanguage` to the `Movie` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
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
    "trailerUrl" TEXT,
    "runtime" INTEGER,
    "country" TEXT NOT NULL,
    "countryFlag" TEXT,
    "originalLanguage" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "deletedAt" DATETIME
);
INSERT INTO "new_Movie" ("coverUrl", "createdAt", "deletedAt", "id", "mediaType", "originalTitle", "overview", "productionInfo", "rating", "shelfCode", "title", "trailerUrl", "uniqueCode", "updatedAt", "year", "country", "countryFlag", "originalLanguage", "runtime") 
SELECT 
    "coverUrl", 
    "createdAt", 
    "deletedAt", 
    "id", 
    "mediaType", 
    "originalTitle", 
    "overview", 
    "productionInfo", 
    "rating", 
    "shelfCode", 
    "title", 
    "trailerUrl", 
    "uniqueCode", 
    "updatedAt", 
    "year",
    'Não informado' as "country",
    NULL as "countryFlag",
    'Não informado' as "originalLanguage",
    NULL as "runtime"
FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_uniqueCode_key" ON "Movie"("uniqueCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
