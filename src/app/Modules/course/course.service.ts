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

  const basicCourseInfo = await CourseModel.findByIdAndUpdate(
    id,
    remainingCourseData,
    {
      new: true,
      runValidators: true,
    },
  );
  console.log(preRequisiteCourses);
  // Check if there is any pre requisite course to update
  if (preRequisiteCourses && preRequisiteCourses.length > 0) {
    const deletePreRequisite = preRequisiteCourses
      .filter((el) => el.course && el.isDeleted)
      .map((el) => el.course);
    
      const deletePreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {$pull:{
          preRequisiteCourses: {course: {$in: deletePreRequisite}}
        }}
      )
  }

  return basicCourseInfo;
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
