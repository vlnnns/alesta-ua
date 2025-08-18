/*
  Warnings:

  - You are about to alter the column `thickness` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_order_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "type" TEXT,
    "thickness" REAL,
    "format" TEXT,
    "grade" TEXT,
    "manufacturer" TEXT,
    "waterproofing" TEXT,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_order_items" ("format", "grade", "id", "image", "manufacturer", "orderId", "price", "productId", "quantity", "thickness", "title", "type", "waterproofing") SELECT "format", "grade", "id", "image", "manufacturer", "orderId", "price", "productId", "quantity", "thickness", "title", "type", "waterproofing" FROM "order_items";
DROP TABLE "order_items";
ALTER TABLE "new_order_items" RENAME TO "order_items";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
