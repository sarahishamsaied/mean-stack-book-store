import { Category } from '@prisma/client';
import { CategoryRepository } from '../Repository/Category.repository';
import { CategoryInput } from '../Schema/Category.schema';
import { GetListParams, ShowParams, Where } from '../utils/queryHelpers';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return this.categoryRepository.create(data);
  }

  async show({ id }: ShowParams): Promise<Category | null> {
    return this.categoryRepository.show(id);
  }

  async get(input: GetListParams): Promise<[number, Category[]]> {
    return this.categoryRepository.get(input);
  }

  async update(id: number, data: Partial<CategoryInput>): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async remove(id: number): Promise<Category> {
    return this.categoryRepository.remove(id);
  }
}
