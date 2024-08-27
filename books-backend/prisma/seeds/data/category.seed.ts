import prisma from '../../../src/config/prismaClient';
export async function seedCategories() {
  await prisma.category.createMany({
    data: [{ name: 'Science Fiction' }, { name: 'Non-Fiction' }, { name: 'Fantasy' }, { name: 'Biography' }],
  });
}
