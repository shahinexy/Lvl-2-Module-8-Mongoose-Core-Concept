// import studentSchema from "../student/student.validation";

import { UserServices } from "./user.server";


const createStudent = async (req: Request, res: Response) => {
    try {
      
      const {password, student: studentData } = req.body;

    //   const zodParsedData = studentSchema.parse(studentData)

      const result = await UserServices.createStudentIntoDB(password, studentData);

      res.status(200).json({
        success: true,
        message: 'Student created successfully',
        data: result,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || 'Somthing went wrong',
        error: err,
      });
    }
  };