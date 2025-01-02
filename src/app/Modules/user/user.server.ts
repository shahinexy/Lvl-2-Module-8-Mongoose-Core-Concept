import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../student/student.interface';
import { StudentModle } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { GenaretStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: Student) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // genareted student id
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

    userData.id = await GenaretStudentId(admissionSemester);

    // create a user
    const newUser = await UserModel.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Faild to create user');
    }

    // create a student
    // set id, _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; // reference _id

    const newStudent = await StudentModle.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(400, 'Faild to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const UserServices = {
  createStudentIntoDB,
};
