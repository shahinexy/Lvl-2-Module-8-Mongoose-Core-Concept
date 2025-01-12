import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../Modules/user/user.interface';

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const token = req.headers.authorization;

      if (!token) {
        throw new AppError(401, 'You are not authorize');
      }

      // check token is valid
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;

      const { role, userId, iat } = decoded;

      if (requiredRole && !requiredRole.includes(role)) {
        throw new AppError(401, 'You are not authorize');
      }

      req.user = decoded as JwtPayload;

      next();
    },
  );
};

export default auth;
