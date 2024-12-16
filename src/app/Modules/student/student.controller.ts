import { Request, Response } from "express";
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) =>{
    try{
        const student = req.body;

        // will call service functiont to to send this data 
        const result = await StudentServices.createStudentIntoDB(student)
        // send response
        result.status(200).json({
            success: true,
            message: 'Student created successfully',
            data: result
        })
    }catch(err){
        console.log(err);
    }

}


export const  StudentController = {
    createStudent,
}