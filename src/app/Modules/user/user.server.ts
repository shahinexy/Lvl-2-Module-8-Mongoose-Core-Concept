import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { Student } from '../student/student.interface';
import { StudentModle } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';
import { GenaretFacultyId, GenaretStudentId } from './user.utils';
import { TFaculty } from '../faculty/faculty.interface';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { FacultyModel } from '../faculty/faculty.model';

const createStudentIntoDB = async (password: string, payload: Student) => {
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

  const academicDepartment = await AcademicDepartmentModel.findById(payload.academicDepartment);

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

export const UserServices = {
  createStudentIntoDB,
  createFacultyIntoDB,
};
