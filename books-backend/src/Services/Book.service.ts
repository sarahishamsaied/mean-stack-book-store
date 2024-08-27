import { Book, Prisma } from '@prisma/client';
import { BookRepository } from '../Repository/Book.repository';
import { GetListParams, ShowParams } from '../utils/queryHelpers';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async createBook(data: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
    return this.bookRepository.create(data);
  }

  async show(input: ShowParams): Promise<Book | null> {
    return this.bookRepository.findById(input.id);
  }

  async get(input: GetListParams): Promise<[number, Book[]]> {
    return this.bookRepository.get(input);
  }

  async update(id: number, data: Partial<Book>): Promise<Book> {
    return this.bookRepository.update(id, data);
  }

  async remove(id: number): Promise<Book> {
    return this.bookRepository.delete(id);
  }
}
