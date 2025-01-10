import AppError from '../../error/AppError';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
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
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester Registration Not Found');
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  const isAcademicFacultyExists =
    await AcademicFacultyModel.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(404, 'Academic Faculty Not Found');
  }

  const isAcademicDepartmentExists =
    await AcademicDepartmentModel.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(404, 'Semester Registration Not Found');
  }

  const isCourseExists = await CourseModel.findById(course);

  if (!isCourseExists) {
    throw new AppError(404, 'Course Not Found');
  }

  const isFacultyExists = await FacultyModel.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty Not Found');
  }

  // check if the department is belong to the faculty
  const isDepartmentBelongToFaculty = await AcademicDepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      400,
      `This ${isAcademicDepartmentExists.name} is not  belong to this ${isAcademicFacultyExists.name}`,
    );
  }

  // check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourseModel.findOne({
      semesterRegistration,
      section,
      course,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      400,
      `Offered course with same section is already exist!`,
    );
  }

  // get the schedules of the faculties
  const assignedShedule = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');
  console.log(assignedShedule);
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  assignedShedule.forEach((schedule) => {
    const existingStratTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStratTime) {
      throw new AppError(
        409,
        'This faculty is not available at that time ! Choose other time or day',
      );
    }
  });

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
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
