
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.server';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.createAcademicDepartmentInDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department is created successfully',
    data: result,
  });
});

const getAllAcademicDepartment = catchAsync(async (req, res)=>{
    const result = await AcademicDepartmentServices.getAllAcademicDepartmentFromDB(req.query)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All Academic Department get successfully',
        meta: result.meta,
        data: result.result,
      });
})

const getSingleAcademicDepartment = catchAsync(async (req, res)=>{
    const {departmentId} = req.params;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(departmentId)
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Single Academic Department get successfully',
        data: result,
      });
})

const updateSingleAcademicDepartment = catchAsync(async(req, res)=>{
  const {departmentId} = req.params;
  const result = await AcademicDepartmentServices.updateSingleAcademicDepartmentFromDB(departmentId, req.body)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department data updated successfully',
    data: result,
  });
})


export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateSingleAcademicDepartment
};
