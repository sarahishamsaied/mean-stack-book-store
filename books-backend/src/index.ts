// index.ts

import express from 'express';

import coordinator from './Routes/coordinator';
import dotenv from 'dotenv';
import { CustomError } from './Errors/CustomError';
import cors from 'cors';
import { ZodError } from 'zod';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
// app.use(express.json());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb', parameterLimit: 50000 }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {
  res.header('Access-Control-Expose-Headers', 'X-Total-Count');
  next();
});

app.use('/api', coordinator);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('jere!');
  console.log('error is', err);
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: err.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  console.error(err);
  return res.status(500).json({ message: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
