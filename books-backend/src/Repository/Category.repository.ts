import { PrismaClient, Category, Prisma } from '@prisma/client';
import { GetListParams } from '../utils/queryHelpers';

export class CategoryRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }
  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  async show(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id }, include: { books: true } });
  }

  async get({ where, skip = 0, take = 10, select }: GetListParams): Promise<[number, Category[]]> {
    return await Promise.all([
      this.prisma.category.count(),
      this.prisma.category.findMany({
        where,
        skip,
        take,
        include: {
          books: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
  }

  async update(id: number, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
