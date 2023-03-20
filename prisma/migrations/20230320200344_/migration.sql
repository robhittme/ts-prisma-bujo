/*
  Warnings:

  - You are about to drop the column `collection_id` on the `list_item` table. All the data in the column will be lost.
  - Added the required column `collectionId` to the `list_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "list_item" DROP CONSTRAINT "list_item_collection_id_fkey";

-- AlterTable
ALTER TABLE "list_item" DROP COLUMN "collection_id",
ADD COLUMN     "collectionId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
