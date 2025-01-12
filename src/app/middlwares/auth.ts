import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';


const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization;

    if (!token) {
      throw new AppError(401, 'You are not authorize');
    }

    // check token is valid
    const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
    console.log(decoded);

    const { role, userId, iat } = decoded;

    req.user = decoded as JwtPayload ;

    next();
  });
};

export default auth;
