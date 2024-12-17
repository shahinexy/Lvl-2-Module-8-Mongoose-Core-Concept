// ========= route -> controller -> service ==========
import { StudentModle } from "../student.model";
import { Student } from "./student.interface";

const createStudentIntoDB = async (student: Student) =>{
    const result = await StudentModle.create(student)
    return result;
}

const getAllStudentsFronDB = async ()=>{
    const res = await StudentModle.find();
    return res;
}

const getSingleStudentFromDB = async (id: string)=>{
    const result = await StudentModle.findOne({id})
    return result;
}

export const  StudentServices = {
    createStudentIntoDB,
    getAllStudentsFronDB,
    getSingleStudentFromDB,
}