// ========= route -> controller -> service ==========
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { FacultyServices } from './faculty.service';

// import studentSchema from './student.joi.validation';

const getAllFacultys = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultysFronDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student are retrieved successfully',
    data: result,
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

const searchFaculty = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await FacultyServices.searchFacultyFromDB(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get searched Faculty successfully',
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
  searchFaculty,
  updateFaculty,
  deleteFaculty,
};
