import { Author } from '@prisma/client';
import { AuthorRepository } from '../Repository/Author.repository';
import { AuthorInput } from '../Schema/Author.schema';
import { GetListParams, ShowParams, Where } from '../utils/queryHelpers';

export class AuthorService {
  private authorRepository: AuthorRepository;

  constructor() {
    this.authorRepository = new AuthorRepository();
  }

  async createAuthor(data: AuthorInput): Promise<Author> {
    return this.authorRepository.create(data);
  }

  async show(input: ShowParams): Promise<Author | null> {
    return this.authorRepository.show(input);
  }

  async get(input: GetListParams): Promise<[number, Author[]]> {
    console.log('input', input);
    return this.authorRepository.get(input);
  }

  async update(id: number, data: Partial<AuthorInput>): Promise<Author> {
    return this.authorRepository.update(id, data);
  }

  async remove(id: number): Promise<Author> {
    return this.authorRepository.delete(id);
  }
}
