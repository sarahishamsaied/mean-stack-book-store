import { Request, Response, NextFunction } from 'express';

export type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Wraps an async route handler to catch any errors and pass them to the next middleware
 * @param handler - The async route handler
 * @returns - A middleware function
 * @example
 * const create = async asyncWrapper((req: Request, res: Response) => {
 *  const user = await User.create(req.body);
 * res.json(user);
 * });
 *
 */
export const asyncWrapper =
  (handler: (req: Request, res: Response, next: NextFunction) => void | Promise<void>) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = handler(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
