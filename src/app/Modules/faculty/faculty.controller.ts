// ========= route -> controller -> service ==========
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';

// import studentSchema from './student.joi.validation';

const getAllFacultys = catchAsync(async (req, res) => {
  console.log('Cookies', req.cookies);
  const result = await FacultyServices.getAllFacultysFronDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty are retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single Faculty successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyInDB(id, faculty);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Update Faculty data successfully',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Delete Faculty successfully',
    data: result,
  });
});

export const FacultyControllers = {
  getAllFacultys,
  getFaculty,
  updateFaculty,
  deleteFaculty,
};
