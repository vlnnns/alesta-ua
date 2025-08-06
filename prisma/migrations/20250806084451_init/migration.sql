-- CreateTable
CREATE TABLE "PlywoodProduct" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "thickness" INTEGER NOT NULL,
    "format" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "waterproofing" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL
);
