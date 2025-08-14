/*
  Warnings:

  - You are about to alter the column `thickness` on the `PlywoodProduct` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlywoodProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "thickness" REAL NOT NULL,
    "format" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "waterproofing" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PlywoodProduct" ("format", "grade", "id", "image", "manufacturer", "price", "thickness", "type", "waterproofing") SELECT "format", "grade", "id", "image", "manufacturer", "price", "thickness", "type", "waterproofing" FROM "PlywoodProduct";
DROP TABLE "PlywoodProduct";
ALTER TABLE "new_PlywoodProduct" RENAME TO "PlywoodProduct";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
