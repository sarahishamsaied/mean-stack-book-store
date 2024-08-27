import { faker } from '@faker-js/faker';

import prisma from '../../../src/config/prismaClient';

export async function seedPublishers() {
  for (let i = 0; i < 200; i++) {
    await prisma.publisher.create({
      data: {
        name: faker.company.name(),
        location: faker.location.city() + ', ' + faker.location.country(),
      },
    });
  }
}
