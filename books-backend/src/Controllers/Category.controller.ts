import { Request, Response } from 'express';
import { CategoryService } from '../Services/Category.service';
import { categorySchema } from '../Schema/Category.schema';
import { CustomError } from '../Errors/CustomError';
import { parseWhere } from '../utils/queryHelpers';

export async function create(req: Request, res: Response): Promise<void> {
  const validatedData = categorySchema.parse(req.body);
  const categoryService = new CategoryService();
  const category = await categoryService.create(validatedData);
  res.status(201).json(category);
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const categoryService = new CategoryService();

  const category = await categoryService.show({ id });
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
}

export async function get(req: Request, res: Response): Promise<void> {
  try {
    const categoryService = new CategoryService();
    const { skip, take } = req.query;
    const where = parseWhere(req.query.where as string);
    console.log(where);
    const [count, categories] = await categoryService.get({
      skip: Math.abs(Number(skip ?? 0)) * Number(take ?? 10),
      take: Number(take ?? 10),
      where,
    });
    res.header('X-Total-Count', `${count}`);
    res.json(categories);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to get categories' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  const categoryService = new CategoryService();

  const id = parseInt(req.params.id);
  const validatedData = categorySchema.partial().parse(req.body);
  const category = await categoryService.update(id, validatedData);
  if (!category) throw new CustomError('Category not found', 400);
  res.json(category);
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const categoryService = new CategoryService();

    const id = parseInt(req.params.id);
    await categoryService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
}
