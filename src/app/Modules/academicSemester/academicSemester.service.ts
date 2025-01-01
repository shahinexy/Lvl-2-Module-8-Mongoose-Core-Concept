import AppError from '../../error/AppError';
import { semesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.inferface';
import { AcademicSemesterModel } from './academicSemester.model';

const createAcademicSemesterInDB = async (payload: TAcademicSemester) => {
  if (semesterNameCodeMapper[payload.name] !== payload.code) {
    throw new AppError(404, 'Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () =>{
    const result = await AcademicSemesterModel.find();
    return result;
}

const getSingleAcademicSemesterFromDB = async (semesterId: string) =>{
    const result = await AcademicSemesterModel.findOne({_id: semesterId});
    return result;
}

const updateSingleAcademicSemesterFromDB = async (semesterId: string, payload: Partial<TAcademicSemester>) =>{

  if(payload.name && payload.code && semesterNameCodeMapper[payload.name] !== payload.code){
    throw new AppError(404, 'Invalid Semester Code')
  }

  const result = await AcademicSemesterModel.findOneAndUpdate({_id: semesterId}, {$set: payload}, {new: true})
  return result;
}


export const AcademicSemesterServices = {
  createAcademicSemesterInDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updateSingleAcademicSemesterFromDB
};
