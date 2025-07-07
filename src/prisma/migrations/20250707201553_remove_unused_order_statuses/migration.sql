/*
  Warnings:

  - The values [DELIVERED,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderStatus"DROP VALUE 'DELIVERED';
ALTER TYPE "OrderStatus"DROP VALUE 'CANCELLED';
