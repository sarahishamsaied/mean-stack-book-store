// prisma/seed.ts

import { seedCategories } from './data/category.seed';
import { seedPublishers } from './data/publisher.seed';
import { seedAuthors } from './data/author.seed';
import { seedBooks } from './data/book.seed';

async function main() {
  console.log('Creating Seed Data :) ================== >');
  await seedCategories();
  await seedPublishers();
  await seedAuthors();
  await seedBooks();

  console.log('Seed data created successfully');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
