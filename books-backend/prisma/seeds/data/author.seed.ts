import { faker } from '@faker-js/faker';

import prisma from '../../../src/config/prismaClient';

export async function seedAuthors() {
  for (let i = 0; i < 10; i++) {
    await prisma.author.create({
      data: {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        bio: faker.lorem.paragraph(),
        birthDate: faker.date.past(50, new Date('2000-01-01')),
      },
    });
  }
}
