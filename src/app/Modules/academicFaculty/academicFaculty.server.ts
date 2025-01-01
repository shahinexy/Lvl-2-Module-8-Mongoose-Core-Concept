import { TAcademicFaculty } from "./academicFaculty.interface";
import { AcademicFacultyModel } from "./academicFaculty.model";


const createAcademicFacultyInDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

const getAllAcademicFacultyFromDB = async () =>{
    const result = await AcademicFacultyModel.find();
    return result;
}

const getSingleAcademicFacultyFromDB = async (id: string) =>{
    const result = await AcademicFacultyModel.findOne({_id: id});
    return result;
}

const updateSingleAcademicFacultyFromDB = async (id: string, payload: Partial<TAcademicFaculty>) =>{

  const result = await AcademicFacultyModel.findOneAndUpdate({_id: id}, {$set: payload}, {new: true})
  return result;
}


export const AcademicFacultyServices = {
  createAcademicFacultyInDB,
  getAllAcademicFacultyFromDB,
  getSingleAcademicFacultyFromDB,
  updateSingleAcademicFacultyFromDB
};
