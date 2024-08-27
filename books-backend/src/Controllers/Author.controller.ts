import { Request, Response } from 'express';
import { AuthorService } from '../Services/Author.service';
import { authorSchema } from '../Schema/Author.schema';
import { CustomError } from '../Errors/CustomError';
import { parseWhere } from '../utils/queryHelpers';
import { parse, parseISO } from 'date-fns';

export async function create(req: Request, res: Response): Promise<void> {
  const { firstName, lastName, bio, birthDate } = req.body;
  console.log(parse(req.body.birthDate, 'yyyy-MM-dd', new Date()));
  const validatedData = authorSchema.parse({
    firstName,
    lastName,
    bio,
    birthDate: parseISO(birthDate),
  });
  const authorService = new AuthorService();
  const author = await authorService.createAuthor(validatedData);
  res.status(201).json(author);
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const authorService = new AuthorService();

  const author = await authorService.show({ id });
  if (author) {
    res.json(author);
  } else {
    res.status(404).json({ error: 'Author not found' });
  }
}

export async function get(req: Request, res: Response): Promise<void> {
  const authorService = new AuthorService();
  const { skip, take } = req.query;
  const where = parseWhere(req.query.where as string);
  const [count, authors] = await authorService.get({
    skip: Math.abs(Number(skip ?? 0)) * Number(take ?? 15),
    take: Number(take ?? 15),
    where,
  });
  console.log('authors', authors);
  res.header('X-Total-Count', `${count}`);
  res.json(authors);
}

export async function update(req: Request, res: Response): Promise<void> {
  const authorService = new AuthorService();
  const { firstName, lastName, bio, birthDate } = req.body;

  const id = parseInt(req.params.id);
  const validatedData = authorSchema.partial().parse({
    firstName,
    lastName,
    bio,
    birthDate: parseISO(birthDate),
  });
  const author = await authorService.update(id, validatedData);
  if (!author) throw new CustomError('Author not found', 400);
  res.json(author);
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const authorService = new AuthorService();

    const id = parseInt(req.params.id);
    await authorService.remove(id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete author' });
  }
}
