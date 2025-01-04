// ========= route -> controller -> service ==========
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

// import studentSchema from './student.joi.validation';

const getAllStudents = catchAsync(async (req, res) => {
  const result = await StudentServices.getAllStudentsFronDB();

  // res.status(200).json({
  //   success: true,
  //   message: 'Student are retrieved successfully',
  //   data: result,
  // });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student are retrieved successfully',
    data: result,
  });
});

const getStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get single Student successfully',
    data: result,
  });
});

const searchStudent = catchAsync(async(req,res)=>{
  const query = req.query;
  const result = await StudentServices.searchStudentFromDB(query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get searched Student successfully',
    data: result,
  });
})

const updateStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const {student} = req.body;
  const result = await StudentServices.updateStudentInDb(studentId, student);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Update Student data successfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentServices.deleteStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Delete Student successfully',
    data: result,
  });
});

export const StudentController = {
  getAllStudents,
  getStudent,
  searchStudent,
  updateStudent,
  deleteStudent,
};
