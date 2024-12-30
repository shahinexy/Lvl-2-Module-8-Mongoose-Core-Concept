import { TAcademicSemester } from "./academicSemester.inferface"
import { AcademicSemesterModel } from "./academicSemester.model"


const createAcademicSemesterInDB = async(payload: TAcademicSemester) =>{
    const result = await AcademicSemesterModel.create(payload);
    return result
}

export const AcademicSemesterServices ={
    createAcademicSemesterInDB
}