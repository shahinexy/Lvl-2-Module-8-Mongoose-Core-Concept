
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyServices } from './academicFaculty.server';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyServices.createAcademicFacultyInDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculty is created successfully',
    data: result,
  });
});

const getAllAcademicFaculty = catchAsync(async (req, res)=>{
    const result = await AcademicFacultyServices.getAllAcademicFacultyFromDB()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Academic Faculty get successfully',
        data: result,
      });
})

const getSingleAcademicFaculty = catchAsync(async (req, res)=>{
    const {facultyId} = req.params;
    const result = await AcademicFacultyServices.getSingleAcademicFacultyFromDB(facultyId)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Single Academic Faculty get successfully',
        data: result,
      });
})

const updateSingleAcademicFaculty = catchAsync(async(req, res)=>{
  const {facultyId} = req.params;
  const result = await AcademicFacultyServices.updateSingleAcademicFacultyFromDB(facultyId, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculty data updated successfully',
    data: result,
  });
})


export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicFaculty,
  updateSingleAcademicFaculty
};
