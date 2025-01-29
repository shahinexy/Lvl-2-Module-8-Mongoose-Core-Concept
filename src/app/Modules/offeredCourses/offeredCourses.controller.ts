import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourses.server';

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseInDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Course is created successfully !',
    data: result,
  });
});

const getAllOfferedCourses = catchAsync(async (req, res) => {
    const result = await OfferedCourseServices.getAllOfferedCourseFromDB(req.query)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OfferedCourses retrieved successfully !',
      data: result,
    });
});

const getSingleOfferedCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OfferedCourse fetched successfully',
      data: result,
    });
});

const getMyOfferedCourse = catchAsync(async (req, res) => {
  const {userId} = req.user as JwtPayload;
    const result = await OfferedCourseServices.getMyOfferedCourseFromDB(userId, req.query)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'My Offered Course retrieved successfully',
      data: result,
    });
});

const deleteOfferedCourses = catchAsync(async (req, res) => {
  const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id)
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OfferedCourse fetched successfully',
      data: result,
    });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await OfferedCourseServices.updateSingleOfferedCourseFromDB(
    id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  getMyOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourses,
};
