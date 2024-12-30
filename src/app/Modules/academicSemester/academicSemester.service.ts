import { semesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.inferface';
import { AcademicSemesterModel } from './academicSemester.model';

const createAcademicSemesterInDB = async (payload: TAcademicSemester) => {
  if (semesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemesterModel.create(payload);
  return result;
};

const getAllAcademicSemesterFromDB = async () =>{
    const result = await AcademicSemesterModel.find();
    return result;
}

export const AcademicSemesterServices = {
  createAcademicSemesterInDB,
  getAllAcademicSemesterFromDB
};
