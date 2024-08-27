import { Request, Response } from 'express';
import { PublisherService } from '../Services/Publisher.service';
import { publisherSchema } from '../Schema/Publisher.schema';
import { CustomError } from '../Errors/CustomError';
import { parseWhere } from '../utils/queryHelpers';

export async function create(req: Request, res: Response): Promise<void> {
  const validatedData = publisherSchema.parse(req.body);
  const publisherService = new PublisherService();
  const publisher = await publisherService.createPublisher(validatedData);
  res.status(201).json(publisher);
}

export async function show(req: Request, res: Response): Promise<void> {
  const id = parseInt(req.params.id);
  const publisherService = new PublisherService();

  const publisher = await publisherService.show({ id });
  if (publisher) {
    res.json(publisher);
  } else {
    res.status(404).json({ error: 'Publisher not found' });
  }
}

export async function get(req: Request, res: Response): Promise<void> {
  const publisherService = new PublisherService();
  const { skip, take } = req.query;
  const where = parseWhere(req.query.where as string);
  const [count, publishers] = await publisherService.get({
    skip: Math.abs(Number(skip ?? 0)) * Number(take ?? 10),
    take: Number(take ?? 10),
    where,
  });
  res.header('X-Total-Count', `${count}`);
  res.json(publishers);
}

export async function update(req: Request, res: Response): Promise<void> {
  const publisherService = new PublisherService();

  const id = parseInt(req.params.id);
  const validatedData = publisherSchema.partial().parse(req.body);
  const publisher = await publisherService.update(id, validatedData);
  if (!publisher) throw new CustomError('Publisher not found', 400);
  res.json(publisher);
}

export async function remove(req: Request, res: Response): Promise<void> {
  try {
    const publisherService = new PublisherService();

    const id = parseInt(req.params.id);
    await publisherService.remove(id);
    res.status(204).send();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to delete publisher' });
  }
}
