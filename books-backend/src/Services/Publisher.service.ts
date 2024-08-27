import { Publisher } from '@prisma/client';
import { PublisherRepository } from '../Repository/Publisher.repository';
import { PublisherInput } from '../Schema/Publisher.schema';
import { GetListParams, ShowParams, Where } from '../utils/queryHelpers';

export class PublisherService {
  private publisherRepository: PublisherRepository;

  constructor() {
    this.publisherRepository = new PublisherRepository();
  }

  async createPublisher(data: PublisherInput): Promise<Publisher> {
    return this.publisherRepository.create(data);
  }

  async show(input: ShowParams): Promise<Publisher | null> {
    return this.publisherRepository.show(input);
  }

  async get(input: GetListParams): Promise<[number, Publisher[]]> {
    return this.publisherRepository.get(input);
  }

  async update(id: number, data: Partial<PublisherInput>): Promise<Publisher> {
    return this.publisherRepository.update(id, data);
  }

  async remove(id: number): Promise<Publisher> {
    return this.publisherRepository.delete(id);
  }
}
