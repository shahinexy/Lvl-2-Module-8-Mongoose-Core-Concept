import { TOfferedCourse } from "./offeredCourses.interface";
import { OfferedCourseModel } from "./offeredCourses.model";


const createOfferedCourseInDB = async (payload: TOfferedCourse) => {
  const result = await OfferedCourseModel.create(payload);
  return result;
};

const getAllOfferedCourseFromDB = async () =>{
    const result = await OfferedCourseModel.find();
    return result;
}

const getSingleOfferedCourseFromDB = async (id: string) =>{
    const result = await OfferedCourseModel.findOne({_id: id});
    return result;
}

const updateSingleOfferedCourseFromDB = async (id: string, payload: Partial<TOfferedCourse>) =>{

  const result = await OfferedCourseModel.findOneAndUpdate({_id: id}, {$set: payload}, {new: true})
  return result;
}


export const OfferedCourseServices = {
  createOfferedCourseInDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateSingleOfferedCourseFromDB
};
