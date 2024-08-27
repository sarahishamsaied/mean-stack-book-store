import { Request, Response } from 'express';
import { CustomError } from './CustomError';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response) => {
  console.log('jere!');
  console.log('error is', err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
};
