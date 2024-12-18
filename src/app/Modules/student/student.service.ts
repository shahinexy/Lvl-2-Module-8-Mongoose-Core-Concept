// ========= route -> controller -> service ==========
import { StudentModle } from "../student.model";
import { Student } from "./student.interface";

const createStudentIntoDB = async (studentData: Student) =>{
    // build in static method
    // const result = await StudentModle.create(studentData)
    // return result;

    // Create a custom statics method
    if(await StudentModle.isUserExists(studentData.id)){
        throw new Error('user already exists')
    }

    const result = await StudentModle.create(studentData) // build in statics method

    // ==== build in instance method ====
    // const student = new StudentModle(studentData) // create an instance
    
    // Create a custom instance method
    // if(await student.isUserExists(studentData.id)){
    //     throw new Error('user already exists')
    // }
    // end

    // const result = await student.save()  
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