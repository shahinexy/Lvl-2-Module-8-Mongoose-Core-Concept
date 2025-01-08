import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseInToDB(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Create Course Successfully',
    data: result,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCourseFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get all Course Successfully',
    data: result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCourseFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Get Single Course Successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseInToDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Update Course Successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Delete Course Successfully',
    data: result,
  });
});

const assignFacultyWithCourse = catchAsync(async(req,res)=>{
  const {courseId} = req.params;
  const {faculties} = req.body;

  const result = await CourseServices.assignFacultyWithCourseIntoDB(courseId, faculties)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties assigned Successfully',
    data: result,
  });
})

export const CourseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultyWithCourse
};
