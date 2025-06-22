/*
  Migration: Generic Translation System

  This migration:
  1. Creates the new generic Translation table
  2. Migrates existing ProductTranslation data to the new table
  3. Migrates existing CategoryTranslation data to the new table
  4. Drops the old translation tables
*/

-- CreateTable: Create the new generic Translation table first
CREATE TABLE "Translation" (
    "id" STRING NOT NULL,
    "entityType" STRING NOT NULL,
    "entityId" STRING NOT NULL,
    "locale" STRING NOT NULL,
    "field" STRING NOT NULL,
    "value" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Translation_entityType_entityId_locale_idx" ON "Translation"("entityType", "entityId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "Translation_entityType_entityId_locale_field_key" ON "Translation"("entityType", "entityId", "locale", "field");

-- Migrate ProductTranslation data to the new Translation table
-- Migrate 'name' field
INSERT INTO "Translation" ("id", "entityType", "entityId", "locale", "field", "value", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::STRING as "id",
    'Product' as "entityType",
    "productId" as "entityId",
    "locale",
    'name' as "field",
    "name" as "value",
    "createdAt",
    "updatedAt"
FROM "ProductTranslation";

-- Migrate 'description' field
INSERT INTO "Translation" ("id", "entityType", "entityId", "locale", "field", "value", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::STRING as "id",
    'Product' as "entityType",
    "productId" as "entityId",
    "locale",
    'description' as "field",
    "description" as "value",
    "createdAt",
    "updatedAt"
FROM "ProductTranslation";

-- Migrate CategoryTranslation data to the new Translation table
-- Migrate 'name' field
INSERT INTO "Translation" ("id", "entityType", "entityId", "locale", "field", "value", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::STRING as "id",
    'Category' as "entityType",
    "categoryId" as "entityId",
    "locale",
    'name' as "field",
    "name" as "value",
    "createdAt",
    "updatedAt"
FROM "CategoryTranslation";

-- Migrate 'description' field
INSERT INTO "Translation" ("id", "entityType", "entityId", "locale", "field", "value", "createdAt", "updatedAt")
SELECT
    gen_random_uuid()::STRING as "id",
    'Category' as "entityType",
    "categoryId" as "entityId",
    "locale",
    'description' as "field",
    "description" as "value",
    "createdAt",
    "updatedAt"
FROM "CategoryTranslation";

-- Now drop the old tables after data migration
-- DropForeignKey
ALTER TABLE "CategoryTranslation" DROP CONSTRAINT "CategoryTranslation_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductTranslation" DROP CONSTRAINT "ProductTranslation_productId_fkey";

-- DropTable
DROP TABLE "CategoryTranslation";

-- DropTable
DROP TABLE "ProductTranslation";
