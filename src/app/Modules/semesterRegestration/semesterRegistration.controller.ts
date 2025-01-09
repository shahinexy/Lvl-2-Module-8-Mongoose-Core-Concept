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

const getSingleSemesterRegister = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationServices.getSingleSemesterRegistersFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Single Semester Regestration get successfully',
    data: result,
  });
});

const updateSemesterRegister = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await semesterRegistrationServices.updateSemesterRegistersFromDB(
      id,
      req.body,
    );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Update Semester Regestration successfully',
    data: result,
  });
});

export const SemesterRegistrationControllers = {
  createSemesterRegestration,
  getAllSemesterRegestration,
  getSingleSemesterRegister,
  updateSemesterRegister,
};
