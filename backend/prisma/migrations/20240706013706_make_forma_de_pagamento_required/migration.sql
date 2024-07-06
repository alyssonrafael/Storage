/*
  Warnings:

  - Made the column `formaDePagamento` on table `Venda` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Venda" ALTER COLUMN "formaDePagamento" SET NOT NULL;
