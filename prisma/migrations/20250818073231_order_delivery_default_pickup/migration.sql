-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_orders" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "customerName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "warehouse" TEXT,
    "comment" TEXT,
    "companyName" TEXT,
    "companyCode" TEXT,
    "total" INTEGER NOT NULL,
    "deliveryMethod" TEXT NOT NULL DEFAULT 'pickup'
);
INSERT INTO "new_orders" ("address", "city", "comment", "companyCode", "companyName", "customerName", "deliveryMethod", "email", "id", "phone", "total", "warehouse") SELECT "address", "city", "comment", "companyCode", "companyName", "customerName", "deliveryMethod", "email", "id", "phone", "total", "warehouse" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
