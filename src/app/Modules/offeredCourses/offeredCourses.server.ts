import status from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { AcademicDepartmentModel } from '../academicDepartment/academicDepartment.model';
import { AcademicFacultyModel } from '../academicFaculty/academicFaculty.model';
import { CourseModel } from '../course/course.model';
import { FacultyModel } from '../faculty/faculty.model';
import { SemesterRegistrationModel } from '../semesterRegestration/semesterRegistration.model';
import { StudentModle } from '../student/student.model';
import { TOfferedCourse } from './offeredCourses.interface';
import { OfferedCourseModel } from './offeredCourses.model';
import { hasTimeConflict } from './offeredCourses.utils';

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

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedShedule, newSchedule)) {
    throw new AppError(
      409,
      'This faculty is not available at that time ! Choose other time or day',
    );
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  });
  return result;
};

const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await courseQuery.cuntTotal();
  const result = await courseQuery.modelQuery;
  return { meta, result };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findById(id);
  return result;
};

const getMyOfferedCourseFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  //pagination setup

  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  const student = await StudentModle.findOne({ id: userId });

  if (!student) {
    throw new AppError(status.NOT_FOUND, 'User not found');
  }

  const currentOngoingSemester = await SemesterRegistrationModel.findOne({
    status: 'ONGOING',
  });

  if (!currentOngoingSemester) {
    throw new AppError(status.NOT_FOUND, 'No Ongoing Semester Found');
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingSemester._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingSemester: currentOngoingSemester._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$semesterRegistration', '$$currentOngoingSemester'],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledcourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseId: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseId',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledcourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];

  const result = await OfferedCourseModel.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ]);

  const total = (await OfferedCourseModel.aggregate(aggregationQuery)).length;

  const totalPage = Math.ceil(result.length / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

const updateSingleOfferedCourseFromDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourseModel.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course Not Found');
  }

  const isFacultyExists = await FacultyModel.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty Not Found');
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const selecteSemesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration);

  if (selecteSemesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `You can not update this offered course as it is ${selecteSemesterRegistrationStatus?.status}`,
    );
  }

  // get the schedules of the faculties
  const assignedShedule = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedShedule, newSchedule)) {
    throw new AppError(
      409,
      'This faculty is not available at that time ! Choose other time or day',
    );
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourseModel.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course Not Found');
  }

  const semesterRegistration = await SemesterRegistrationModel.findById(
    isOfferedCourseExists.semesterRegistration,
  );

  if (semesterRegistration?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `Offered course can not update ! because the semester ${semesterRegistration?.status}`,
    );
  }

  const result = await OfferedCourseModel.findByIdAndDelete(id);
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseInDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  getMyOfferedCourseFromDB,
  updateSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
