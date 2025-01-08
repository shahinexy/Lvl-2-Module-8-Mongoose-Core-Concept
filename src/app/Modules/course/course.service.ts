import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import { TCourse } from './course.interface';
import { CourseModel } from './course.model';

const createCourseInToDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload);
  return result;
};

const getAllCourseFromDB = async () => {
  const result = await CourseModel.find().populate({
    path: 'preRequisiteCourses',
    populate: 'course',
  });
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};

const updateCourseInToDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const basicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      remainingCourseData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!basicCourseInfo) {
      throw new AppError(400, 'Failed to update course!');
    }

    // Check if there is any pre requisite course to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletePreRequisite = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletePreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletePreRequisite } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletePreRequisiteCourses) {
        throw new AppError(400, 'Failed to update course!');
      }

      // Filter out the new course fields
      const newPreRequisite = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisite } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError(400, 'Failed to update course!');
      }
    }

    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourseInToDB,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  updateCourseInToDB,
  deleteCourseFromDB,
};
