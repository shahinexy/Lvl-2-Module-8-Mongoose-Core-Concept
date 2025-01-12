import config from '../../config';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

const loginUser = async (payload: TLoginUser) => {
  // check if user exists
  const isUserExists = await UserModel.findOne({ id: payload.id }).select('+password');

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
    role: isUserExists.role
  }

  const accessToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    { expiresIn: '10d' },
  );

  return {
    accessToken,
    needPasswordChange: isUserExists.needsPasswordChange
  };
};

const changePassword = async (userData: JwtPayload, payload: {oldPassword: string, newPassword: string})=>{
 // check if user exists
 const isUserExists = await UserModel.findOne({ id: userData.userId }).select('+password');

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
 const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_round));

  await UserModel.findOneAndUpdate({
    id: userData.userId,
    role: userData.role
  }, {password: newHashedPassword, needsPasswordChange: false, passwordChangedAt: new Date})

  return null;
} 

export const AuthServices = {
  loginUser,
  changePassword
};
