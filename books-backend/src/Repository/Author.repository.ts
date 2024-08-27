import { PrismaClient, Author, Prisma } from '@prisma/client';
import { GetListParams, ShowParams } from '../utils/queryHelpers';

export class AuthorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Prisma.AuthorCreateInput): Promise<Author> {
    return this.prisma.author.create({ data });
  }

  async show({ id, select }: ShowParams): Promise<Author | null> {
    return this.prisma.author.findUnique({
      where: { id },
      include: {
        books: true,
      },
    });
  }

  async get({ where, skip = 0, take = 15, select }: GetListParams): Promise<[number, Author[]]> {
    return await Promise.all([
      this.prisma.author.count(),
      this.prisma.author.findMany({
        where,
        skip,
        take,
        include: {
          books: true,
        },
      }),
    ]);
  }

  async update(id: number, data: Prisma.AuthorUpdateInput): Promise<Author> {
    return this.prisma.author.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Author> {
    return this.prisma.author.delete({ where: { id } });
  }
}
