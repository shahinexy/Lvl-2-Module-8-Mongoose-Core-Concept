// ========= route -> controller -> service ==========
import { StudentModle } from "./student.model";



const getAllStudentsFronDB = async ()=>{
    const res = await StudentModle.find();
    return res;
}

const getSingleStudentFromDB = async (id: string)=>{
    // const result = await StudentModle.findOne({id})

    const result = await StudentModle.aggregate([
        {$match: {id: id}}
    ])
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