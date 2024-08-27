import { faker } from '@faker-js/faker';

import prisma from '../../../src/config/prismaClient';

export async function seedBooks() {
  const authors = await prisma.author.findMany();
  const publishers = await prisma.publisher.findMany();

  for (let i = 0; i < 500; i++) {
    await prisma.book.create({
      data: {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        isbn: faker.string.uuid(),
        publishDate: faker.date.past(10),
        pages: faker.number.int({ min: 100, max: 1000 }),
        authorId: authors[faker.number.int({ min: 0, max: authors.length - 1 })].id,
        publisherId: publishers[faker.number.int({ min: 0, max: publishers.length - 1 })].id,
        categoryId: faker.number.int({ min: 1, max: 4 }),
        price: faker.number.float({ min: 10, max: 100, precision: 0.01 }),
        stock: faker.number.int({ min: 0, max: 500 }),
      },
    });
  }
}
