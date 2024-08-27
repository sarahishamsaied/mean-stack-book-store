-- DropForeignKey
ALTER TABLE `book` DROP FOREIGN KEY `Book_publisherId_fkey`;

-- AddForeignKey
ALTER TABLE `Book` ADD CONSTRAINT `Book_publisherId_fkey` FOREIGN KEY (`publisherId`) REFERENCES `Publisher`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
