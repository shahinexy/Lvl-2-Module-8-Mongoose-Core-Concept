/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../student/student.interface';
import { StudentModle } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import {
  GenaretAdminId,
  GenaretFacultyId,
  GenaretStudentId,
} from './user.utils';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { FacultyModel } from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import { AdminModel } from '../admin/admin.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { path } from 'path';

const createStudentIntoDB = async (
  file: any,
  password: string,
  payload: Student,
) => {
  const isEmailExists = await StudentModle.findOne({ email: payload.email });

  if (isEmailExists) {
    throw new AppError(400, 'Email already exists');
  }

  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';
  // set email
  userData.email = payload.email;

  //
  const admissionSemester = await AcademicSemesterModel.findById(
    payload.admissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(404, 'Admission semester not found.');
  }

  // ===== transaction & rollback ====
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // genareted student id
    userData.id = await GenaretStudentId(admissionSemester);

    const path = file?.path;
    const fileName = `${userData.id}${payload.name.firstName}`;
    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(path, fileName);

    // create a user
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Faild to create user');
    }

    // create a student
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id
    payload.profileImg = secure_url;

    const newStudent = await StudentModle.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(400, 'Faild to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

const createFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  // set feculty role
  userData.role = 'faculty';
  // set email
  userData.email = payload.email;

  const academicDepartment = await AcademicDepartmentModel.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(404, 'Academic Department not found');
  }

  // transaction rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // genaret faculty id
    userData.id = await GenaretFacultyId();

    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Faild to create User');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await FacultyModel.create([payload], { session });

    if (!newFaculty) {
      throw new AppError(400, 'Faild to create Faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  // create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_password as string);

  // set role
  userData.role = 'admin';
  // set email
  userData.email = payload.email;

  // transaction rollback
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // genaret Admin id
    userData.id = await GenaretAdminId();
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Faild to create User');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await AdminModel.create([payload], { session });

    if (!newAdmin) {
      throw new AppError(400, 'Faild to create Admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const getMe = async (userId: string, role: string) => {
  let result = null;
  if (role === 'student') {
    result = await StudentModle.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await AdminModel.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await FacultyModel.findOne({ id: userId }).populate('user');
  }

  return result;
};

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
  createAdminIntoDB,
  changeStatus,
  getMe,
};
