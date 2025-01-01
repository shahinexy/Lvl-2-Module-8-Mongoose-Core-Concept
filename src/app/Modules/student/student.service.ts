// ========= route -> controller -> service ==========
import { StudentModle } from "./student.model";



const getAllStudentsFronDB = async ()=>{
    const res = await StudentModle.find().populate('admissionSemester').populate({
        path: 'academicDepartment',
        populate:{
            path: 'academicFaculty'
        }
    });
    return res;
}

const getSingleStudentFromDB = async (id: string)=>{
    // const result = await StudentModle.findOne({id})

    const result = await StudentModle.findById(id).populate({
        path: 'academicDepartment',
        populate:{
            path: 'academicFaculty'
        }
    });
    return result;
}

const deleteStudentFromDB = async (id: string)=>{
    const result = await StudentModle.updateOne({id}, {isDeleted: true})
    return result;
}

export const  StudentServices = {
    getAllStudentsFronDB,
    getSingleStudentFromDB,
    deleteStudentFromDB
}