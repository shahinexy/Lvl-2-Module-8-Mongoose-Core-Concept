import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterServices.createAcademicSemesterInDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semester is created successfully',
    data: result,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res)=>{
    const result = await AcademicSemesterServices.getAllAcademicSemesterFromDB()
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Academic Semester get successfully',
        data: result,
      });
})

const getSingleAcademicSemester = catchAsync(async (req, res)=>{
    const {semesterId} = req.params;
    const result = await AcademicSemesterServices.getSingleAcademicSemesterFromDB(semesterId)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Single Academic Semester get successfully',
        data: result,
      });
})


export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester
};
