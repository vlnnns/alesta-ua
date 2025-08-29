-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlywoodProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "thickness" REAL NOT NULL,
    "format" TEXT NOT NULL,
    "grade" TEXT,
    "manufacturer" TEXT NOT NULL,
    "waterproofing" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_PlywoodProduct" ("createdAt", "format", "grade", "id", "image", "inStock", "manufacturer", "price", "thickness", "type", "updatedAt", "waterproofing") SELECT "createdAt", "format", "grade", "id", "image", "inStock", "manufacturer", "price", "thickness", "type", "updatedAt", "waterproofing" FROM "PlywoodProduct";
DROP TABLE "PlywoodProduct";
ALTER TABLE "new_PlywoodProduct" RENAME TO "PlywoodProduct";
CREATE UNIQUE INDEX "PlywoodProduct_type_thickness_format_grade_manufacturer_key" ON "PlywoodProduct"("type", "thickness", "format", "grade", "manufacturer");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
