-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_categoryId_fkey`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
