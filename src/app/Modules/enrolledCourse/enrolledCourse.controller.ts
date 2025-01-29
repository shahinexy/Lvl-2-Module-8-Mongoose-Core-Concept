import status from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const userId = req.user?.userId;
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is enrolled succesfully',
    data: result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId;

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  );

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Enrolled courses are retrivied succesfully',
    meta: result.meta,
    data: result.result,
  });
});

const updateEnrolledCourseMarksIntoDB = catchAsync(async (req, res) => {
  const faculty = req.user?.userId;
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    faculty,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Mark updated succesfully',
    data: result,
  });
});

export const EnrolledCourseControllers = {
  createEnrolledCourse,
  getMyEnrolledCourses,
  updateEnrolledCourseMarksIntoDB,
};
