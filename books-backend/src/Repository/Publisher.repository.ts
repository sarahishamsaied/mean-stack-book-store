import { PrismaClient, Publisher, Prisma } from '@prisma/client';
import { GetListParams, ShowParams } from '../utils/queryHelpers';

export class PublisherRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async create(data: Prisma.PublisherCreateInput): Promise<Publisher> {
    return this.prisma.publisher.create({ data });
  }

  async show({ id, select }: ShowParams): Promise<Publisher | null> {
    return this.prisma.publisher.findUnique({ where: { id }, select });
  }

  async get({ where, skip = 0, take = 10, select }: GetListParams): Promise<[number, Publisher[]]> {
    console.log('take, skip are', take, skip);
    return await Promise.all([
      this.prisma.publisher.count(),
      this.prisma.publisher.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);
  }

  async update(id: number, data: Prisma.PublisherUpdateInput): Promise<Publisher> {
    return this.prisma.publisher.update({ where: { id }, data });
  }

  async delete(id: number): Promise<Publisher> {
    return this.prisma.publisher.delete({ where: { id } });
  }
}
