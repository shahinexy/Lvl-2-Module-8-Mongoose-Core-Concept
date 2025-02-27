import { UserServices } from './user.server';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { JwtPayload } from 'jsonwebtoken';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const result = await UserServices.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student created successfully',
    data: result,
  });
});

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserServices.createFacultyIntoDB(
    req.file,
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: AdminData } = req.body;

  const result = await UserServices.createAdminIntoDB(
    req.file,
    password,
    AdminData,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;

  const result = await UserServices.changeStatus(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Status is updated succesfully',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user as JwtPayload;

  const result = await UserServices.getMe(userId, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User is retrieved succesfully',
    data: result,
  });
});

export const UsreControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  changeStatus,
  getMe,
};
