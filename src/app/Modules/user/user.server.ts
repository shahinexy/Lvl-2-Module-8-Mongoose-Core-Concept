import config from '../../config';
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
  const admissionSemester = await AcademicSemesterModel.findById(payload.admissionSemester)

  if (!admissionSemester) {
    throw new Error('Admission semester not found.');
  }  

  userData.id = await GenaretStudentId(admissionSemester);

  // create a user
  const newUser = await UserModel.create(userData);

  // create a student
  if(Object.keys(newUser).length){
    // set id, _id as user
    payload.id = newUser.id;
    payload.user = newUser._id; // reference _id

    const newStudent = await StudentModle.create(payload);
    return newStudent
  }

};

export const UserServices = {
  createStudentIntoDB,
};
