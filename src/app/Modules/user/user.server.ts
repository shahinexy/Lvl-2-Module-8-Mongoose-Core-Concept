import config from '../../config';
import { Student } from '../student/student.interface';
import { StudentModle } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';

const createStudentIntoDB = async (password: string, studentData: Student) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // if password is not given, use default password
  userData.password = password || (config.default_password as string);

  // set student role
  userData.role = 'student';

  // set manually genareted id
  userData.id = '2030100001';

  // create a user
  const newUser = await User.create(userData);

  // create a student
  if(Object.keys(newUser).length){
    // set id, _id as user
    studentData.id = newUser.id;
    studentData.user = newUser._id; // reference _id

    const newStudent = await StudentModle.create(studentData);
    return newStudent
  }

};

export const UserServices = {
  createStudentIntoDB,
};
