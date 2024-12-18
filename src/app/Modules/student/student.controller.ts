// ========= route -> controller -> service ==========
import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import studentSchema from './student.validation';

// import studentSchema from './student.joi.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    

    const { student: studentData } = req.body;

    // data validation using joi 
    // const { error, value } = studentSchema.validate(studentData);

    // data validation using zod 
    const zodParsedData = studentSchema.parse(studentData)

    // will call service functiont to to send this data
    const result = await StudentServices.createStudentIntoDB(zodParsedData);

    // if (error) {
    //   res.status(500).json({
    //     success: false,
    //     message: 'Somthing went wrong',
    //     error: error.details,
    //   });
    //   return;
    // }

    
    // send response
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

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFronDB();

    res.status(200).json({
      success: true,
      message: 'Student are retrieved successfully',
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

const getStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Get single Student successfully',
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

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Delete Student successfully',
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

export const StudentController = {
  createStudent,
  getAllStudents,
  getStudent,
  deleteStudent
};
