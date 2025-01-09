import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { semesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegestration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationServices.createSemesterRegestrationIntoDB(
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Regestration successfully',
    data: result,
  });
});

const getAllSemesterRegestration = catchAsync(async (req, res) => {
  const result =
    await semesterRegistrationServices.getAllSemesterRegistersFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Regestration successfully',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegestration,
  getAllSemesterRegestration
};
