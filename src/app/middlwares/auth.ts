import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../error/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../Modules/user/user.interface';
import { UserModel } from '../Modules/user/user.model';

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

      // check if user exists
      const isUserExists = await UserModel.findOne({ id: userId }).select(
        '+password',
      );

      if (!isUserExists) {
        throw new AppError(404, 'This user is not found');
      }

      // check if user is already delete
      const isDelete = isUserExists.isDeleted;

      if (isDelete) {
        throw new AppError(403, 'This user is deleted');
      }

      // check if the use is blocked
      const userStatus = isUserExists.status;

      if (userStatus === 'blocked') {
        throw new AppError(403, 'This user is Bolocked');
      }

      if (requiredRole && !requiredRole.includes(role)) {
        throw new AppError(401, 'You are not authorize');
      }

      req.user = decoded as JwtPayload;

      next();
    },
  );
};

export default auth;
