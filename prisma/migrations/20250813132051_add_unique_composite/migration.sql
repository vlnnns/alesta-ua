/*
  Warnings:

  - A unique constraint covering the columns `[type,thickness,format,grade,manufacturer]` on the table `PlywoodProduct` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlywoodProduct_type_thickness_format_grade_manufacturer_key" ON "PlywoodProduct"("type", "thickness", "format", "grade", "manufacturer");
