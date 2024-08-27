import { PrismaClient, Book, Prisma } from '@prisma/client';
import { GetListParams } from '../utils/queryHelpers';

export class BookRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    return this.prisma.book.create({ data });
  }

  async findById(id: number): Promise<Book | null> {
    return this.prisma.book.findUnique({
      where: { id },
      include: {
        publisher: true,
        author: true,
        category: true,
      },
    });
  }

  async get({ where, skip = 0, take = 10, select }: GetListParams): Promise<[number, Book[]]> {
    console.log('skip isss', skip);
    return await Promise.all([
      this.prisma.book.count(),
      this.prisma.book.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          author: true,
          publisher: true,
          category: true,
        },
      }),
    ]);
  }

  async update(id: number, data: Prisma.BookUpdateInput): Promise<Book> {
    return this.prisma.book.update({ where: { id }, data, include: { author: true, publisher: true } });
  }

  async delete(id: number): Promise<Book> {
    return this.prisma.book.delete({ where: { id } });
  }
}
