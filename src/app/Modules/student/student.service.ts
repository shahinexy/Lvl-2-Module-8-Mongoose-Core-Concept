// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import { StudentModle } from './student.model';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { Student } from './student.interface';

const getAllStudentsFronDB = async () => {
  const res = await StudentModle.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return res;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await StudentModle.findOne({id})

  const result = await StudentModle.findOne({id}).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

const updateStudentInDb = async (id: string, payload: Partial<Student>) =>{
    const result = await StudentModle.findOneAndUpdate({id: id}, payload, {new: true})
    return result
}

// ===== transaction & rollback ====
const deleteStudentFromDB = async (id: string) => {

    const isIdExists = await StudentModle.findOne({id: id})

    if(!isIdExists){
      throw new AppError(400, 'This user dose not exists')
    }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteStudent = await StudentModle.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(400, 'Faild to delete student');
    }

    const deleteUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(400, 'Faild to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
  }
};

export const StudentServices = {
  getAllStudentsFronDB,
  getSingleStudentFromDB,
  updateStudentInDb,
  deleteStudentFromDB
};
