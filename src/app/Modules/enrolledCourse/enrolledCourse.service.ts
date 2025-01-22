import AppError from '../../error/AppError';
import { OfferedCourseModel } from '../offeredCourses/offeredCourses.model';
import { StudentModle } from '../student/student.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourseModel from './enrolledCourse.model';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  const isOfferedCourseExists =
    await OfferedCourseModel.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered course not found !');
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(400, 'Room is full !');
  }

  const student = await StudentModle.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(404, 'Student not found !');
  }
  const isStudentAlreadyEnrolled = await EnrolledCourseModel.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError(400, 'Student is already enrolled !');
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
