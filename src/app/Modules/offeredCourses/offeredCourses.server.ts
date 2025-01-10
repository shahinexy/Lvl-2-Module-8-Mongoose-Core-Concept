import AppError from '../../error/AppError';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { SemesterRegistrationModel } from '../semesterRegestration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourses.interface';
import { OfferedCourseModel } from './offeredCourses.model';

const createOfferedCourseInDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = payload;

  const isSemesterRegistrationExists = await SemesterRegistrationModel.findById(semesterRegistration);

  if(!isSemesterRegistrationExists){
    throw new AppError(404, 'Semester Registration Not Found')
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;
  
  const isAcademicFacultyExists = await AcademicFacultyModel.findById(academicFaculty);

  if(!isAcademicFacultyExists){
    throw new AppError(404, 'Academic Faculty Not Found')
  }

  // const isAcademicSemesterExists = await AcademicSemesterModel.findById(academicSemester);

  // if(!isAcademicSemesterExists){
  //   throw new AppError(404, 'Semester Registration Not Found')
  // }

  const isAcademicDepartmentExists = await AcademicDepartmentModel.findById(academicDepartment);

  if(!isAcademicDepartmentExists){
    throw new AppError(404, 'Semester Registration Not Found')
  }

  const isCourseExists = await CourseModel.findById(course);

  if(!isCourseExists){
    throw new AppError(404, 'Course Not Found')
  }

  const isFacultyExists = await FacultyModel.findById(faculty);

  if(!isFacultyExists){
    throw new AppError(404, 'Faculty Not Found')
  }

  const result = await OfferedCourseModel.create({...payload, academicSemester});
  return result;
};

const getAllOfferedCourseFromDB = async () => {
  const result = await OfferedCourseModel.find();
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findOne({ _id: id });
  return result;
};

const updateSingleOfferedCourseFromDB = async (
  id: string,
  payload: Partial<TOfferedCourse>,
) => {
  const result = await OfferedCourseModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseInDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateSingleOfferedCourseFromDB,
};
