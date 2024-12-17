// ========= route -> controller -> service ==========
import { Request, Response } from "express";
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) =>{
    try{
        const {student: studentData} = req.body;

        // will call service functiont to to send this data 
        const result = await StudentServices.createStudentIntoDB(studentData)
        // send response
        res.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result
        })
    }catch(err){
        console.log(err);
    }

}

const getAllStudents = async (req: Request, res: Response)=>{
    try{
        const result = await StudentServices.getAllStudentsFronDB();

        res.status(200).json({
            success: true,
            message: 'Student are retrieved successfully',
            data: result
        })

    }catch(err){
        console.log(err);
    }
}


export const  StudentController = {
    createStudent,
    getAllStudents
}