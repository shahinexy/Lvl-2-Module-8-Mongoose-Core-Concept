import { StudentModle } from "../student.model";
import { Student } from "./student.interface";

const createStudentIntoDB = async (student: Student) =>{
    const result = await StudentModle.create(student)
    return result;
}

export const  StudentServices = {
    createStudentIntoDB
}