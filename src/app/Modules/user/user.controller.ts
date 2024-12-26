// import studentSchema from "../student/student.validation";

import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.server";


const createStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const {password, student: studentData } = req.body;

    //   const zodParsedData = studentSchema.parse(studentData)

      const result = await UserServices.createStudentIntoDB(password, studentData);

      res.status(200).json({
        success: true,
        message: 'Student created successfully',
        data: result,
      });
    } catch (err) {
      next(err)
    }
  };

  export const UsreControllers ={
    createStudent
  }