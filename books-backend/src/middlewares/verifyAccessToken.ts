import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { CustomError } from '../Errors/CustomError';
/**
 * Verifies the access token and adds the user to the request object
 * @param req - The request object
 * @param res - The response object
 * @param next - The next middleware function
 * @returns - A middleware function
 */

export interface CustomRequest extends Request {
  userId: string | JwtPayload;
}

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log('TOKEN ISSSSSSSSSSSS=================', token, '=====================');
  if (!token) {
    throw new CustomError('Access token is required', 401);
  }
  try {
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET as string) as JwtPayload;
    console.log('payload is', payload);
    if (!payload) {
      throw new CustomError('Invalid access token', 401);
    }
    (req as CustomRequest).userId = payload.id;

    next();
  } catch (error) {
    console.log(error);
    throw new CustomError('Invalid access token', 401);
  }
};
