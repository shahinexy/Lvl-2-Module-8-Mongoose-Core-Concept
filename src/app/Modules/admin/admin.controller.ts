// ========= route -> controller -> service ==========
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { AdminServices } from './admin.service';

// import studentSchema from './student.joi.validation';

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminServices.getAllAdminsFronDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student are retrieved successfully',
    data: result,
  });
});

const getAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single Admin successfully',
    data: result,
  });
});

const searchAdmin = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await AdminServices.searchAdminFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get searched Admin successfully',
    data: result,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Admin } = req.body;
  const result = await AdminServices.updateAdminInDB(id, Admin);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Update Admin data successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Delete Admin successfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getAdmin,
  searchAdmin,
  updateAdmin,
  deleteAdmin,
};