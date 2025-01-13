import config from '../../config';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { CreateToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // check if user exists
  const isUserExists = await UserModel.findOne({ id: payload.id }).select(
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

  // check if the password correct
  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    isUserExists.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(400, 'Password do not matched');
  }

  // create token and send to the client
  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  // const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret as string, {
  //   expiresIn: '10d',
  // });

  const accessToken = CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = CreateToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: isUserExists.needsPasswordChange,
  };
};

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // check if user exists
  const isUserExists = await UserModel.findOne({ id: userData.userId }).select(
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

  // check if the password correct
  const isPasswordMatched = await bcrypt.compare(
    payload.oldPassword,
    isUserExists.password,
  );

  if (!isPasswordMatched) {
    throw new AppError(400, 'Password do not matched');
  }

  // has new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_round),
  );

  await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string)=>{

  if (!token) {
    throw new AppError(401, 'You are not authorize 1');
  }

  // check token is valid
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

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

  // check if password changed
  if(isUserExists.passwordChangedAt &&
    UserModel.isJwtIssuedBeforePasswordChanged(
      isUserExists.passwordChangedAt,
      iat as number
    )
  ){
    throw new AppError(401, 'You are not authorize');
  }

  const jwtPayload = {
    userId: isUserExists.id,
    role: isUserExists.role,
  };

  const accessToken = CreateToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken
  }

}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken
};
