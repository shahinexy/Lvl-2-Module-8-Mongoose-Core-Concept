// ========= route -> controller -> service ==========
import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';

// import studentSchema from './student.joi.validation';


const getAllStudents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentsFronDB();

    res.status(200).json({
      success: true,
      message: 'Student are retrieved successfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const getStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Get single Student successfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    res.status(200).json({
      success: true,
      message: 'Delete Student successfully',
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

export const StudentController = {
  getAllStudents,
  getStudent,
  deleteStudent
};
