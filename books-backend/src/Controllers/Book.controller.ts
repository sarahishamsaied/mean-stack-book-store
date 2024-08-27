import { Request, Response } from 'express';
import { BookService } from '../Services/Book.service';
import { parseWhere } from '../utils/queryHelpers';
import { parse, parseISO } from 'date-fns';
import path from 'path';

export async function create(req: Request, res: Response): Promise<void> {
  try {
    const bookService = new BookService();

    const coverImagePath = req.file?.path;
    const coverFileName = coverImagePath ? path.basename(coverImagePath) : 'https://placehold.jp/150x150.png';

    const { title, description, isbn, pages, authorId, publisherId, categoryId, publishDate, stock, price } = req.body;
    const book = await bookService.createBook({
      title,
      description,
      isbn,
      authorId: Number(authorId),
      categoryId: Number(categoryId),
      publisherId: Number(publisherId),
      pages: Number(pages),
      stock: Number(stock),
      publishDate: parseISO(publishDate),
      cover: coverFileName,
      price: Number(price),
    });

    res.status(201).json(book);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to create book' });
  }
}

export async function show(req: Request, res: Response): Promise<void> {
  try {
    const id = parseInt(req.params.id);
    const bookService = new BookService();

    const book = await bookService.show({ id });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Failed to get book' });
  }
}

export async function get(req: Request, res: Response): Promise<void> {
  try {
    const bookService = new BookService();
    const { skip, take } = req.query;
    console.log('get in where', skip, take);
    const where = parseWhere(req.query.where as string);

    const [count, books] = await bookService.get({
      skip: Math.abs(Number(skip ?? 0)) * Number(take ?? 10),
      take: Number(take ?? 10),
      where,
    });
    res.header('X-Total-Count', `${count}`);
    res.json(books);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Failed to get books' });
  }
}

export async function update(req: Request, res: Response): Promise<void> {
  try {
    const bookService = new BookService();

    const id = parseInt(req.params.id);
    const { isbn, publishDate, pages, authorId, publisherId, categoryId, price, stock, title, description } = req.body;
    const book = await bookService.update(id, { isbn, publishDate, pages, authorId, publisherId, categoryId, description, price, stock, title });
    res.json(book);
  } catch (error) {
    console.log('error', error);
    res.status(400).json({ error: 'Failed to update book' });
  }
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const bookService = new BookService();

    const id = parseInt(req.params.id);
    await bookService.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete book' });
  }
}
