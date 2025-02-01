/*
  Warnings:

  - A unique constraint covering the columns `[verifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `type` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "verifyToken" TEXT,
ADD COLUMN     "verifyTokenExpiry" TIMESTAMP(3);

-- DropEnum
DROP TYPE "ProductType";

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "User"("verifyToken");
