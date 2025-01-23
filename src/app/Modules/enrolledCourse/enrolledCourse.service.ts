/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
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

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourseModel.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse: offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(404, 'Failed to enroll in this cousre !');
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourseModel.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
